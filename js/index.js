//-----------------------------------//
//-----API Controller Module---------//
//-----------------------------------//
const apiController = (function () {
  const clientId = "4986258db999480dbcb94669e69535ad";
  const clientSecret = "50a5f956f0f84b278d3d90745c3308b5";
  const userId = "12172782523";

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
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await result.json();
    // console.log(data);

    //get track information for individual playlists
    for (i = 0; i < data.items.length; i++) {
      let playlistID = getTrackList(data.items[i].id, token);
      // console.log(playlistID)
    }
  };

  //function used to fetch playlist items
  const getTrackList = async (playlistID, token) => {
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
    
    //use a loop to get track information for individual playlists
    for (i = 0; i < data.items.length; i++) {
      let trackID = getTracks(data.items[i].track.id, token);
      // console.log(trackID);
    }
  };

  //function used to fetch track info from playlists
  const getTracks = async (trackID, token) => {
    const result = await fetch(
      `https://api.spotify.com/v1/tracks/${trackID}`,
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

  //declare a variable that stores the initial promise and subsequent promises
  const newData = getToken()
    .then(getPlaylist)
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
        genreSelect: document.querySelector(domElements.genreSelect)
      };
    },
    
  };
})();

//-----------------------------------//
//-------App Control Module----------//
//-----------------------------------//

const appController = (function (apiCtrl, uiCtrl) {
    //get object reference for DOM outputs
    const domOutput =  uiCtrl.outputField();
    console.log(domOutput)

})(apiController, uiController);