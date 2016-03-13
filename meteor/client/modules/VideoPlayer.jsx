import React, {PropTypes, Component} from 'react';
import aframe from 'aframe';
import ReactDOM from 'react-dom';
import {angleToPosition, interpolate, getPointsDistance, getCapedRotation} from '../lib/positionHelper.js';
import {Socket} from '../lib/socketManager.js';


const degToRad = Math.PI / 180;

export default class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    // state keep track of all known rotations data and of the live socket
    this.state = {};
  }
  /*
   * get the current rotation and broadcast it
   */
  updateRotation() {
    var myCamera = ReactDOM.findDOMNode(this.refs.camera);
    var rotation = myCamera.getAttribute("rotation");
    delete rotation.z;

    // no change
    if (this.socket && this.rotation && this.rotation.x === rotation.x && this.rotation.y === rotation.y)
      return;

    this.setState({rotation});

    if (this.socket) {
      this.socket.emit('setRotation', rotation);
      this.rotation = rotation;
    }
  }
  /*
   * get a smooth version of all the positions from other users
   */
  updateRotations() {
    const newState = {};
    for (var k in this.state) {
      const pos = interpolate(k);
      if (pos)
        newState[k] = pos;
    }
    this.setState(newState);
  }
  componentDidMount() {


    var interval = setInterval(this.updateRotation.bind(this), 100);
    var interval = setInterval(this.updateRotations.bind(this), 30);
    const userId = Meteor.userId();
    const videoId = this.props._id;
    var self = this;
    Socket.create(Socket.getRotationServerIPAddress(),Socket.getRotationServerPort(), function(socket) {
      socket.emit('auth', videoId, userId);
      socket.on('rotation', function({userId, rotation}) {
        var newRotationState = {};
        newRotationState[userId] = interpolate(userId, rotation);
        self.setState(newRotationState);
      });
      socket.on('playerRemoved', function({userId}) {
        var state = self.state;
        delete state[userId];
        self.setState(state);
      });
      self.socket = socket;
    });

    // making calls to other users
    console.log('making calls to other users: ' + this.props.users);
    for (var user of this.props.users) {  
      console.log('is user master: ' + this.props.video.masterId);
      if(this.props.video.masterId === Meteor.userId()) {
        var outgoingCall = peer.call(user.peedId, window.localStream);
        window.currentCall = outgoingCall;
        outgoingCall.on('stream', function (remoteStream) {
          window.remoteStream = remoteStream;
          var video = document.getElementById("theirVideo")
          video.src = URL.createObjectURL(remoteStream);
        });
      }
    }

  }

  componentWillUnmount() {
    inteval.clearInterval();
    window.currentCall.close();
  }

  render () {
    var rotationsData = this.state;
    const vfov = 80 - 10; // -10 to keep things visible and not just on the border
    const aspect = 1.0 * window.innerWidth / window.innerHeight;
    const hfov = 2 * Math.atan( Math.tan( vfov * Math.PI / 180 / 2 ) * aspect ) * 180 / Math.PI;

    // convert position to string
    const getPos = (position) => {
      return position.x + " " + position.y + " " + position.z;
    }



    const cameraRotation = this.rotation;

    return <div>
      <a-scene stats="true">
        <a-assets>
          <a-asset-item id="g-mtl" src="/models/g.mtl"></a-asset-item>
          <a-asset-item id="g-obj" src="/models/g.obj"></a-asset-item>
          <a-asset-item id="b-mtl" src="/models/b.mtl"></a-asset-item>
          <a-asset-item id="b-obj" src="/models/b.obj"></a-asset-item>
          <a-asset-item id="s-mtl" src="/models/s.mtl"></a-asset-item>
          <a-asset-item id="s-obj" src="/models/s.obj"></a-asset-item>
        </a-assets>

        <a-camera position="0 0 0" wasd-controls-enabled="false" ref="camera">
        </a-camera>

        <a-entity id="vidSphere"
         geometry="primitive: sphere;
                      radius: 5000;
                      segmentsWidth: 64;
                      segmentsHeight: 64;" material="shader: flat; src: #video" scale="-1 1 1">
        </a-entity>  


        {Object.keys(rotationsData).map(function(userId) {
          if (userId === 'rotation')
            return;

          const rotationData = rotationsData[userId];
          if (!rotationData)
            return null;

          const newRotation = getCapedRotation(cameraRotation, rotationData, vfov, hfov) || rotationData;
          const distance = getPointsDistance(newRotation, rotationData);
          const position = angleToPosition(5 * (1 + distance), newRotation);

          const modelRotation =  (rotationData ? rotationData.y : 0);

          const modelRotationx =  180 + (rotationData ? rotationData.x : 0);


          const theRot = getPos({x: modelRotationx, y: modelRotation, z: 0});


          const userEmail = Meteor.users.findOne({"_id":userId}).emails[0].address;



          if (userEmail == "g@gmail.com") {
          return <a-obj-model position={getPos(position)} rotation={theRot} 
                       scale="3 3 3" src="#g-obj" mtl="#g-mtl" key={userId}></a-obj-model> }

          if (userEmail == "b@gmail.com") {
          return <a-obj-model position={getPos(position)} rotation={theRot} 
                       scale="3 3 3" src="#b-obj" mtl="#b-mtl" key={userId}></a-obj-model> }

          if (userEmail == "s@gmail.com") {
          return <a-obj-model position={getPos(position)} rotation={theRot} 
                       scale="3 3 3" src="#s-obj" mtl="#s-mtl" key={userId}></a-obj-model> }

          else {
          return <a-cube position={getPos(position)} rotation="30 30 0" width="1" depth="1" height="1" color="#F16745" roughness="0.8" key={userId}></a-cube> }
        })}
    </a-scene>
    </div>
  }
  componentDidUpdate() {
  }
}
