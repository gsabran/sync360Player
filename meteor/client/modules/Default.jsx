/*
 * A dummy react componnent
 */

import React, {PropTypes, Component} from 'react';
import VideoPlayer from './VideoPlayer.jsx'


export default class Default extends Component {
  render() {

    return (
    	<div> 
    		<VideoPlayer />
    	</div>
    	);
  }
}
Default.displayName = 'Default';

