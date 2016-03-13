import React, {PropTypes, Component} from 'react';
import aframe from 'aframe';
import ReactDOM from 'react-dom';
import {angleToPosition, interpolate, getPointsDistance} from '../lib/positionHelper.js';
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
    const vfov = 80;
    const aspect = 1094.0 / 1402;//1.0 * window.innerHeight / window.innerWidth;
    const hfov = 2 * Math.atan( Math.tan( vfov * Math.PI / 180 / 2 ) * aspect ) * 180 / Math.PI;

    // convert position to string
    const getPos = (position) => {
      return position.x + " " + position.y + " " + position.z;
    }

    const getBorder = () => {

      const rotation = this.rotation;
      if (!rotation)
        return null;

      // give the angle corresponding to @rot between @min and @max
      const inBetween = (rot, min, max) => {
        while (rot > max) {
          rot -= max - min;
        }
        while (rot < min) {
          rot += max - min;
        }
        return rot;
      }

      rotation.x = inBetween(rotation.x, -90, 90);
      rotation.y = inBetween(rotation.y, 0, 360);

      const topLeft = {
        x: rotation.x + vfov / 2,
        y: rotation.y + hfov / 2,
        z: 0,
      };

      const topRight = {
        x: rotation.x + vfov / 2,
        y: rotation.y - hfov / 2,
        z: 0,
      };

      const bottomLeft = {
        x: rotation.x - vfov / 2,
        y: rotation.y + hfov / 2,
        z: 0,
      };

      const bottomRight = {
        x: rotation.x - vfov / 2,
        y: rotation.y - hfov / 2,
        z: 0,
      };

      const center = {
        x: rotation.x,
        y: rotation.y,
        z: 0,
      };

      // show object that are not in the view in the sides
      const getCapedRotation = (rot) => {
        rot.x = inBetween(rot.x, -90, 90);
        rot.y = inBetween(rot.x, 0, 360);
        console.log(vfov, hfov, rot.y - rotation.y, rot.x - rotation.x);
        if (rot.x < rotation.x + vfov / 2 && rot.x > rotation.x - vfov / 2 && (
          (rot.y < rotation.y + hfov / 2 && rot.y > rotation.y - hfov / 2) ||
          (rot.y - 360 < rotation.y + hfov / 2 && rot.y - 360 > rotation.y - hfov / 2) ||
          (rot.y + 360 < rotation.y + hfov / 2 && rot.y + 360 > rotation.y - hfov / 2)
        )) {
          // the the object is in the view
          console.log('in screen');
          return rot
        }

        let side = 0;
        let high = 0;

        if (rot.x > rotation.x + vfov / 2) {
          // too high
          console.log('too high');
          high = 1;

        } else if (rot.x < rotation.x - vfov / 2) {
          // too low
          console.log('too low');
          high = -1;

        }

        if ((rot.y > rotation.y + hfov / 2 && rot.y < rotation.y + 180) ||
          (rot.y > rotation.y + hfov / 2 + 360 && rot.y < rotation.y + 180 + 360) ||
          (rot.y > rotation.y + hfov / 2 - 360 && rot.y < rotation.y + 180 - 360)) {
          // too on the left
          console.log('too on the left');
          side = -1;

        } else if ((rot.y < rotation.y - hfov / 2 && rot.y > rotation.y - 180) ||
          (rot.y < rotation.y - hfov / 2 + 360 && rot.y > rotation.y - 180 + 360) ||
          (rot.y < rotation.y - hfov / 2 - 360 && rot.y > rotation.y - 180 - 360)) {
          // too on the right
          console.log('too on the right');
          side = 1;

        }
        if (high && side) {
          // closest is a corner
          if (high === 1 && side === 1) {
            return topLeft;
          } else if (high === 1 && side === -1) {
            return topRight;
          } else if (high === -1 && side === 1) {
            return bottomLeft;
          } else {
            return bottomRight;
          }
        } else {
          if (high === 1) {
            return {
              x: rotation.x + vfov / 2,
              y: rot.y,
            }
          } else if (high === -1) {
            return {
              x: rotation.x - vfov / 2,
              y: rot.y,
            }
          } else if (side === 1) {
            return {
              x: rot.x,
              y: rotation.y + hfov / 2,
            }
          } else if (side === -1) {
            return {
              x: rot.x,
              y: rotation.y - hfov / 2,
            }
          }
          console.log('!!!! error!');
        }
      }
      // getCapedRotation({x: 0, y: 0});

      return [
        <a-cube position={getPos(angleToPosition(5, topLeft))} rotation="30 30 0" width="1" depth="1" height="1" color="#F16745" roughness="0.8" key={0}></a-cube>,
        <a-cube position={getPos(angleToPosition(5, topRight))} rotation="30 30 0" width="1" depth="1" height="1" color="#F16745" roughness="0.8" key={1}></a-cube>,
        <a-cube position={getPos(angleToPosition(5, bottomLeft))} rotation="30 30 0" width="1" depth="1" height="1" color="#F16745" roughness="0.8" key={2}></a-cube>,
        <a-cube position={getPos(angleToPosition(5, bottomRight))} rotation="30 30 0" width="1" depth="1" height="1" color="#F16745" roughness="0.8" key={3}></a-cube>,
        <a-cube position={getPos(angleToPosition(5, center))} rotation="30 30 0" width="1" depth="1" height="1" color="#F16745" roughness="0.8" key={4}></a-cube>,
        <a-cube position={getPos(angleToPosition(5, getCapedRotation({x: 0, y: 0})))} rotation="30 30 0" width="1" depth="1" height="1" color="green" roughness="0.8" key={5}></a-cube>,
      ]
    }

    return <div>
      <a-scene stats="true">
        <a-camera position="0 0 0" wasd-controls-enabled="true" ref="camera">
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
          return <a-cube position={getPos(position)} rotation="30 30 0" width="1" depth="1" height="1" color="#F16745" roughness="0.8" key={userId}></a-cube>
        })}
        {getBorder()}
    </a-scene>
    </div>
  }
  componentDidUpdate() {
  }
}
