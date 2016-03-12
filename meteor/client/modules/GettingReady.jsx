/*
 * The UI for people to wait for other to be ready
 */

import React, {Component} from 'react';
import {ReactMeteorData} from 'meteor/react-meteor-data';
import reactMixin from 'react-mixin';

/*
 * The UI for people to wait for other to be ready
 */
export default class GettingReady extends Component {
  getMeteorData() {
    const videoId = this.props._id;
    Meteor.subscribe('userscurrentVideo', videoId);
    return {
      users: Users.find({currentVideo: videoId}).fetch(),
    }
  }
  render() {
    const users = this.data.users;
    let allAreReady = true;
    return <div>
      {users.map((user) => {
        allAreReady = allAreReady && user.isReady;
        return <UserGettingReady {...user} key={user._id}/>
      })}
      {allAreReady && <div className="go" onClick={this.startVideo.bind(this)}>Go!</div>}
    </div>
  }
  startVideo() {
    //TODO
    window.alert('should start video');
  }
}
reactMixin(GettingReady.prototype, ReactMeteorData);

/*
 * display one user waiting for the video to start
 */
class UserGettingReady extends Component {
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
    console.log('changeReadyState');
    Meteor.call('changeReadyState', this.props._id);
  }
}