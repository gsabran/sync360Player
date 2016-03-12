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

    Meteor.subscribe('usersWaitingForVideo');
    return {
      users: Users.find({waitingForVideo: true}).fetch(),
    }
  }
  render() {
    const users = this.data.users;
    return <div>
      {users.map((user) => {
        return <userGettingReady {...user} key={user._id}/>
      })}
    </div>
  }
}
reactMixin(GettingReady.prototype, ReactMeteorData);

/*
 * display one user waiting for the video to start
 */
class userGettingReady extends Component {
  render() {
    const {name, picture, status} = this.props;
    return <div>
      <img src={picture}/>
      <div className="name">{name}</div>
      <div className="status">{status}</div>
    </div>
  }
}