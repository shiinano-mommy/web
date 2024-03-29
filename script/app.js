let webSocket = new WebSocket("wss://api.lanyard.rest/socket");
let discordID = "427184625689821194";

fetch(`https://api.lanyard.rest/v1/users/${discordID}`)
  .then((response) => response.json())
  .then((e) => { 
    if(e.data["discord_user"]){
        if (e.data.discord_status === "online") {
            document.getElementById("discord-status-highlight").innerText = "online";
            document.getElementById("discord-status-highlight").style.color = "#23a55a";
          }
          else if (e.data.discord_status === "idle"){
            document.getElementById("discord-status-highlight").innerText = "idle";
            document.getElementById("discord-status-highlight").style.color = "#f0b232";
          }
          else if (e.data.discord_status === "dnd"){
            document.getElementById("discord-status-highlight").innerText = "on Do not disturb";
            document.getElementById("discord-status-highlight").style.color = "#f23f43";
          }
          else if (e.data.discord_status === "offline"){
            document.getElementById("discord-status-highlight").innerText = "Offline";
            document.getElementById("discord-status-highlight").style.color = "#80848e";
          }

        if (e.data["listening_to_spotify"]) {
            document.getElementById("spotify-song").innerText = "listening to " + e.data.spotify.song;
            document.getElementById("spotify-artist").innerText = " by " + e.data.spotify.artist.replaceAll(";", ",");
        }
        else {
            document.getElementById("spotify-song").innerText = "";
            document.getElementById("spotify-artist").innerText = "";
        }
    }

});

webSocket.addEventListener("message", (event) => {
    let data = JSON.parse(event.data);
  
    if (event.data === '{"op":1,"d":{"heartbeat_interval":30000}}') {
      webSocket.send(
        JSON.stringify({
          op: 2,
          d: {
            subscribe_to_id: discordID,
          },
        })
      );
      setInterval(() => {
        webSocket.send(
          JSON.stringify({
            op: 3,
            d: {
              heartbeat_interval: 30000,
            },
          })
        );
      }, 30000);
    }
    if (data.t === "PRESENCE_UPDATE") {
      if (data.d.spotify) {
        document.getElementById("spotify-song").innerText = "listening to " + data.d.spotify.song;
        document.getElementById("spotify-artist").innerText = " by " + data.d.spotify.artist.replaceAll(";", ",");
        }
        else {
            document.getElementById("spotify-song").innerText = "";
            document.getElementById("spotify-artist").innerText = "";
        }
    }
});
document.addEventListener('contextmenu', event => event.preventDefault());

// right click disable
document.onkeydown = function(event) {
    if (event.keyCode === 123 || isCtrlShiftKey(event, 'I') || isCtrlShiftKey(event, 'J') ||
        isCtrlShiftKey(event, 'C') || (event.ctrlKey && event.keyCode === 'U'.charCodeAt(0))) {
        return false;
    }
};

function isCtrlShiftKey(event, key) {
    return event.ctrlKey && event.shiftKey && event.keyCode === key.charCodeAt(0);
}
