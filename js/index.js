const apiController = () => {
  const clientId = "4986258db999480dbcb94669e69535ad";
  const clientSecret = "50a5f956f0f84b278d3d90745c3308b5";

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
    console.log(result);

    const data = await result.json();
    console.log(data);
  };
  getToken();
}

apiController();
//-----------------------------------//

//menu button setup
// const menuBtn = document
//   .getElementById("btn")
//   .addEventListener("click", (e) => {
//     console.log("menu clicked");
//   });

// //track-select button setup
// const currentTrack = document
//   .getElementById("current")
//   .addEventListener("click", () => {
//     console.log("current track clicked");
//   });

// const prevTrack = document
//   .getElementById("prev")
//   .addEventListener("click", () => {
//     console.log("previous track clicked");
//   });

// const nextTrack = document
//   .getElementById("next")
//   .addEventListener("click", () => {
//     console.log("next track clicked");
//   });

// //playlist-art button setup
// const playlistArt = document
//   .getElementById("playlist-art")
//   .addEventListener("click", (e) => {
//     console.log("playlist-art clicked");
//   });
