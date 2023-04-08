/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { mediaDevices, RTCView,RTCPeerConnection } from 'react-native-webrtc';


import Peer from 'react-native-peerjs';
const {width, height} = Dimensions.get('window');


const localPeer = new Peer(undefined, {
  host: 'localhost',
  port: 9000,
  path: '/',
  secure: false,
  config: {
    iceServers: [{
      urls: [ "stun:ss-turn2.xirsys.com" ]
   }, {
      username: "1R5glS1MvHe3hWynzfIRDXntfXFSZqWfCud_Rz7c_pn8IC5_yPzXLPOX4vv7-LTlAAAAAGQsFlVtaXRoYW5n",
      credential: "41606242-d2e3-11ed-b8a3-0242ac140004",
      urls: [
          "turn:ss-turn2.xirsys.com:80?transport=udp",
          "turn:ss-turn2.xirsys.com:3478?transport=udp",
          "turn:ss-turn2.xirsys.com:80?transport=tcp",
          "turn:ss-turn2.xirsys.com:3478?transport=tcp",
          "turns:ss-turn2.xirsys.com:443?transport=tcp",
          "turns:ss-turn2.xirsys.com:5349?transport=tcp"
      ]
   }]
  },
});

// localPeer.on('error', console.log);

localPeer.on('open', localPeerId => {
  console.log('Local peer open with ID', localPeerId);

  const remotePeer =  new Peer(undefined, {
    host: 'localhost',
    port: 9000,
    path: '/',
    secure: false,
    config: {
      iceServers: [{
        urls: [ "stun:ss-turn2.xirsys.com" ]
     }, {
        username: "1R5glS1MvHe3hWynzfIRDXntfXFSZqWfCud_Rz7c_pn8IC5_yPzXLPOX4vv7-LTlAAAAAGQsFlVtaXRoYW5n",
        credential: "41606242-d2e3-11ed-b8a3-0242ac140004",
        urls: [
            "turn:ss-turn2.xirsys.com:80?transport=udp",
            "turn:ss-turn2.xirsys.com:3478?transport=udp",
            "turn:ss-turn2.xirsys.com:80?transport=tcp",
            "turn:ss-turn2.xirsys.com:3478?transport=tcp",
            "turns:ss-turn2.xirsys.com:443?transport=tcp",
            "turns:ss-turn2.xirsys.com:5349?transport=tcp"
        ]
     }]
    },
  });
  // remotePeer.on('error', console.log);
  remotePeer.on('open', remotePeerId => {
    console.log('Remote peer open with ID', remotePeerId);

    const conn = remotePeer.connect(localPeerId);
    // conn.on('error', console.log);
    conn.on('open', () => {
      // console.log('Remote peer has opened connection.');
      // console.log('conn', conn);
      conn.on('data', data => console.log('Received from local peer', data));
      // console.log('Remote peer sending data.');
      conn.send('Hello, this is the REMOTE peer!');
    });
  });
});

localPeer.on('connection', conn => {
  
  // console.log('Local peer has received connection.');
  // conn.on('error', console.log);
  conn.on('open', () => {
    // console.log('Local peer has opened connection.');
    // console.log('conn', conn);
    conn.on('data', data => console.log('Received from remote peer', data));
    // console.log('Local peer sending data.');
    conn.send('Hello, this is the LOCAL peer!');
  });
});

const App = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const start = async () => {
    console.log('start');
    if (!localStream) {
      let s;
      try {
        s = await mediaDevices.getUserMedia({ video: true });
        setLocalStream(s);
      } catch(e) {
        console.error(e);
      }
    }
  };
  const stop = () => {
    console.log('stop');
    if (localStream) {
      localStream.release();
      setStream(null);
    }
  };
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.body}>
      {
        localStream &&
          <RTCView
            streamURL={localStream.toURL()}
            style={styles.stream} />
      }
      {
        remoteStream &&
          <RTCView
            streamURL={remoteStream.toURL()}
            style={styles.stream} />
      }
        <View
          style={styles.footer}>
          <Button
            title = "Start"
            onPress = {start} />
          <Button
            title = "Stop"
            onPress = {stop} />
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    ...StyleSheet.absoluteFill
  },
  stream: {
    flex: 0.5
  },
  footer: {
    backgroundColor: Colors.lighter,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
});

export default App;



// import React,{useState} from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
//   ActivityIndicator,
//   Dimensions,
//   Button
// } from 'react-native';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';
// import { mediaDevices, RTCView,RTCPeerConnection } from 'react-native-webrtc';
// import Peer from 'react-native-peerjs';
// const {width, height} = Dimensions.get('window');
// // const localPeer = new Peer();

// // const localPeer = new Peer({
// //   host: "192.168.1.2",
// //   port: 9000,
// //   path: "/",
// // });

// // const localPeer = new Peer(undefined, {
// //   host: "localhost",
// //   path: "/",
// //   secure: false,
// //   port: 9000,
// //   config: {
// //     iceServers: [
// //       {
// //         urls: [
// //           'stun:stun1.l.google.com:19302',
// //           'stun:stun2.l.google.com:19302',
// //         ],
// //       },
// //     ],
// //   },
// // });

// const localPeer = new Peer(undefined, {
//   host: 'localhost',
//   port: 9000,
//   path: '/',
//   secure: false,
//   config: {
//     iceServers: [{
//       urls: [ "stun:ss-turn2.xirsys.com" ]
//    }, {
//       username: "1R5glS1MvHe3hWynzfIRDXntfXFSZqWfCud_Rz7c_pn8IC5_yPzXLPOX4vv7-LTlAAAAAGQsFlVtaXRoYW5n",
//       credential: "41606242-d2e3-11ed-b8a3-0242ac140004",
//       urls: [
//           "turn:ss-turn2.xirsys.com:80?transport=udp",
//           "turn:ss-turn2.xirsys.com:3478?transport=udp",
//           "turn:ss-turn2.xirsys.com:80?transport=tcp",
//           "turn:ss-turn2.xirsys.com:3478?transport=tcp",
//           "turns:ss-turn2.xirsys.com:443?transport=tcp",
//           "turns:ss-turn2.xirsys.com:5349?transport=tcp"
//       ]
//    }]
//   },
// });

// // localPeer.on('error', console.log);

// localPeer.on('open', localPeerId => {
//   console.log('Local peer open with ID', localPeerId);

//   const remotePeer =  new Peer(undefined, {
//     host: 'localhost',
//     port: 9000,
//     path: '/',
//     secure: false,
//     config: {
//       iceServers: [{
//         urls: [ "stun:ss-turn2.xirsys.com" ]
//      }, {
//         username: "1R5glS1MvHe3hWynzfIRDXntfXFSZqWfCud_Rz7c_pn8IC5_yPzXLPOX4vv7-LTlAAAAAGQsFlVtaXRoYW5n",
//         credential: "41606242-d2e3-11ed-b8a3-0242ac140004",
//         urls: [
//             "turn:ss-turn2.xirsys.com:80?transport=udp",
//             "turn:ss-turn2.xirsys.com:3478?transport=udp",
//             "turn:ss-turn2.xirsys.com:80?transport=tcp",
//             "turn:ss-turn2.xirsys.com:3478?transport=tcp",
//             "turns:ss-turn2.xirsys.com:443?transport=tcp",
//             "turns:ss-turn2.xirsys.com:5349?transport=tcp"
//         ]
//      }]
//     },
//   });
//   // remotePeer.on('error', console.log);
//   remotePeer.on('open', remotePeerId => {
//     console.log('Remote peer open with ID', remotePeerId);

//     const conn = remotePeer.connect(localPeerId);
//     // conn.on('error', console.log);
//     conn.on('open', () => {
//       // console.log('Remote peer has opened connection.');
//       // console.log('conn', conn);
//       conn.on('data', data => console.log('Received from local peer', data));
//       // console.log('Remote peer sending data.');
//       conn.send('Hello, this is the REMOTE peer!');
//     });
//   });
// });

// localPeer.on('connection', conn => {
//   // console.log('Local peer has received connection.');
//   // conn.on('error', console.log);
//   conn.on('open', () => {
//     // console.log('Local peer has opened connection.');
//     // console.log('conn', conn);
//     conn.on('data', data => console.log('Received from remote peer', data));
//     // console.log('Local peer sending data.');
//     conn.send('Hello, this is the LOCAL peer!');
//   });
// });
// function App() {
//   const isDarkMode = useColorScheme() === 'dark';
//   const [stream, setStream] = useState(null);
//   const start = async () => {
//     console.log('start');
//     if (!stream) {
//       let s;
//       try {
       
//         s = await mediaDevices.getUserMedia({ video: true });
//         console.log(s);
//         setStream(s);
//       } catch(e) {
//         console.error(e);
//       }
//     }
//   };
//   const stop = () => {
//     console.log('stop');
//     if (stream) {
//       stream.release();
//       setStream(null);
//     }
//   };
//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   return (
//     <SafeAreaView style={backgroundStyle}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       {  stream &&
//                  <RTCView
//              streamURL={stream.toURL()}
//             style={styles.stream} />
//       }
//      {/* {remoteStream && (
//         <RTCView
//           style={styles.remoteStream}
//           streamURL={remoteStream.toURL()}
//           objectFit="cover"
//         />
//       )}
//       {localStream && (
//         <View style={styles.myStreamWrapper}>
//           <RTCView
//             style={styles.myStream}
//             objectFit="cover"
//             streamURL={localStream.toURL()}
//             zOrder={1}
//           />
//         </View>
//       )} */}
//                <View
//            style={styles.footer}>
//            <Button
//              title = "Start"
//              onPress = {start} />
//            <Button
//              title = "Stop"
//              onPress = {stop} />
//         </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//     stream: {
//     flex: 1
//   },
//   container: {
//     backgroundColor: '#0f0f0f',
//     flex: 1,
//     position: 'relative',
//   },
//   myStream: {
//     height: width * 0.6,
//     width: width * 0.4,
//   },
//   myStreamWrapper: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//     height: width * 0.6 + 8,
//     width: width * 0.4 + 8,
//     backgroundColor: '#333',
//     borderRadius: 12,
//     overflow: 'hidden',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   remoteStreamWrapper: {},
//   remoteStream: {
//     width: '100%',
//     height: '100%',
//   },
//   spinnerWrapper: {
//     top: height * 0.3,
//     width: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   callingText: {
//     fontSize: 26,
//     color: '#fff',
//   },
//   iconsWrapper: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//   },
// });


// export default App;
