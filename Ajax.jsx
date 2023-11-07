import PropTypes from 'prop-types';
import classNames from 'classnames';

import Icon from '../../Global/Icon';
import Label from '../../Form/Label';
import Text from '../../Global/Text';
import { stepShowHide } from '../../../utilities/form/formUtils';

const Ajax = ({
  message,
  icon,
  columns,
  mobileColumns,
  className,
  hidden,
  label,
  setValues,
  values,
  setFormValues,
  dispatch,
  userData,
  setFieldValue,
  initialValues,
}) => {
  if (hidden) {
    return <div/>;
  }
  const formFieldClass = classNames(
    'deck',
    'deck--grey',
    'site-notification',
    'site-notification--small',
    'form__field',
    className,
    'form__field--textfield', {
      [`form__field--${columns}col`]: columns,
      [`form__field--mobile-${mobileColumns}col`]: mobileColumns,
    }
  );
  const labelParams = {
    setValues,
    values,
    setFormValues,
    dispatch,
    userData,
    setFieldValue,
    initialValues,
    ...label,
  };

  const labelHidden = label ? stepShowHide(label.hidden, label.showHide, userData) : false;

  return (
    <div className='sh-module__modifiers'>
      <div className={formFieldClass}>
        {icon &&
        <div className='site-notification__close'>
          <Icon icon={icon}/>
        </div>
        }
        <div className='ajax-info'>
          <article className='site-notification__inner'>
            <Text value={message}/>
            {label && !labelHidden &&
            <Label {...labelParams} />
            }
          </article>
        </div>
      </div>
    </div>
  );
};

export default Ajax;

Ajax.defaultProps = {
  icon: null,
  mobileColumns: null,
  className: '',
  columns: '',
  label: null,
};

Ajax.propTypes = {
  message: PropTypes.string.isRequired,
  columns: PropTypes.string,
  icon: PropTypes.string,
  mobileColumns: PropTypes.string,
  className: PropTypes.string,
  hidden: PropTypes.bool.isRequired,
  label: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  submitText: PropTypes.string,
  setFormValues: PropTypes.func,
  setValues: PropTypes.func.isRequired,
  userData: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  columnElements: PropTypes.array,
  setFieldValue: PropTypes.func.isRequired,
};
