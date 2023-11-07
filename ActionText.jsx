import { Component } from 'preact';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Utils
import { actionHandler } from '../../../utilities/form/formUtils';

// Components
import Text from '../../Global/Text';

class ActionText extends Component {
  render() {
    const {
      id,
      actions,
      dispatch,
      values,
      tracking,
      setValues,
      className,
      dataTealium,
      additionalClassName,
      component: Element,
      preText,
      postText,
      actionText,
    } = this.props;

    const buttonClass = classNames(
      'button',
      'button--link',
      'style--inherit',
      'd--inline',
      tracking
    );

    return (
      <Element className={additionalClassName}>
        {preText &&
        <Text value={preText}/>
        }
        {actionText &&
        <button
          type="button"
          className={buttonClass}
          id={id}
          name={id}
          onClick={e => actionHandler(actions, null, e, dispatch, values, setValues)}
          data-tealium={dataTealium}
        >
          <Text value={actionText} className={className}/>
        </button>
        }
        {postText &&
        <Text value={postText}/>
        }
      </Element>
    );
  }
}

export default ActionText;

ActionText.defaultProps = {
  values: null,
  tracking: ['tealiumSubmit'],
  actions: [],
  className: 'link--action',
  component: 'span',
  dataTealium: null,
  additionalClassName: '',
  preText: '',
  postText: '',
  actionText: '',
};

ActionText.propTypes = {
  id: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  component: PropTypes.string,
  values: PropTypes.object,
  tracking: PropTypes.array,
  actions: PropTypes.array,
  setValues: PropTypes.func.isRequired,
  className: PropTypes.string,
  dataTealium: PropTypes.string,
  additionalClassName: PropTypes.string,
  preText: PropTypes.string,
  postText: PropTypes.string,
  actionText: PropTypes.string,
};
