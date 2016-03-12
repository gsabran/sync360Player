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
    Meteor.subscribe('usersWaitingForVideo', videoId);
    return {
      users: Users.find({waitingForVideo: videoId}).fetch(),
    }
  }
  render() {
    const users = this.data.users;
    return <div>
      {users.map((user) => {
        return <UserGettingReady {...user} key={user._id}/>
      })}
    </div>
  }
}
reactMixin(GettingReady.prototype, ReactMeteorData);

/*
 * display one user waiting for the video to start
 */
class UserGettingReady extends Component {
  render() {
    const {name, picture, status, emails} = this.props;
    return <div>
      <img src={picture}/>
      <div className="name" key={0}>{emails[0].address}</div>
      <div className="status" key={1}>{status}</div>
    </div>
  }
}