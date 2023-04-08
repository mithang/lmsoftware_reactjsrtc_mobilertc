import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Button, TextInput } from 'react-native'
import Peer from 'react-native-peerjs'
import {
  RTCView,
  mediaDevices
} from 'react-native-webrtc';
import { io } from "socket.io-client";
//connec to socket server
const socket = io("http://50.35.225.9:5000");

const App = () => {
  //to set the peer object, initally we created the peer object
  const [peer, setPeer] = useState(new Peer());
  //to set my peerconnection id
  const [myId, setMyId] = useState('');
  const [conn, setConn] = useState(null);
  //to set remote peer id
  const [remoteId, setRemoteId] = useState('');
  //to set remote peer Data, initally it's empty object
  const [remotePeerData, setRemotePeerData] = useState({});
  const [con, setCon] = useState({});
  const [isFront, setIsFront] = useState(true);
  //to set my local stream
  const [myStream, setMyStream] = useState();
  //to set remote stream
  const [peerStream, setPeerStream] = useState();
  //to set the roomID 
  const [roomID, setRoomID] = useState('54378');
  //wether to visible or hide the call button, initally it's hidden
  const [callButton, setCallButton] = useState(false);
  //end call button visible or hide, initally it's hidden
  const [endCallButton, setEndCallButton] = useState(false);
  let txt = useRef();
  //to set call Object
  const [callVr,setCallVr] = useState();
  useEffect(() => {

    //when socket connection establish
    socket.on("connect", () => {
      console.log(socket.id);
    });

    //getting all clients id present in the room , we are filtering the ids
    socket.on('peersData', (data) => {
      for (const key in data) {
        if (key !== socket.id) {
          console.log("data comming from server", data[key])
          //set the remote peer data
          setRemotePeerData(data[key]);
          //setRemote peer id
          setRemoteId(data[key].myId)
        }
      }
    })

    //
    socket.on("callButton", () => {
      console.log("make call button need to visible")
      //make callButton visible
      setCallButton(true);
      console.log(callButton)
    })

    //creating peer object
    console.log("peer object ", peer);

    //to get our peerID
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

    //when peer is disconnected
    peer.on('disconnected', () => {
      console.log("*** peer disconnected");
      peer.reconnect();
    });

    //when i clicked peer.destroy method
    peer.on('close', () => {
      console.log("i ended the call")
      // peer.destroy()
      // const tracks = myStream.getTracks()
      // tracks[0].stop()
      // const remoteTracks = peerStream.getTracks()
      // remoteTracks[0].stop()
      //setPeerStream()
      //setMyStream()
    });


    //when we get call from another peer
    peer.on('call', async (call) => {
      //setCallVr
      setCallVr(call);
      let stream = await getMyStream();
      //answer to peer
      call.answer(stream);
      //set my local stream
      setMyStream(stream);
      //when we get remote stream
      call.on('stream', (rmtstream) => {
        console.log("***** remote stream inside peer.on(call) event", rmtstream.toURL());
        //set remote stream
        setPeerStream(rmtstream);
        //set end call button to visible
        setEndCallButton(true)
      })
      //Emitted when either you or the remote peer closes the media connection.
      call.on('close', () => {
        setMyStream();
        setPeerStream();
      })
    });

  }, [])

  //if remoteid is set them makecall button will be visible
  useEffect(() => {
    if (remoteId) {
      // console.log("makecall button is  visible")
      socket.emit("makecall", roomID)
    }
    else {
      // console.log("makecall button not visible")
    }
  }, [remoteId])

  //if remote stream chnage i.e. if remote stream is undefined means remote peer is ended the call
  useEffect(() => {
    console.log(" stream,remote", peerStream)
    if (peerStream === undefined) {
      setMyStream();
      setPeerStream();
    }
  }, [peerStream])

  //get the local stream
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

  //make a call to peer
  const makeCall = async () => {
    //check weather remote id 
    console.log("remoted id stored locally ", remoteId);
    //if media stream present
    //getting media stream 
    let stream = await getMyStream();
    console.log("******** local stream inside making call", stream);
    //set Local stream
    setMyStream(stream);

    const call = peer.call(remoteId, stream);
    //set Callvr
    setCallVr(call);
    //when we get remote stream
    call.on('stream', (remoteStream) => {
      //another peer media
      console.log("*** remote stream  inside makecall() ", remoteStream.toURL());
      setPeerStream(remoteStream);
      //set end call button to visible
      setEndCallButton(true)
    })
    //Emitted when either you or the remote peer closes the media connection.
    call.on('close', () => {
      console.log("remote stream closed")
    })
  }

  //to joining a room
  const joinRoom = () => {
    //joining room with roomid and peerid
    socket.emit('roomJoin', { roomID, myId });
  }

  //call end
  const callEnd = () => {
    // console.log("call object inside callend() ",callVr)
    callVr.close();
    // peer.destroy();
    socket.emit("callEnded", remoteId);
  }

  return (
    <View>
      <Text style={{ textAlign: 'center', fontSize: 50 }}>Video call App</Text>
      {/* <TextInput onChangeText={(el) => { txt.current = el }} />
      <Button
        title="connect" onPress={() => {
          console.log(txt.current)
          setRemoteId(txt.current)
        }} /> */}
      {/* To join the room */}
      <Button
        title="join room" onPress={() => { joinRoom() }} />
      {/* call to peer */}
      {callButton && <Button title="make call" onPress={() => { makeCall() }} />}
      {/* to end the call */}
      {endCallButton && <Button title="End call" onPress={() => { callEnd(); }} />}
      {/* display local stream */}
      <Text>Local Stream</Text>
      {myStream && <RTCView style={{ height: 200, width: 400 }} streamURL={myStream && myStream.toURL()} />}
      {/* display remote stream */}
      <Text>Remote Stream</Text>
      {peerStream && <RTCView style={{ height: 200, width: 400 }} streamURL={peerStream && peerStream.toURL()} />}
    </View>
  )

}
export default App;
