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

import VideoContainer from './modules/VideoContainer.jsx';
FlowRouter.route('/video/:_id', {
  name: 'video',
  action: function() {
    const videoId = FlowRouter.getParam('_id');
    Meteor.call('waitForVideo', videoId);
    mount(Layout, {content: () => (<VideoContainer _id={videoId}/> )});
  },
});
