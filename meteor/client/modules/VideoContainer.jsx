/*
 * The UI for people to wait for other to be ready
 */

import React, {Component} from 'react';
import {ReactMeteorData} from 'meteor/react-meteor-data';
import reactMixin from 'react-mixin';
import flowHelpers from '../lib/flowHelper.js';
import {FlowRouter} from 'meteor/kadira:flow-router';
import VideoPlayer from './VideoPlayer.jsx'
import ReactDOM from 'react-dom';

/*
 * The UI for people to wait for other to be ready
 */
export default class VideoContainer extends Component {
  getMeteorData() {
    const videoId = this.props._id;
    Meteor.subscribe('video', videoId);
    const handle = Meteor.subscribe('usersOnVideo', videoId);
    const video = Videos.findOne(videoId);

    // the video has been deleted
    if (handle.ready() && !video)
      FlowRouter.go('default');
    
    return {
      users: Users.find({currentVideo: videoId}).fetch(),
      video: video,
    }
  }
  render() {
    const {users, video} = this.data;
    let allAreReady = true;

    const mainContent = () => {
      if (video && video.isPlaying) {
        return <VideoPlayer _id={this.props._id} />
      } else {
        return <div>
          {users.map((user) => {
            allAreReady = allAreReady && user.isReady;
            return <UserVideoContainer {...user} key={user._id}/>
          })}
          {allAreReady && <div className="go" onClick={this.startVideo.bind(this)}>Go!</div>}
        </div>
      }
    }

    return <div className="videoContainer">
      <video width="1000" height="500" loop="true" crossOrigin="anonymous" id="video" controls="" ref="video" style={{display: 'none'}}>
        <source src={video && video.url} type="video/mp4"/>
      </video>
        {mainContent()}
      </div>
  }
  componentDidUpdate() {
    const {video} = this.data;
    if (video && video.isPlaying) {
      const videoDom = ReactDOM.findDOMNode(this.refs.video);
      if (videoDom && videoDom.paused)
        videoDom.play();
    }
  }
  startVideo() {
    Meteor.call('videoStarts', this.props._id);
  }
}
reactMixin(VideoContainer.prototype, ReactMeteorData);

/*
 * display one user waiting for the video to start
 */
class UserVideoContainer extends Component {
  render() {
    const {name, picture, isReady, emails, _id} = this.props;

    return <div>
      <img src={picture}/>
      <div className="name" key={0}>{emails[0].address}</div>
      <div className="status" key={1}>{isReady ? 'ready' : 'not ready'}</div>
      {_id === Meteor.userId() &&
        <div className="button" key={2} onClick={this.changeReadyState.bind(this)}>{isReady ? 'Wait, I\'m not ready!' : 'I\'m ready to go'}</div>
      }
    </div>
  }
  changeReadyState() {
    Meteor.call('changeReadyState', this.props._id);
  }
}