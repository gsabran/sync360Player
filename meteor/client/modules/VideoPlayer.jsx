import React, {PropTypes, Component} from 'react';
import aframe from 'aframe';
import ReactDOM from 'react-dom';
import {ReactMeteorData} from 'meteor/react-meteor-data';
import reactMixin from 'react-mixin';



export default class VideoPlayer extends Component {
	updateRotation() {
		var myCamera = ReactDOM.findDOMNode(this.refs.camera);
		var rotation = myCamera.getAttribute("rotation");

		//write to DB
		Meteor.call("rotationChange",rotation);



	}

	componentDidMount() {
		var interval = setInterval(this.updateRotation.bind(this), 1000);
	}
	componentWillUnmount() {
    	inteval.clearInterval();
  }

	getMeteorData() {
	    Meteor.subscribe('usersRotationForVideo');
	    return {
	      rotations: Users.find({currentVideo: this.props._id, _id: {$ne: Meteor.userId()}}, {fields: {rotation: 1}} ).fetch(),
	    }
	  }

  render () {
  	var players = this.data.rotations;
  	//parse through



    return (
	<div>
     <a-scene stats="true">
	     <a-camera onChange={this.updateRotation} position="0 1.8 4" wasd-controls-enabled="false" ref="camera">
	     </a-camera>

	      <a-entity id="vidSphere"
	       geometry="primitive: sphere;
	                    radius: 5000;
	                    segmentsWidth: 64;
	                    segmentsHeight: 64;" material="shader: flat; src: #video" scale="-1 1 1">
	      </a-entity>    

	      {players.map(function(pos) {
                    return <a-cube position={pos} rotation="30 30 0" width="2" depth="2" height="2" color="#F16745" roughness="0.8"></a-cube>
                  })}

    </a-scene>
    </div>
    );
  }
}

reactMixin(VideoPlayer.prototype, ReactMeteorData);