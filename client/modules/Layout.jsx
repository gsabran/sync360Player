/*
 * The layout that wraps the entire application
 */

import React, {PropTypes, Component} from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin(); // like FastClick


export default class Layout extends Component {
  render() {
    const {content} = this.props;
    /*
     * The above {syntax} is called destructuring, it's a JavaScript ES6 feature.
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
     *
     * It's shorthand for this:
     *
     * something = (props) {
     *   const content = props.content;
     * }
     */
    return <div>
      {content()}
    </div>
  }
}

/*
 * PropTypes allows you to specify what prop names (and their respective types)
 * should be passed into this component.
 * See https://facebook.github.io/react/docs/reusable-components.html#prop-validation
 */
Layout.propTypes = {
  content: PropTypes.func.isRequired
};


/*
 * This is not necessary unless you're using the React DevTools browser
 * extension. If you don't specify a displayName on a stateless component,
 * it will show up as "StatelessComponent" in the tree, which can make it
 * difficult to debug your application.
 * https://github.com/facebook/react-devtools (HIGHLY recommended!)
 */
Layout.displayName = 'Layout';

