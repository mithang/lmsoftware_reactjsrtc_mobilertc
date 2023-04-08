import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Button, TextInput } from 'react-native'
import Peer from 'react-native-peerjs'
import {
  RTCView,
  mediaDevices
} from 'react-native-webrtc';
//import { io } from "socket.io-client";
const App = () => {

  const [peer, setPeer] = useState(new Peer());
  const [myId, setMyId] = useState('');
  const [conn, setConn] = useState(null);
  const [remoteId, setRemoteId] = useState('');
  //let { current: con } = useRef();
  const [con, setCon] = useState({});
  const [isFront, setIsFront] = useState(true);
  const [myStream, setMyStream] = useState();
  const [peerStream, setPeerStream] = useState();

  let txt = useRef();

  useEffect(() => {
    console.log("peer object ", peer);
    // alert("peerobject")
    //localStrm();

    peer.on('open', (id) => {
      //setMyid
      setMyId(id);
      console.log("my id ", id)
      // alert(id)
    })
    //data connection
    peer.on('connection', (rmtconn) => {
      console.log("remote connection ", rmtconn);
      rmtconn.on('open', () => {
        rmtconn.on('data', (data) => {
          console.log("data friom another client ", data);
        });
      });
    })

    //when we get call
    peer.on('call', async function (call) {
      // Answer the call, providing our mediaStream
      //const media =  navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      //getting media stream 
      let stream = await getMyStream();
      //if media stream present
      if (stream) {
        /* console.log("******** answering stream ");
        //assign media stream to RTCLoaclStream
        stream.then((stream) => {//console.log(stream)
          call.answer(stream);
          // const videoElement = document.querySelector("video#localVideo")
          //  videoElement.srcObject = stream;
          console.log("my local stream", stream)
        })//.getVideoTracks().forEach((track)=>{
        // track.stop();
        //   track.enabled = false;
        // }) */
        setMyStream(stream)
        call.answer(stream);
        console.log("*****************local stream", stream)
      }
      //when we grt remote stream
      call.on('stream', (rmtstream) => {
        console.log("***** remote stream inside peer.on(call) event", rmtstream.toURL());
        setPeerStream(rmtstream);
      })
      /* // call.answer(media);
      console.log("*** remote peer calling ", call);

      call.on('stream', (stream) => {
        console.log("**** remoteStream ", stream);
        //   const videoElement = document.querySelector("video#remoteVideo")
        // videoElement.srcObject = stream;
      }) */
    });
    //alert("client running")
    //const socket = io("http:localhost:5007")
    //const socket = io("http://50.35.225.9:5008");
    //const socket = io("http://localhost:5003");
    //const socket = io("fe80::42:b6ff:fe0d:c8a8/64:5003");
    //const socket = io("106.217.31.74:5003");
    //const socket = io("http://[fe80::891b:3a4e:29d5:2fb9/64]:5003");
    //console.log(socket.connected)
    //  console.log(socket.connected);
    //socket.on("connect", () => {
    //alert("just checking")
    //    console.log(socket.connected); // true
    //  console.log(socket.id);});

    //   socket.emit("test","welcome");

    //   socket.on("rec",(data)=>{
    //     console.log("dta from server ",data)
    //   })
    // },[]);
    //console.log(socket.connected);
    /*socket.on("connect", () => {
       console.log(socket.id); // ojIckSD2jqNzOqIrAGzL
     });*/
  }, [])

  const getMyStream = () => {
    let sourceInfos = mediaDevices.enumerateDevices();
    // console.log("sources info ", sourceInfos);
    let videoSourceId;
    for (let i = 0; i < sourceInfos.length; i++) {
      const sourceInfo = sourceInfos[i];
      if (sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
        videoSourceId = sourceInfo.deviceId;
      }
    }
    let stream = mediaDevices.getUserMedia({
      audio: true,
      video: {
        width: 640,
        height: 480,
        frameRate: 30,
        facingMode: (isFront ? "user" : "environment"),
        deviceId: videoSourceId
      }
    })

    return stream;
  }

  //make a call
  const makeCall = async () => {
    //check weather remote id 
    console.log("remoted id stored locally ", remoteId);
    //const media =  navigator.getUserMedia({ audio: true, video: true });
    //const media =  navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    //if media stream present
    //getting media stream 
    let stream = await getMyStream();
    let call;
    // if stream is present 
    if (stream) {
      console.log("******** making call", stream);
      //set Local stream
      setMyStream(stream);
      //assign media stream to RTCLoaclStream
      /*       stream.then((stream) => {
              const call = peer.call(remoteId, stream);
              console.log("****local call ", call)
              // const videoElement = document.querySelector("video#localVideo")
              // videoElement.srcObject = stream;
              //on remote stream receiving
              call.on('stream', (remoteStream) => {
                //another peer media
                console.log("*** inside makecall() the remote stream ", remoteStream);
                setPeerStream(remoteStream);
                //   const videoElement = document.querySelector("video#remoteVideo")
                //   videoElement.srcObject = stream;
              })
            })//then close */
      call = peer.call(remoteId, stream);
    }
    call.on('stream', (remoteStream) => {
      //another peer media
      console.log("*** inside makecall() the remote stream ", remoteStream.toURL());
      setPeerStream(remoteStream);
    })

    //console.log(RTCLoaclStream)
    //call to peer
    //var call = peer.call(remoteId,media);
    //console.log("****local call ", call)
    // call.on('stream',(remoteStream)=>{

    //another peer media
    // console.log("*** inside makecall() the stream ",remoteStream);
    //}) 
  }

console.log( myStream?.toURL(),peerStream?.toURL());

  return (
    <View>
      <Text>hellooooooooo am  clientA heyy  https://local:3000</Text>
      <TextInput onChangeText={(el) => { txt.current = el }} />
      <Button
        title="connect" onPress={() => {
          console.log(txt.current)
          setRemoteId(txt.current)
        }} />
      <Button
        title="make call" onPress={() => { makeCall() }} />
      <Text>Local Stream</Text>
      {/* {myStream && <RTCView style={{ height: 200, width: 400 }} streamURL={myStream.touRL()} />} */}
      {myStream && console.log("LOCAL STREAM INSIDE render function ", myStream.toURL())}
      <Text>Remote Stream</Text>
      {peerStream && <RTCView style={{ height: 200, width: 400 }} streamURL={peerStream.toURL()} />}
   
    </View>
  )

}
export default App;
