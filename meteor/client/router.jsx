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
