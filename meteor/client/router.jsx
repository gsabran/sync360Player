import React from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {mount} from 'react-mounter';
import Layout from './modules/Layout.jsx';

import Default from './modules/Default.jsx';
FlowRouter.route('/', {
  name: 'default',
  action: function() {
    Meteor.call('unwaitForVideo');
    mount(Layout, {content: () => (<Default /> )});
  },
});

import GettingReady from './modules/GettingReady.jsx';
FlowRouter.route('/video/:_id', {
  name: 'video',
  action: function() {
    const videoId = FlowRouter.getParam('_id');
    Meteor.call('waitForVideo', videoId);
    mount(Layout, {content: () => (<GettingReady _id={videoId}/> )});
  },
});

import VideoPlayer from './modules/VideoPlayer.jsx';
FlowRouter.route('/play/:_id', {
  name: 'videoPlayer',
  action: function() {
    const videoId = FlowRouter.getParam('_id');
    mount(Layout, {content: () => (<VideoPlayer _id={videoId}/> )});
  },
});

