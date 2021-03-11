(function () {
  function r(e, n, t) {
    function o(i, f) {
      if (!n[i]) {
        if (!e[i]) {
          var c = "function" == typeof require && require;
          if (!f && c) return c(i, !0);
          if (u) return u(i, !0);
          var a = new Error("Cannot find module '" + i + "'");
          throw ((a.code = "MODULE_NOT_FOUND"), a);
        }
        var p = (n[i] = { exports: {} });
        e[i][0].call(
          p.exports,
          function (r) {
            var n = e[i][1][r];
            return o(n || r);
          },
          p,
          p.exports,
          r,
          e,
          n,
          t
        );
      }
      return n[i].exports;
    }
    for (
      var u = "function" == typeof require && require, i = 0;
      i < t.length;
      i++
    )
      o(t[i]);
    return o;
  }
  return r;
})()(
  {
    1: [
      function (require, module, exports) {
        (function (process) {
          (function () {

            //-----------------------------------//
            //---------Global Functions----------//
            //-----------------------------------//

            //node mod parser function
            const nodeConfig = (module, exports) => {
              const result = require(module).config();
              if (result.error) {
                console.log(result.error);
                throw result.error;
              } else {
                console.log(result.parsed);
                return exports;
              }
            };

            //-----------------------------------//
            //-----API Controller Module---------//
            //-----------------------------------//
            const apiController = (function () {
              //declare environment variables for authentication
              const env = nodeConfig("dotenv", process.env);
              console.log(env)

              const clientId = env.SPOTIFY_CLIENT_ID;
              const clientSecret = env.SPOTIFY_CLIENT_SECRET;
              const userId = env.SPOTIFY_USER_ID;

              console.log(
                `ClientID=${clientId}, ClientSecret=${clientSecret}, UserID=${userId}`
              );

              //get access token
              const getToken = async () => {
                try {
                  const result = await fetch(
                    "https://accounts.spotify.com/api/token",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization:
                          "Basic " + btoa(clientId + ":" + clientSecret),
                      },
                      body: "grant_type=client_credentials",
                    }
                  );
                  const data = await result.json();
                  // console.log(data);
                  return data.access_token;
                } catch (err) {
                  throw err;
                }
              };

              //-----------------------------------//
              //--------API Display Module---------//
              //-----------------------------------//

              //fetch genres from spotify for later sorting
              const getGenres = async (token) => {
                try {
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
                } catch (err) {
                  throw err;
                }
              };

              //fetch user playlist information from api
              const getMyPlaylists = async (token) => {
                try {
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
                } catch (err) {
                  throw err;
                }
              };

              //fetch user playlist information from api
              const getPlaylistByID = async (playlistID, token) => {
                try {
                  const result = await fetch(
                    `https://api.spotify.com/v1/playlists/${playlistID}`,
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
                } catch (err) {
                  throw err;
                }
              };

              //function used to fetch playlist track list
              const getMyPlaylistsTrackList = async (playlistID, token) => {
                try {
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
                } catch (err) {
                  throw err;
                }
              };

              //function used to fetch individual track info from playlists
              const getTracksInfo = async (trackID, token) => {
                try {
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
                  return data;
                } catch (err) {
                  throw err;
                }
              };

              //-----------------------------------//
              //--------API Function Module--------//
              //-----------------------------------//

              //fetch play/pause
              const playFunction = async (token, uri) => {
                try {
                  const result = await fetch(
                    `https://api.spotify.com/v1/me/player/play`,
                    {
                      method: "PUT",
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: `{"context_uri":"spotify:track:${uri}","offset":{"position":5},"position_ms":0}`,
                    }
                  );
                  const data = await result.json();
                  console.log("playing", data);
                  return data;
                } catch (err) {
                  throw err;
                }
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
                getMyPlaylists(token) {
                  return getMyPlaylists(token);
                },
                getPlaylistByID(playlistID, token) {
                  return getPlaylistByID(playlistID, token);
                },
                getMyPlaylistsTrackList(playlistID, token) {
                  return getMyPlaylistsTrackList(playlistID, token);
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
            //-----SDK/API Playback Module-------//
            //-----------------------------------//

            // //initialize local connect device on browser
            // window.onSpotifyWebPlaybackSDKReady = () => {
            //   const token =
            //     "BQBMRGSqIxyP71BLn2JgvRMYyyk6fvPewR2kncYL9qpM7PtsU-APT62Ut2scTcDEK3bAL63UiwYMIULRzGz7lOs0hFJa6COCqJcqDSrPeI8a4kzQ7eN6vopn60F8EvHMrbv2FfZv-uDh9bj36bbHdbk6k9pD_aHKweMQ";
            //   const player = new Spotify.Player({
            //     name: 'GVO Player',
            //     getOAuthToken: cb => {
            //       cb(token);
            //     },
            //     volume: 0.5,
            //   });

            //   // Error handling
            //   player.addListener("initialization_error", ({ message }) => {
            //     console.error(message);
            //   });
            //   player.addListener("authentication_error", ({ message }) => {
            //     console.error(message);
            //   });
            //   player.addListener("account_error", ({ message }) => {
            //     console.error(message);
            //   });
            //   player.addListener("playback_error", ({ message }) => {
            //     console.error(message);
            //   });

            //   // Playback status updates
            //   player.addListener("player_state_changed", (state) => {
            //     console.log(state);
            //   });

            //   // Ready
            //   player.addListener("ready", ({ device_id }) => {
            //     console.log("Ready with Device ID", device_id);
            //   });

            //   // Not Ready
            //   player.addListener("not_ready", ({ device_id }) => {
            //     console.log("Device ID has gone offline", device_id);
            //   });

            //   // Connect to the player!
            //   player.connect();

            // };

            //-----------------------------------//
            //-------UI Selector Module----------//
            //-----------------------------------//

            const uiController = (function () {
              //store html selectors in an object for outputField() method
              const domElements = {
                hToken: "#hidden-token",
                hlogin: "#login-div",
                btnLogin: "#login-btn",
                songDetail: "#song-description",
                previousSong: "#prev",
                currentSong: "#current",
                nextSong: "#next",
                title: "#playlist-title",
                playlistArt: "#playlist-art",
                nowPlaying: "#now-playing",
                skipBack: "#skipBack",
                play: "#play",
                skipForward: "#skipForward",
                playlistContents: "#metadata-1",
                otherPlaylists: "#metadata-2",
                genreSelect: "#genre-select",
              };

              return {
                //create a method to callback selectors
                outputField() {
                  return {
                    songDetail: document.querySelector(domElements.songDetail),
                    hiddenDiv: document.querySelector(domElements.hlogin),
                    btnLogin: document.querySelector(domElements.btnLogin),
                    previousSong: document.querySelector(
                      domElements.previousSong
                    ),
                    currentSong: document.querySelector(
                      domElements.currentSong
                    ),
                    nextSong: document.querySelector(domElements.nextSong),
                    title: document.querySelector(domElements.title),
                    playlistArt: document.querySelector(
                      domElements.playlistArt
                    ),
                    nowPlaying: document.querySelector(domElements.nowPlaying),
                    skipBack: document.querySelector(domElements.skipBack),
                    play: document.querySelector(domElements.play),
                    skipForward: document.querySelector(
                      domElements.skipForward
                    ),
                    playlistSongs: document.querySelector(
                      domElements.playlistContents
                    ),
                    playlistLibrary: document.querySelector(
                      domElements.otherPlaylists
                    ),
                    genreSelect: document.querySelector(
                      domElements.genreSelect
                    ),
                  };
                },
                //general ui info population methods
                assignGenre(text, value) {
                  const html = `<option id="genre-item" value="${value}">${text}</option>`;
                  document
                    .querySelector(domElements.genreSelect)
                    .insertAdjacentHTML("beforeend", html);
                },

                assignTitle(id, text) {
                  const html = `<div class="playlist-title">${text}</div><input class="hidden-title" type="hidden" value=${id}></input>`;
                  document
                    .querySelector(domElements.title)
                    .insertAdjacentHTML("beforeend", html);
                },

                assignPlaylistArt(img) {
                  const image = `<div class="playlist-art-img" id="playlist-img">
      <img src=${img} class="playlist-pic"/></div>`;
                  document
                    .querySelector(domElements.playlistArt)
                    .insertAdjacentHTML("beforeend", image);
                },

                populatePlaylists(id, url, text) {
                  const html = `<button class="playlist-btns" value=${id}><img src=${url} alt="${text}"/><div class="text">${text}</div></button>`;
                  document
                    .querySelector(domElements.otherPlaylists)
                    .insertAdjacentHTML("beforeend", html);
                },

                populateTrackList(uri, number, name, artist, length, id) {
                  const html = `<div class="track-items"><input class="uri" type="hidden" value=${uri}>${number}. ${name} by ${artist}</input><button class="track-id playlist-items" value=${id}>PLAY</button><div class="track-length">${Math.floor(
                    length / 1000 / 60
                  )}:${Math.floor((length / 1000) % 60).toFixed(
                    0
                  )}</div></div>`;
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

                resetTrackArt() {
                  this.outputField().currentSong.innerHTML = "";
                },

                resetTrackDetail() {
                  this.outputField().songDetail.innerHTML = "";
                  this.resetTrackArt();
                },

                resetTitle() {
                  this.outputField().title.innerHTML = "";
                  this.resetTrackDetail();
                },

                resetPlaylistPic() {
                  this.outputField().playlistArt.innerHTML = "";
                  this.resetTitle();
                },

                resetTracks() {
                  this.outputField().playlistSongs.innerHTML = "";
                  this.resetPlaylistPic();
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

                //---onLoad----//
                const genrePopulate = async () => {
                  //retrieve token
                  let token = uiCtrl.getStoredToken().token;
                  //fetch genres
                  const genreObj = await apiCtrl.getGenres(token);
                  // console.log(genreObj);
                  //populate drop-down menu with genres
                  genreObj.forEach((element) =>
                    uiCtrl.assignGenre(element, element)
                  );
                };

                const musicPopulate = async () => {
                  //retrieve token
                  let token = uiCtrl.getStoredToken().token;
                  //fetch playlist info for each playlist
                  const data = await apiCtrl.getMyPlaylists(token);
                  //populate title
                  const title = data.items[3].name;
                  const id = data.items[3].id;
                  // console.log(data);
                  uiCtrl.assignTitle(id, title);
                  //place image on center div
                  uiCtrl.assignPlaylistArt(data.items[3].images[0].url);
                  //populate playlist selection library
                  for (i = 0; i < data.items.length; i++) {
                    // console.log(data.items[i])
                    uiCtrl.populatePlaylists(
                      data.items[i].id,
                      data.items[i].images[0].url,
                      data.items[i].name
                    );
                  }
                  //fetch tracklist info for each track
                  const newData = await apiCtrl.getMyPlaylistsTrackList(
                    data.items[3].id,
                    token
                  );
                  // console.log(newData);
                  for (i = 0; i < newData.items.length; i++) {
                    //place html
                    uiCtrl.populateTrackList(
                      newData.items[i].track.uri,
                      i + 1,
                      newData.items[i].track.name,
                      newData.items[i].track.artists[0].name,
                      newData.items[i].track.duration_ms,
                      newData.items[i].track.id
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

                //-----------------------------------//
                //-------User Login Module-----------//
                //-----------------------------------//

                const loginListener = async () => {
                  const loginDiv = domOutput.hiddenDiv;
                  const login = domOutput.btnLogin;
                  login.addEventListener("click", async () => {
                    musicPopulate();
                    genrePopulate();
                    loginDiv.style.display = "none";
                  });
                };

                //-----------------------------------//
                //-------App Event Listeners---------//
                //-----------------------------------//

                const genreListener = () => {
                  //retrieve token
                  let token = uiCtrl.getStoredToken().token;
                  const genreSelect = domOutput.genreSelect;
                  genreSelect.addEventListener("change", async () => {
                    uiCtrl.resetPlaylists();
                    const genreId =
                      genreSelect.options[genreSelect.selectedIndex].value;
                    const playlist = await apiCtrl.getMyPlaylists(token);
                    for (i = 0; i < playlist.items.length; i++) {
                      // console.log(i);
                      const description = playlist.items[i].description;
                      // console.log(description.split(" "));
                      if (description.split(" ").includes(genreId)) {
                        // console.log(`${i} is a match`);
                        // console.log(`${description} ${i} contains ${genreId}!`);
                        //populate title
                        const title = playlist.items[i].name;
                        // console.log(title);
                        uiCtrl.resetTracks();
                        uiCtrl.assignTitle(genreId, title);
                        //assign current playlist image to center div
                        uiCtrl.assignPlaylistArt(
                          playlist.items[i].images[0].url
                        );
                        //assign current playlist(s)
                        uiCtrl.populatePlaylists(
                          playlist.items[i].id,
                          playlist.items[i].images[0].url,
                          playlist.items[i].name
                        );
                        //assign current tracklist
                        const newData = await apiCtrl.getMyPlaylistsTrackList(
                          playlist.items[i].id,
                          token
                        );
                        // console.log(newData);
                        for (j = 0; j < newData.items.length; j++) {
                          //place current tracklist
                          uiCtrl.populateTrackList(
                            newData.items[j].track.uri,
                            j + 1,
                            newData.items[j].track.name,
                            newData.items[j].track.artists[0].name,
                            newData.items[j].track.duration_ms,
                            newData.items[i].track.id
                          );
                          //fetch current song image
                          const newerData = await apiCtrl.getTracksInfo(
                            newData.items[j].track.id,
                            token
                          );
                          // console.log(newerData)
                          uiCtrl.populateSongInfo(
                            newerData.name,
                            newerData.artists[0].name,
                            newerData.album.name
                          );
                          uiCtrl.populateSongImage(
                            newerData.album.images[0].url
                          );
                        }
                      }
                    }
                  });
                };

                const playlistListener = () => {
                  //retrieve token
                  let token = uiCtrl.getStoredToken().token;
                  const playlistContainer = domOutput.playlistLibrary;
                  // console.log(playlistContainer);
                  playlistContainer.addEventListener("click", async (e) => {
                    uiCtrl.resetTracks();
                    const btnID = e.target.value;
                    // console.log(btnID, "clicked");
                    const currentPlaylist = await apiCtrl.getPlaylistByID(
                      btnID,
                      token
                    );
                    // console.log(currentPlaylist);
                    uiCtrl.assignPlaylistArt(currentPlaylist.images[0].url);
                    uiCtrl.assignTitle(
                      currentPlaylist.id,
                      currentPlaylist.name
                    );
                    const trackList = await apiCtrl.getMyPlaylistsTrackList(
                      btnID,
                      token
                    );
                    // console.log(trackList);
                    for (i = 0; i < trackList.items.length; i++) {
                      uiCtrl.populateTrackList(
                        trackList.items[i].track.uri,
                        i + 1,
                        trackList.items[i].track.name,
                        trackList.items[i].track.artists[0].name,
                        trackList.items[i].track.duration_ms,
                        trackList.items[i].track.id
                      );
                      //fetch current song image
                      const trackInfo = await apiCtrl.getTracksInfo(
                        trackList.items[i].track.id,
                        token
                      );
                      // console.log(trackInfo);
                      uiCtrl.populateSongInfo(
                        trackInfo.name,
                        trackInfo.artists[0].name,
                        trackInfo.album.name
                      );
                      uiCtrl.populateSongImage(trackInfo.album.images[0].url);
                    }
                  });
                };

                const tracklistListener = () => {
                  //retrieve token
                  let token = uiCtrl.getStoredToken().token;
                  const songDiv = domOutput.playlistSongs;
                  songDiv.addEventListener("click", async (e) => {
                    uiCtrl.resetTrackDetail();
                    // const trackDiv = document.getElementsByClassName("track-items");
                    // const uri = document.querySelector("uri");
                    const trackID = e.target.value;
                    // console.log(trackID)
                    const trackInfo = await apiCtrl.getTracksInfo(
                      trackID,
                      token
                    );
                    uiCtrl.populateSongInfo(
                      trackInfo.name,
                      trackInfo.artists[0].name,
                      trackInfo.album.name
                    );
                    uiCtrl.populateSongImage(trackInfo.album.images[0].url);
                    console.log(trackInfo.uri);
                    const uri = trackInfo;
                    const trackPlay = await apiCtrl.playFunction(token, uri);
                  });
                };

                const trackPlayListener = () => {
                  //retrieve token
                  let token = uiCtrl.getStoredToken().token;
                  const songPlay = domOutput.play;
                  const songSkip = domOutput.skipForward;
                  const songBack = domOutput.skipBack;
                  songPlay.addEventListener("click", async () => {
                    const tracklist = domOutput.playlistSongs.children;
                    const uri = tracklist[0].childNodes[0].defaultValue;
                    console.log(uri);
                    await apiCtrl.playFunction(token, uri);
                  });
                  // songSkip.addEventListener("click", async () => {
                  //   // console.log("skip clicked")
                  //   await apiCtrl.playFunction(token, uri);
                  // })
                  // songBack.addEventListener("click", async () => {
                  //   //  console.log("back clicked")
                  //   await apiCtrl.playFunction(token, uri);
                  // })
                };

                genreListener();
                playlistListener();
                trackPlayListener();
                loginListener();
                tracklistListener();
              };

              asyncOps();
            })(apiController, uiController);
          }.call(this));
        }.call(this, require("_process")));
      },
      { _process: 2 },
    ],
    2: [
      function (require, module, exports) {
        // shim for using process in browser
        var process = (module.exports = {});

        // cached from whatever global is present so that test runners that stub it
        // don't break things.  But we need to wrap it in a try catch in case it is
        // wrapped in strict mode code which doesn't define any globals.  It's inside a
        // function because try/catches deoptimize in certain engines.

        var cachedSetTimeout;
        var cachedClearTimeout;

        function defaultSetTimout() {
          throw new Error("setTimeout has not been defined");
        }
        function defaultClearTimeout() {
          throw new Error("clearTimeout has not been defined");
        }
        (function () {
          try {
            if (typeof setTimeout === "function") {
              cachedSetTimeout = setTimeout;
            } else {
              cachedSetTimeout = defaultSetTimout;
            }
          } catch (e) {
            cachedSetTimeout = defaultSetTimout;
          }
          try {
            if (typeof clearTimeout === "function") {
              cachedClearTimeout = clearTimeout;
            } else {
              cachedClearTimeout = defaultClearTimeout;
            }
          } catch (e) {
            cachedClearTimeout = defaultClearTimeout;
          }
        })();
        function runTimeout(fun) {
          if (cachedSetTimeout === setTimeout) {
            //normal enviroments in sane situations
            return setTimeout(fun, 0);
          }
          // if setTimeout wasn't available but was latter defined
          if (
            (cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) &&
            setTimeout
          ) {
            cachedSetTimeout = setTimeout;
            return setTimeout(fun, 0);
          }
          try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedSetTimeout(fun, 0);
          } catch (e) {
            try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
              return cachedSetTimeout.call(null, fun, 0);
            } catch (e) {
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
              return cachedSetTimeout.call(this, fun, 0);
            }
          }
        }
        function runClearTimeout(marker) {
          if (cachedClearTimeout === clearTimeout) {
            //normal enviroments in sane situations
            return clearTimeout(marker);
          }
          // if clearTimeout wasn't available but was latter defined
          if (
            (cachedClearTimeout === defaultClearTimeout ||
              !cachedClearTimeout) &&
            clearTimeout
          ) {
            cachedClearTimeout = clearTimeout;
            return clearTimeout(marker);
          }
          try {
            // when when somebody has screwed with setTimeout but no I.E. maddness
            return cachedClearTimeout(marker);
          } catch (e) {
            try {
              // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
              return cachedClearTimeout.call(null, marker);
            } catch (e) {
              // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
              // Some versions of I.E. have different rules for clearTimeout vs setTimeout
              return cachedClearTimeout.call(this, marker);
            }
          }
        }
        var queue = [];
        var draining = false;
        var currentQueue;
        var queueIndex = -1;

        function cleanUpNextTick() {
          if (!draining || !currentQueue) {
            return;
          }
          draining = false;
          if (currentQueue.length) {
            queue = currentQueue.concat(queue);
          } else {
            queueIndex = -1;
          }
          if (queue.length) {
            drainQueue();
          }
        }

        function drainQueue() {
          if (draining) {
            return;
          }
          var timeout = runTimeout(cleanUpNextTick);
          draining = true;

          var len = queue.length;
          while (len) {
            currentQueue = queue;
            queue = [];
            while (++queueIndex < len) {
              if (currentQueue) {
                currentQueue[queueIndex].run();
              }
            }
            queueIndex = -1;
            len = queue.length;
          }
          currentQueue = null;
          draining = false;
          runClearTimeout(timeout);
        }

        process.nextTick = function (fun) {
          var args = new Array(arguments.length - 1);
          if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
              args[i - 1] = arguments[i];
            }
          }
          queue.push(new Item(fun, args));
          if (queue.length === 1 && !draining) {
            runTimeout(drainQueue);
          }
        };

        // v8 likes predictible objects
        function Item(fun, array) {
          this.fun = fun;
          this.array = array;
        }
        Item.prototype.run = function () {
          this.fun.apply(null, this.array);
        };
        process.title = "browser";
        process.browser = true;
        process.env = {};
        process.argv = [];
        process.version = ""; // empty string to avoid regexp issues
        process.versions = {};

        function noop() {}

        process.on = noop;
        process.addListener = noop;
        process.once = noop;
        process.off = noop;
        process.removeListener = noop;
        process.removeAllListeners = noop;
        process.emit = noop;
        process.prependListener = noop;
        process.prependOnceListener = noop;

        process.listeners = function (name) {
          return [];
        };

        process.binding = function (name) {
          throw new Error("process.binding is not supported");
        };

        process.cwd = function () {
          return "/";
        };
        process.chdir = function (dir) {
          throw new Error("process.chdir is not supported");
        };
        process.umask = function () {
          return 0;
        };
      },
      {},
    ],
  },
  {},
  [1]
);
