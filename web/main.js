// import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'

// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))

function openStream() {
  const config = { audio: false, video: true };
  return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
  const video = document.getElementById(idVideoTag);
  video.srcObject = stream;
  video.play();
}

// openStream()
// .then(stream => playStream('localStream', stream));

//someid muốn cố định id
// const peer = new Peer("someid", {
//   host: "localhost",
//   port: 9000,
//   path: "/",
// });

// const peer = new Peer({
//   host: "localhost",
//   port: 9000,
//   path: "/",
// });
const peer = new Peer({
  host: "localhost",
  port: 9000,
  path: "/",
  secure: false,
  proxied: true,
  config: {
    iceServers: [
      {
        urls: ["stun:ss-turn2.xirsys.com"],
      },
      {
        username:
          "1R5glS1MvHe3hWynzfIRDXntfXFSZqWfCud_Rz7c_pn8IC5_yPzXLPOX4vv7-LTlAAAAAGQsFlVtaXRoYW5n",
        credential: "41606242-d2e3-11ed-b8a3-0242ac140004",
        urls: [
          "turn:ss-turn2.xirsys.com:80?transport=udp",
          "turn:ss-turn2.xirsys.com:3478?transport=udp",
          "turn:ss-turn2.xirsys.com:80?transport=tcp",
          "turn:ss-turn2.xirsys.com:3478?transport=tcp",
          "turns:ss-turn2.xirsys.com:443?transport=tcp",
          "turns:ss-turn2.xirsys.com:5349?transport=tcp",
        ],
      },
    ],
  },
});

// import { PeerServer } from "peer";
// PeerServer({ port: 9001, path: "/" });

peer.on("open", (id) => {
  $("#my-peer").append(id);
  $("#btnSignUp").click(() => {
    // const username = $('#txtUsername').val();
    // socket.emit('NGUOI_DUNG_DANG_KY', { ten: username, peerId: id });
  });
});

//Caller
$("#btnCall").click(() => {
  const id = $("#remoteId").val();
  openStream().then((stream) => {
    playStream("localStream", stream);
    const call = peer.call(id, stream);
    call.on("stream", (remoteStream) =>
      playStream("remoteStream", remoteStream)
    );
  });
});

//Callee
peer.on("call", (call) => {
  openStream().then((stream) => {
    call.answer(stream);
    playStream("localStream", stream);
    call.on("stream", (remoteStream) =>
      playStream("remoteStream", remoteStream)
    );
  });
});
