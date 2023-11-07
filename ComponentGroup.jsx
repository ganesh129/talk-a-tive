import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import CSSTransition from 'react-transition-group/CSSTransition';

// Utils
import { getShowForProducts } from '../../../utilities/section/sectionUtils';
import { calcColumns, stepShowHide } from '../../../utilities/form/formUtils';

// Constants
import { stepComponents } from '../../../constants/Steps';

const ComponentGroup = ({
  components: componentProps,
  price,
  dispatch,
  errors,
  handleSubmit,
  onBlur,
  onChange,
  setValues,
  touched,
  values,
  setFormValues,
  userData,
  initialValues,
  setFieldValue,
  className,
}) => {
  return (
    <div className={className}>
      {/* If there's any props */}
      {!isEmpty(componentProps) && (
        getShowForProducts(componentProps, userData).map(componentProp => {
          if (componentProp.showHide &&
            stepShowHide(false, componentProp.showHide, userData, values)) {
            return <div/>;
          }
          const inputParams = {
            'children': componentProps,
            'columns': calcColumns(componentProp),
            ...componentProp,
            dispatch,
            errors,
            handleSubmit,
            onBlur,
            onChange,
            setFormValues,
            setValues,
            touched,
            values,
            price,
            userData,
            setFieldValue,
            initialValues,
          };
          const PriceComponent = stepComponents[componentProp.type];
          return (
            <CSSTransition
              in={componentProp.hidden !== true}
              timeout={300}
              classNames="slideInTop"
              unmountOnExit
            >
              <PriceComponent {...inputParams} />
            </CSSTransition>
          );
        })
      )}
    </div>
  );
};
export default ComponentGroup;

ComponentGroup.defaultProps = {
  errors: null,
  className: '',
};

ComponentGroup.propTypes = {
  dispatch: PropTypes.func.isRequired,
  errors: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  setFormValues: PropTypes.func.isRequired,
  setValues: PropTypes.func.isRequired,
  touched: PropTypes.object.isRequired,
  userData: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  components: PropTypes.array.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  price: PropTypes.string,
  className: PropTypes.string,
};
