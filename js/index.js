//-----------------------------------//
//-----API Controller Module---------//
//-----------------------------------//
const apiController = (function () {
  const clientId = "";
  const clientSecret = "";
  const userId = "";

  //get access token
  const getToken = async () => {
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
      },
      body: "grant_type=client_credentials",
    });
    // console.log(result);

    const data = await result.json();
    // console.log(data);
    return data.access_token;
  };

  //fetch genres from spotify for later sorting
  const getGenres = async (token) => {
    const result = await fetch(
      `https://api.spotify.com/v1/recommendations/available-genre-seeds`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await result.json();
    // console.log(data);
    return data.genres;
  };

  //fetch user playlist information from api
  const getPlaylist = async (token) => {
    getGenres(token);
    const limit = 20;

    const result = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists?limit=${limit}&offset=0`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await result.json();
    // const newData = [];
    // for (i = 0; i < data.items.length; i++) {
    //   newData.push(data.items[i].id)
    // }
    // console.log(data);
    return data
  };

  //function used to fetch playlist track list
  const getPlaylistTrackList = async (playlistID, token) => {
    const result = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await result.json();
    // console.log(data);

    //get playlist id's for playlist items and place them into an array
    // const newData = [];
    // for (i = 0; i < data.items.length; i++) {
    //   let ids = getPlaylistTrackList(data.items[i].id, token);
    //   console.log(data.items[i].id);
    //   newData.push(ids);
    // }
    // console.log(newData);
    return data;
  };

  //function used to fetch individual track info from playlists
  const getTracks = async (trackID, token) => {
    const result = await fetch(`https://api.spotify.com/v1/tracks/${trackID}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await result.json();
    // console.log(data);
    // const newData = [];
    // //use a loop to get track information for individual playlists
    // for (i = 0; i < data.items.length; i++) {
    //   let ids = getTracks(data.items[i].track.id, token);
    //   // console.log(data.items[i].track.id);
    //   newData.push(ids);
    // }
    // console.log(newData);
    return data;
  };

  return {
    getToken() {
      return getToken();
    },
    getGenres(token) {
      return getGenres(token);
    },
    getPlaylist(token) {
      return getPlaylist(token);
    },
    getPlaylistTrackList(playlistID, token) {
      return getPlaylistTrackList(playlistID, token);
    },
    getTracks(trackID, token) {
      return getTracks(trackID, token);
    }
  }
})();

//-----------------------------------//
//-------UI Selector Module----------//
//-----------------------------------//

const uiController = (function () {
  //store html selectors in an object for inputField() method
  const domElements = {
    hToken: "#hidden-token",
    songDetail: "#song-description",
    currentSong: "#current",
    previousSong: "#prev",
    nextSong: "#next",
    playlistArt: "#playlist-art",
    nowPlaying: "#now-playing",
    playlistContents: "#metadata-1",
    otherPlaylists: "#metadata-2",
    genreSelect: "#genre-select",
  };

  return {
    //create a method to callback selectors
    outputField() {
      return {
        songDetail: document.querySelector(domElements.songDetail),
        currentSong: document.querySelector(domElements.currentSong),
        previousSong: document.querySelector(domElements.previousSong),
        nextSong: document.querySelector(domElements.nextSong),
        playlistArt: document.querySelector(domElements.playlistArt),
        nowPlaying: document.querySelector(domElements.nowPlaying),
        playlistSongs: document.querySelector(domElements.playlistContents),
        playlistLibrary: document.querySelector(domElements.otherPlaylists),
        genreSelect: document.querySelector(domElements.genreSelect),
      }
    },

    assignGenre(text, value) {
      const html = `<option value="${value}">${text}</option>`;
      document.querySelector(domElements.genreSelect).insertAdjacentHTML('beforeend', html);
    },

    assignPlaylistArt(img) {
      const image = `<div class="playlist-art" id="playlist-img">
      <img src=${img} class="playlist-pic"></img></div>`;
      document.querySelector(domElements.playlistArt).insertAdjacentHTML('beforeend', image);
    },

    populatePlaylists(url, text) {
      const html = `<div class="playlist-items"><img src=${url} alt=${text}><div class="text">${text}</div></div>`;
      document.querySelector(domElements.otherPlaylists).insertAdjacentHTML('beforeend', html);
    },

    populateTrackList(link, number, name, artist, length) {
      const html = `<div class="track-items"><a href=${link}>${number}. ${name} by ${artist}</a></div>`
      document.querySelector(domElements.playlistContents).insertAdjacentHTML('beforeend', html);
    },

    storeToken(value) {
      document.querySelector(domElements.hToken).value = value;
    },

    getStoredToken() {
      return {
        token: document.querySelector(domElements.hToken).value
      }
    }
  }
})();

//-----------------------------------//
//-------App Control Module----------//
//-----------------------------------//

const appController = (function (apiCtrl, uiCtrl) {
  //get object reference for DOM outputs
  const domOutput = uiCtrl.outputField();
  // console.log(domOutput);

  const genrePopulate = async () => {
    //fetch token
    const token = await apiCtrl.getToken();
    //store token in hidden html element
    uiCtrl.storeToken(token);
    //fetch genres
    const genreObj = await apiCtrl.getGenres(token);
    // console.log(genreObj);
    //populate drop-down menu with genres
    genreObj.forEach(element => uiCtrl.assignGenre(element, element));
  }

  const mainPicPopulate = async () => {
    //fetch token
    const token = await apiCtrl.getToken();
    //store token
    uiCtrl.storeToken(token);
    //fetch playlist image
    const data = await apiCtrl.getPlaylist(token);
    // console.log(data)
    uiCtrl.assignPlaylistArt(data.items[3].images[0].url)
  }

  const playlistPopulate = async () => {
    //fetch token
    const token = await apiCtrl.getToken();
    //store token
    uiCtrl.storeToken(token);
    //fetch playlist info for each playlist
    const data = await apiCtrl.getPlaylist(token);
    for (i = 0; i < data.items.length; i++) {
      // console.log(data.items[i].id)
    uiCtrl.populatePlaylists(data.items[i].images[0].url, data.items[i].name)
    }
    //fetch tracklist info for each track
    const newData = await apiCtrl.getPlaylistTrackList(data.items[3].id, token); 
    console.log(newData);
    for(i = 0; i < newData.items.length; i++) {
      uiCtrl.populateTrackList(newData.items[i].track.external_urls.spotify, i + 1, newData.items[i].track.name, newData.items[i].track.artists[0].name);
    }
  }

  playlistPopulate();
  mainPicPopulate();
  genrePopulate();
})(apiController, uiController);