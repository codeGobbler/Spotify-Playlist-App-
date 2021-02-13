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

  //-----------------------------------//
  //--------API Display Module---------//
  //-----------------------------------//

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
    // console.log(data);
    return data;
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

    return data;
  };

  //function used to fetch individual track info from playlists
  const getTracksInfo = async (trackID, token) => {
    const result = await fetch(`https://api.spotify.com/v1/tracks/${trackID}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await result.json();
    return data;
  };

  //-----------------------------------//
  //--------API Function Module--------//
  //-----------------------------------//

  //fetch play/pause
  const playFunction = async (token, uri) => {
    const result = await fetch(`https://api.spotify.com/v1/me/player/play`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: `{"context_uri":"spotify:track:${uri}","offset":{"position":5},"position_ms":0}`,
    });
    const data = await result.json();
    console.log("playing", data);
    return data;
  };

  //-----------------------------------//
  //-------------Returns---------------//
  //-----------------------------------//

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
    getTracksInfo(trackID, token) {
      return getTracksInfo(trackID, token);
    },
    playFunction(token, uri) {
      return playFunction(token, uri);
    },
  };
})();

//-----------------------------------//
//-------UI Selector Module----------//
//-----------------------------------//

const uiController = (function () {
  //store html selectors in an object for outputField() method
  const domElements = {
    hToken: "#hidden-token",
    songDetail: "#song-description",
    previousSong: "#prev",
    currentSong: "#current",
    nextSong: "#next",
    title: "#playlist-title",
    playlistArt: "#playlist-art",
    nowPlaying: "#now-playing",
    playlistContents: "#metadata-1",
    otherPlaylists: "#metadata-2",
    genreSelect: "#genre-select",
    genreValue: "#genre-item",
  };

  return {
    //create a method to callback selectors
    outputField() {
      return {
        songDetail: document.querySelector(domElements.songDetail),
        previousSong: document.querySelector(domElements.previousSong),
        currentSong: document.querySelector(domElements.currentSong),
        nextSong: document.querySelector(domElements.nextSong),
        title: document.querySelector(domElements.title),
        playlistArt: document.querySelector(domElements.playlistArt),
        nowPlaying: document.querySelector(domElements.nowPlaying),
        playlistSongs: document.querySelector(domElements.playlistContents),
        playlistLibrary: document.querySelector(domElements.otherPlaylists),
        genreSelect: document.querySelector(domElements.genreSelect),
        genreValue: document.querySelector(domElements.genreValue),
      };
    },
    //general ui info population methods
    assignGenre(text, value) {
      const html = `<option id="genre-item" value="${value}">${text}</option>`;
      document
        .querySelector(domElements.genreSelect)
        .insertAdjacentHTML("beforeend", html);
    },

    assignTitle(text) {
      const html = `<div class="playlist-title">${text}</div>`;
      document
        .querySelector(domElements.title)
        .insertAdjacentHTML("beforeend", html);
    },

    assignPlaylistArt(img) {
      const image = `<div class="playlist-art-img" id="playlist-img">
      <img src=${img} class="playlist-pic"></img></div>`;
      document
        .querySelector(domElements.playlistArt)
        .insertAdjacentHTML("beforeend", image);
    },

    populatePlaylists(url, text) {
      const html = `<div class="playlist-items"><img src=${url} alt=${text}><div class="text">${text}</div></div>`;
      document
        .querySelector(domElements.otherPlaylists)
        .insertAdjacentHTML("beforeend", html);
    },

    populateTrackList(link, number, name, artist, length) {
      const html = `<div class="track-items"><a href=${link} target="none">${number}. ${name} by ${artist}</a><div class="track-length">${Math.floor(
        length / 1000 / 60
      )}:${Math.floor((length / 1000) % 60).toFixed(0)}</div></div>`;
      document
        .querySelector(domElements.playlistContents)
        .insertAdjacentHTML("beforeend", html);
    },

    populateSongInfo(name, artist, album) {
      const html = `<div class="song-info">Now Playing:<br>${name} by ${artist}<br>from the Album:<br>${album}</div>`;
      document
        .querySelector(domElements.songDetail)
        .insertAdjacentHTML("beforeend", html);
    },

    populateSongImage(img) {
      const html = `<img class="track-imgs" src=${img}>`;
      document
        .querySelector(domElements.currentSong)
        .insertAdjacentHTML("beforeend", html);
    },

    resetTitle() {
      this.outputField().title.innerHTML = "";
    },

    resetPlaylistPic() {
      this.outputField().playlistArt.innerHTML = "";
      this.resetTitle();
    },

    resetTrackArt() {
      this.outputField().currentSong.innerHTML = "";
      this.resetPlaylistPic();
    },

    resetTrackDetail() {
      this.outputField().songDetail.innerHTML = "";
      this.resetTrackArt();
    },

    resetTracks() {
      this.outputField().playlistSongs.innerHTML = "";
      this.resetTrackDetail();
    },

    resetPlaylists() {
      this.outputField().playlistLibrary.innerHTML = "";
      this.resetTracks();
    },

    storeToken(value) {
      document.querySelector(domElements.hToken).value = value;
    },

    getStoredToken() {
      return {
        token: document.querySelector(domElements.hToken).value,
      };
    },
  };
})();

//-----------------------------------//
//-------App Control Module----------//
//-----------------------------------//

const appController = (function (apiCtrl, uiCtrl) {
  //get object reference for DOM outputs
  const domOutput = uiCtrl.outputField();
  // console.log(domOutput);

  const asyncOps = async () => {
    //fetch token
    let token = await apiCtrl.getToken();
    //store token in hidden html element
    uiCtrl.storeToken(token);

    //----Populate HTML Information------//

    const genrePopulate = async () => {
      //retrieve token
      let token = uiCtrl.getStoredToken().token;
      //fetch genres
      const genreObj = await apiCtrl.getGenres(token);
      // console.log(genreObj);
      //populate drop-down menu with genres
      genreObj.forEach((element) => uiCtrl.assignGenre(element, element));
    };

    const musicPopulate = async () => {
      //retrieve token
      let token = uiCtrl.getStoredToken().token;
      //fetch playlist info for each playlist
      const data = await apiCtrl.getPlaylist(token);
      //populate title
      const title = data.items[3].name;
      // console.log(title);
      uiCtrl.assignTitle(title);
      //place image on center div
      uiCtrl.assignPlaylistArt(data.items[3].images[0].url);
      //populate playlist selection library
      for (i = 0; i < data.items.length; i++) {
        // console.log(data.items[i])
        uiCtrl.populatePlaylists(
          data.items[i].images[0].url,
          data.items[i].name
        );
      }
      //fetch tracklist info for each track
      const newData = await apiCtrl.getPlaylistTrackList(
        data.items[3].id,
        token
      );
      // console.log(newData);
      for (i = 0; i < newData.items.length; i++) {
        //place html
        uiCtrl.populateTrackList(
          newData.items[i].track.external_urls.spotify,
          i + 1,
          newData.items[i].track.name,
          newData.items[i].track.artists[0].name,
          newData.items[i].track.duration_ms
        );
      }
      //fetch current song image
      const newerData = await apiCtrl.getTracksInfo(
        newData.items[0].track.id,
        token
      );
      // console.log(newerData)
      uiCtrl.populateSongInfo(
        newerData.name,
        newerData.artists[0].name,
        newerData.album.name
      );
      const newestData = await apiCtrl.getTracksInfo(
        newData.items[0].track.id,
        token
      );
      // console.log(newestData)
      //place song images
      uiCtrl.populateSongImage(newestData.album.images[0].url);
    };

    const genreListener = () => {
      //retrieve token
      let token = uiCtrl.getStoredToken().token;
      const genreSelect = domOutput.genreSelect;
      genreSelect.addEventListener("change", async () => {
        uiCtrl.resetPlaylists();
        const genreId = genreSelect.options[genreSelect.selectedIndex].value;
        const playlist = await apiCtrl.getPlaylist(token);
        for (i = 0; i < playlist.items.length; i++) {
          console.log(i)
          const description = playlist.items[i].description;
          // console.log(description.split(" "));
          if (description.split(" ").includes(genreId)) {
            console.log(`${i} is a match`)
            console.log(`${description} ${i} contains ${genreId}!`);
            //populate title
            const title = playlist.items[i].name;
            // console.log(title);
            uiCtrl.resetTracks();
            uiCtrl.assignTitle(title);
            //assign current playlist image to center div
            uiCtrl.assignPlaylistArt(playlist.items[i].images[0].url);
            //assign current playlist(s)
            uiCtrl.populatePlaylists(
              playlist.items[i].images[0].url,
              playlist.items[i].name
            );
            //assign current tracklist
            const newData = await apiCtrl.getPlaylistTrackList(
              playlist.items[i].id,
              token
            );
            // console.log(newData);
            for (j = 0; j < newData.items.length; j++) {
              //place current tracklist
              uiCtrl.populateTrackList(
                newData.items[j].track.external_urls.spotify,
                j + 1,
                newData.items[j].track.name,
                newData.items[j].track.artists[0].name,
                newData.items[j].track.duration_ms
              );
              //fetch current song image
              const newerData = await apiCtrl.getTracksInfo(
                newData.items[j].track.id,token);
              // console.log(newerData)
              uiCtrl.populateSongInfo(
                newerData.name,
                newerData.artists[0].name,
                newerData.album.name);
              uiCtrl.populateSongImage(newerData.album.images[0].url);
            }
            i++;
          }
        }
      });
    };

    musicPopulate();
    genrePopulate();
    genreListener();
  };

  asyncOps();
})(apiController, uiController);
