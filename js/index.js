//-----------------------------------//

//api setup
// const { default: SpotifyWebApi } = require('spotify-web-api-js');
// const spotify = require('spotify-web-api-js');
// const s = new SpotifyWebApi();

//-----------------------------------//

//menu button setup
const menuBtn = document.getElementById('btn')
  .addEventListener('click', (e) => {
    console.log('menu clicked');
})

//login button setup
const loginBtn = document.getElementById('spotify-btn')
  .addEventListener('click', (e) => {
    console.log('login clicked');
})

//track-select button setup
const currentTrack = document.getElementById('current')
  .addEventListener('click', () => {
    console.log('current track clicked');
})

const prevTrack = document.getElementById('prev')
  .addEventListener('click', () => {
    console.log('previous track clicked');
})

const nextTrack = document.getElementById('next')
  .addEventListener('click', () => {
    console.log('next track clicked');
})

//playlist-art button setup
const playlistArt = document.getElementById('playlist-art')
  .addEventListener('click', (e) => {
    console.log('playlist-art clicked');
})