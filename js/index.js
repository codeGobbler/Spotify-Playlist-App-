//-----------------------------------//
//---------API Controller------------//
//-----------------------------------//
const apiController = (function () {
  const clientId = "";
  const clientSecret = "";
  const userId = "";

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
    console.log(data);
    return data.access_token;
  };

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

  genreMenu (value, text) {
    const newHTML = `<option value=${value}>${text}</option>`
    document.querySelector(domElements.genreSelect).insertAdjacentHTML('beforeend', html)
  },

  createTrackDetail (img, title, artist) {

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
