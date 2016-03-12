import React, {PropTypes, Component} from 'react';
import aframe from 'aframe';
import {Animation, Entity, Scene} from 'aframe-react';

export default class VideoPlayer extends Component {
  render () {
    return (
      <Scene>
        <Entity geometry={{primitive: 'box'}} material="color: red" position={[0, 0, -5]}>
          <Animation attribute="rotation" dur="5000" repeat="indefinite" to={[0, 360, 360]}/>
        </Entity>
      </Scene>
    );
  }
}