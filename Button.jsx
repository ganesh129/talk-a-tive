import { Component } from 'preact';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../../Global/Icon';
// Utils
import { actionHandler, stepHasRequiredData } from '../../../utilities/form/formUtils';

// Components
import Text from '../../Global/Text';

class Button extends Component {
  constructor(props) {
    super(props);
    this.setButton = this.setButton.bind(this);
    this.state = {
      active: false,
    };
  }

  setButton() {
    const { active } = this.state;
    this.setState({
      active: !active,
    });
  }

  render() {
    const { active } = this.state;
    const {
      id,
      label,
      actions,
      dispatch,
      variant,
      values,
      columns,
      type,
      tracking,
      requiredData,
      userData,
      inline,
      subType,
      setValues,
      className,
      dataTealium,
      additionalClassName,
      icon,
      hideButton,
    } = this.props;
    const isDisabled = !stepHasRequiredData(requiredData, userData, values);

    const formFieldClass = classNames(
      'form__field', {
        'form__field--active': active,
        [`form__field--${id}`]: id,
        [`form__field--${type}`]: type,
        [`form__field--${type}-${variant}`]: type && variant,
        [`form__field--${columns}col`]: columns,
        [`${className}`]: className !== '',
      }
    );
    const buttonClass = classNames(
      'button', {
        'button--hide': isDisabled && hideButton,
        'button--disabled': isDisabled,
        'button--secondary': variant === 'button' && className === '',
        'button--primary': variant === 'button' && className !== '',
        [`button--${variant}`]: variant !== 'button',
        [`${additionalClassName}`]: additionalClassName !== '',
      },
      tracking
    );

    return (
      <div className={formFieldClass}>
        {inline &&
          <Text value={inline} component="span" className="button--inline" />
        }
        {icon ?
          <button
            type={subType}
            className={buttonClass}
            name={id}
            value={label}
            disabled={isDisabled}
            onClick={e => actionHandler(actions, this.setButton, e, dispatch, values, setValues)}
            data-tealium={dataTealium}
          >
            <Icon icon={icon} />

          </button> :
          <button
            type={subType}
            className={buttonClass}
            name={id}
            value={label}
            disabled={isDisabled}
            onClick={e => actionHandler(actions, this.setButton, e, dispatch, values, setValues)}
            data-tealium={dataTealium}
          >
            <Text value={label} />
          </button>
        }
      </div>
    );
  }
}

export default Button;

Button.defaultProps = {
  label: null,
  requiredData: null,
  values: null,
  tracking: ['tealiumSubmit'],
  variant: 'button',
  actions: [],
  userData: null,
  inline: null,
  className: '',
  subType: 'button',
  dataTealium: null,
  additionalClassName: '',
  icon: null,
  hideButton: false,
};

Button.propTypes = {
  id: PropTypes.string.isRequired,
  columns: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  values: PropTypes.object,
  type: PropTypes.string.isRequired,
  tracking: PropTypes.array,
  requiredData: PropTypes.object,
  actions: PropTypes.array,
  label: PropTypes.string,
  variant: PropTypes.string,
  userData: PropTypes.object,
  inline: PropTypes.string,
  setValues: PropTypes.func,
  className: PropTypes.string,
  subType: PropTypes.string,
  dataTealium: PropTypes.string,
  additionalClassName: PropTypes.string,
  icon: PropTypes.string,
  hideButton: PropTypes.bool,
};
