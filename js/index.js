//create IIFE to house apiController
const apiController = (function() {
  const clientId = "4986258db999480dbcb94669e69535ad";
  const clientSecret = "50a5f956f0f84b278d3d90745c3308b5";
  const userId = "12172782523";

  //-----------------------------------//

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
    const limit = 20;

    const result = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists?limit=${limit}&offset=0`, {
      method: "GET",
      headers: {
        "Accept": "appliction/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer" + token
      }
    });
    const data = await result.json();
    console.log(data)
    return data
  }
  
  return getToken()
          .then(getPlaylist)
          .catch(err => console.log(err))
})();

//-----------------------------------//

const uiController = (function() {

    const domElements = {
      currentSong:'#current',
      previousSong:'#prev',
      nextSong:'#next',
      playlistArt: '#playlist-art',
      nowPlaying:'#now-playing',
      playlistContents: '#metadata-1',
      otherPlaylists: '#metadata-2'
    }
    
    return {

      inputField() {
        return {
          currentSong: document.querySelector(domElements.currentSong),
          previousSong: document.querySelector(domElements.previousSong),
          nextSong: document.querySelector(domElements.nextSong),
          playlistArt: document.querySelector(domElements.playlistArt),
          nowPlaying: document.querySelector(domElements.nowPlaying),
          playlistSongs: document.querySelector(domElements.playlistContents),
          playlistLibrary: document.querySelector(domElements.otherPlaylists)
        }
      },
    }
})();
