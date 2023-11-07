import { Component } from 'preact';
import PropTypes from 'prop-types';
import createActivityDetector from 'activity-detector';

// Components
import { actionHandler } from '../../../utilities/form/formUtils';

class IdleAction extends Component {
  constructor(props) {
    super(props);
    const {
      actions,
      dispatch,
      setFieldValue,
      setValues,
      values,
      timeout,
    } = props;
    const activityDetector = createActivityDetector({ timeToIdle: timeout });

    activityDetector.on('idle', () => {
      actionHandler(actions, null, null, dispatch, { ...values, setFieldValue }, setValues);
      // Only run the action once.
      activityDetector.stop();
    });
    /*
     We only allow for one idleAction for now. As it will support most use cases this will suffice.
     Need to add id to idleAction if we want to have multiple and change to array.
    */
    if (window.idleAction) {
      window.idleAction.stop();
    }
    window.idleAction = activityDetector;
  }
}

export default IdleAction;

IdleAction.defaultProps = {
  timeout: 1000 * 30,
};

IdleAction.propTypes = {
  dispatch: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setValues: PropTypes.func.isRequired,
  actions: PropTypes.array.isRequired,
  timeout: PropTypes.number,
};
