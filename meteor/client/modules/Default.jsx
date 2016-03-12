/*
 * The default page
 */

import React, {PropTypes, Component} from 'react';
import {ReactMeteorData} from 'meteor/react-meteor-data';
import reactMixin from 'react-mixin';
import flowHelpers from '../lib/flowHelper.js';

export default class Default extends Component {
  getMeteorData() {
    Meteor.subscribe('videos');
    return {
      videos: Videos.find({}).fetch(),
    }
  }
  render() {
    return <div>
      I'm done with react :)
      {this.data.videos.map((video) => {
        return <VideoPreview {...video} key={video._id}/>
      })}
    </div>
  }
}
reactMixin(Default.prototype, ReactMeteorData);

class VideoPreview extends Component {
  render() {
    const {_id, preview, title} = this.props;
    return <div className="preview">
      <a href={flowHelpers.pathFor( 'video', {_id} )}>
        <img src={preview} />
        <div className="title">{title}</div>
      </a>
    </div>
  }
}