import PropTypes from 'prop-types';
import CSSTransition from 'react-transition-group/CSSTransition';

// Utils
import { getConditionVariant, stepShowHide } from '../../../utilities/form/formUtils';

// Constants
import { stepComponents } from '../../../constants/Steps';

const Condition = ({
  props: componentProps,
  conditions,
  userData,
  dispatch,
  isTrue = getConditionVariant(conditions, userData),
}) => {
  if (!isTrue) {
    return null;
  }

  return (
    <div className="condition">
      {componentProps.map(prop => {
        const ConditionComponent = stepComponents[prop.type];
        const showHide = prop.showHide ? prop.showHide : null;
        const hidden = prop.hidden ? prop.hidden : false;
        const newProp = {
          ...prop,
          dispatch,
          userData,
          hidden: (stepShowHide(hidden, showHide, userData, {})),
        };
        if (newProp.hidden) {
          return null;
        }
        return (
          <CSSTransition
            in={isTrue}
            timeout={300}
            classNames="slideInTop"
            unmountOnExit
          >
            <ConditionComponent {...newProp}/>
          </CSSTransition>
        );
      })}
    </div>
  );
};

export default Condition;

Condition.defaultProps = {
  isTrue: undefined,
};

Condition.propTypes = {
  conditions: PropTypes.array.isRequired,
  props: PropTypes.array.isRequired,
  userData: PropTypes.object.isRequired,
  isTrue: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
};
