/*
 * The UI for people to wait for other to be ready
 */

import React, {Component} from 'react';
import {ReactMeteorData} from 'meteor/react-meteor-data';
import reactMixin from 'react-mixin';

/*
 * The UI for people to wait for other to be ready
 */
export default class UserRotations extends Component {
  getMeteorData() {
    const videoId = this.props._id;
    Meteor.subscribe('usersRotationForVideo', videoId);
    return {
      users: Users.find({currentVideo: videoId}).fetch(),
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
reactMixin(UserRotations.prototype, ReactMeteorData);
