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
          <table>
            <tbody>
              {users.map((user) => {
                allAreReady = allAreReady && user.isReady;
                return <UserVideoContainer {...user} key={user._id}/>
              })}
            </tbody>
          </table>
          {allAreReady && <div className="go"><div className="btn btn-success" onClick={this.startVideo.bind(this)}>Go!</div></div>}
        </div>
      }
    }

    return <div className="videoContainer" onClick={this.load.bind(this)}>
      <video width="1000" height="500" loop="true" crossOrigin="anonymous" id="video" controls="" ref="video" style={{display: 'none'}}>
        <source src={video && video.url} type="video/mp4"/>
      </video>
        {mainContent()}
      </div>
  }
  load() {
    const {video} = this.data;

    // the data has not been loaded yet
    if (!video)
      return;

    const videoDom = ReactDOM.findDOMNode(this.refs.video);
    if (video.isPlaying) {
      if (videoDom && videoDom.paused)
        videoDom.play();
      if (this.forcePause) {
        clearInterval(this.forcePause);
        videoDom.muted = false;
        this.forcePause = null;
      }
      return;
    }
    if (!this.isLoading) {
      this.isLoading = true;
      videoDom.load();
    }
    if (!this.forcePause) {
      const self = this;
      videoDom.play();
      this.forcePause = setInterval(function() {
        videoDom.currentTime = 0;
        videoDom.muted = true;
      }, 1);
    }
  }
  componentDidUpdate() {
    this.load();
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

    return <tr className="userPreview">
      <td><img src={picture}/></td>
      <td className="name" key={0}>{emails[0].address}</td>
      <td className="status" key={1}>{isReady ? 'ready' : 'not ready'}</td>
      {_id === Meteor.userId() &&
        <td className="button btn btn-primary" key={2} onClick={this.changeReadyState.bind(this)}>{isReady ? 'Wait, I\'m not ready!' : 'I\'m ready to go'}</td>
      }
    </tr>
  }
  changeReadyState() {
    Meteor.call('changeReadyState', this.props._id);
  }
}