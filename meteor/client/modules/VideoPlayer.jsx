import React, {PropTypes, Component} from 'react';
import aframe from 'aframe';
import ReactDOM from 'react-dom';
import {angleToPosition, interpolate} from '../lib/positionHelper.js';
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
    Socket.create(function(socket) {
      socket.emit('auth', videoId, userId);
      socket.on('rotation', function({userId, rotation}) {
        var newRotationState = {};
        newRotationState[userId] = interpolate(userId, rotation);
        self.setState(newRotationState);
      });
      self.socket = socket;
    });

  }
  componentWillUnmount() {
    inteval.clearInterval();
  }

  render () {
    var rotationsData = this.state;
    return <div>
      <a-scene stats="true">
        <a-camera position="0 0 0" wasd-controls-enabled="false" ref="camera">
        </a-camera>

        <a-entity id="vidSphere"
         geometry="primitive: sphere;
                      radius: 5000;
                      segmentsWidth: 64;
                      segmentsHeight: 64;" material="shader: flat; src: #video" scale="-1 1 1">
        </a-entity>    
        {Object.keys(rotationsData).map(function(userId) {
          const rotationData = rotationsData[userId];
          if (!rotationData)
            return null;

          const position = angleToPosition(5, rotationData);
          const thepos = String(position.x) + " " + String(position.y) + " " + String(position.z);
          return <a-cube position={thepos} rotation="30 30 0" width="1" depth="1" height="1" color="#F16745" roughness="0.8" key={userId}></a-cube>
        })}

    </a-scene>
    </div>
  }
}
