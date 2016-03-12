import React from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {mount} from 'react-mounter';
import Layout from './modules/Layout.jsx';

import Default from './modules/Default.jsx';
FlowRouter.route('/', {
  name: 'default',
  action: function() {
    mount(Layout, {content: () => (<Default /> )});
  },
});

import GettingReady from './modules/GettingReady.jsx';
FlowRouter.route('/video/:_id', {
  name: 'video',
  action: function() {
    mount(Layout, {content: () => (<GettingReady _id={FlowRouter.getParam('_id')}/> )});
  },
});

