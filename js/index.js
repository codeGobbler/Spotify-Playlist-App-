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

  //fetch user playlist information from api
  const getPlaylist = async (token) => {
    const limit = 50;

    const result = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists?limit=${limit}&offset=0`,
      {
      method: "GET",
      headers: {
        Accept: "application/json",
        'Content-Type': "application/json",
        Authorization: `Bearer ${token}`,
        }
      }
    );
    const data = await result.json();
    console.log(data)
    
    //get track information for individual playlists
    for (i = 0; i < data.items.length; i++) {
      let playlistID = getTracks(data.items[i].id, token);
      // console.log(playlistID)
    }
    
  };

  //function used to fetch track info for playlists (playlist items)
  const getTracks = async (playlistID, token) => {
    const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        'Content-Type': "application/json",
        Authorization: `Bearer ${token}`,
      }
    });
    const data = await result.json();
    console.log(data)
    return data;
  }

  const newData = getToken()
    .then(getPlaylist)
    // .then(getTracks)
    .catch((err) => console.log(err));

  // console.log(newData)
  return newData;
})();

//-----------------------------------//
//-------UI Selector Module----------//
//-----------------------------------//

const uiController = (function () {
  //store html selectors in an object for inputField() method
  const domElements = {
    songDetail: "#song-descripiton",
    currentSong: "#current",
    previousSong: "#prev",
    nextSong: "#next",
    playlistArt: "#playlist-art",
    nowPlaying: "#now-playing",
    playlistContents: "#metadata-1",
    otherPlaylists: "#metadata-2",
    genreSelect: "#genre-select"
  };

  return {
    //create a method to callback selectors
    inputField() {
      return {
        songDetail: document.querySelector(domElements.songDetail),
        currentSong: document.querySelector(domElements.currentSong),
        previousSong: document.querySelector(domElements.previousSong),
        nextSong: document.querySelector(domElements.nextSong),
        playlistArt: document.querySelector(domElements.playlistArt),
        nowPlaying: document.querySelector(domElements.nowPlaying),
        playlistSongs: document.querySelector(domElements.playlistContents),
        playlistLibrary: document.querySelector(domElements.otherPlaylists),
        genreSelect: document.querySelector(domElements.genreSelect)
      };
    },

    genreMenu(value, text) {
      const newHTML = `<option value=${value}>${text}</option>`
      document.querySelector(domElements.genreSelect).insertAdjacentHTML('beforeend', html)
    },

    createTrackDetail(img, title, artist) {

      const songDiv = document.querySelector(domElements.songDetail);
      // any time user clicks a new song, we need to clear out the song detail div
      songDiv.innerHTML = '';

      const html =
        `
    <div class="track-description">
        <img src="${img}" alt="">        
    </div>
    <div class="track-description">
        <label for="Genre" class="track-description">${title}:</label>
    </div>
    <div class="track-description">
        <label for="artist" class="track-description">By ${artist}:</label>
    </div> 
    `;

      songDiv.insertAdjacentHTML('beforeend', html)
    }
  }
})();
