//-----------------------------------//
//---------API Controller------------//
//-----------------------------------//
const apiController = (function () {
  const clientId ="";
  const clientSecret ="";
  const userId ="";

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

  const getPlaylist = async (token) => {
    const limit = 50;

    const result = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists?limit=${limit}&offset=0`,
      {
        method: "GET",
        headers: {
          Accept: "appliction/json",
          "Content-Type": "application/json",
          Authorization:
            "Bearer BQCqoqdyTJXPS53Ty7yvNiiJhIuepJd1kEXeA7hfnEunK8cu6EZ4cCQ3qelMWuGrF9pU2QI_Zuiny7PRjccjqrgkcVW39A_5TIF2HRMTE95Opk0Y7ovL940wp8ZMrJpsOKFzO3DYbiOlhd9XNEafog_GaSvYJf5T",
        },
      }
    );
    const data = await result.json();
    console.log(data);
    return data;
  };

  const newData = getToken()
    .then(getPlaylist)
    .catch((err) => console.log(err));

  return newData;
})();

//-----------------------------------//
//---------UI Controller-------------//
//-----------------------------------//

const uiController = (function () {
  const domElements = {
    currentSong: "#current",
    previousSong: "#prev",
    nextSong: "#next",
    playlistArt: "#playlist-art",
    nowPlaying: "#now-playing",
    playlistContents: "#metadata-1",
    otherPlaylists: "#metadata-2",
  };

  return {
    inputField() {
      return {
        currentSong: document.querySelector(domElements.currentSong),
        previousSong: document.querySelector(domElements.previousSong),
        nextSong: document.querySelector(domElements.nextSong),
        playlistArt: document.querySelector(domElements.playlistArt),
        nowPlaying: document.querySelector(domElements.nowPlaying),
        playlistSongs: document.querySelector(domElements.playlistContents),
        playlistLibrary: document.querySelector(domElements.otherPlaylists),
      };
    },
  };
})();
