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
