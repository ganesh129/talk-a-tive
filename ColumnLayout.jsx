import PropTypes from 'prop-types';
import classNames from 'classnames';
import CSSTransition from 'react-transition-group/CSSTransition';

// Utils
import {
  calcColumns,
  stepHasRequiredData,
  getStepWaitText,
  isLoadingOnField,
  stepShowHide,
  stepToggleType,
} from '../../../utilities/form/formUtils';

// Constants
import { stepComponents } from '../../../constants/Steps';

// Components
import FormActions from '../../Form/FormActions';
import Text from '../../Global/Text';

const ColumnLayout = ({
  columnElements: componentProps,
  submitText,
  submitButton,
  dispatch,
  errors,
  handleSubmit,
  onBlur,
  onChange,
  setValues,
  touched,
  values,
  tracking,
  setFormValues,
  formActions,
  requiredData,
  userData,
  actionProps,
  actionVariant,
  initialValues,
  setFieldValue,
  hidden,
  showHide,
  title,
  className,
}) => {
  const formParams = {
    handleSubmit,
    onChange,
    onBlur,
    errors,
    touched,
    setValues,
    values,
    setFormValues,
    dispatch,
    userData,
    setFieldValue,
  };

  if (stepShowHide(hidden, showHide, userData, values)) {
    return '';
  }

  const columnProp = (prop) => {
    if (!prop || !prop.type) {
      return '';
    }
    const InputComponent = stepComponents[prop.type];
    const { loadingOnField } = prop;
    const localHidden = prop.hidden ? prop.hidden : false;
    const localShowHide = prop.showHide ? prop.showHide : null;
    const toggleType = prop.toggleType ? prop.toggleType : null;
    const inputParams = {
      ...prop,
      ...formParams,
      isLoading: loadingOnField ? isLoadingOnField(loadingOnField, userData) : null,
      'columns': calcColumns(prop),
      'children': componentProps,
      hidden: (stepShowHide(localHidden, localShowHide, userData, values)),
      toggleType: (stepToggleType(toggleType, userData, values)),
      initialValues: { ...initialValues },
    };

    return (
      <CSSTransition
        in={inputParams.hidden !== true}
        timeout={300}
        classNames="slideInTop"
        unmountOnExit
      >
        <InputComponent {...inputParams} />
      </CSSTransition>
    );
  };
  const headerClass = classNames(
    'display__text--md margin__bottom--medium', {
      [`${className}`]: className !== '',
    }

  );

  return (
    <div>
      {title &&
        <Text value={title} className={headerClass} component="h3" />
      }
      {/* If there's any props */}
      {componentProps.length > 0 && (
        <div>
          {componentProps.map(column => {
            const gridClasses = `col col--${column.columns} ${column.className}`;
            const subClasses = `${column.classNameSub}`;
            return (
              <div className={gridClasses}>
                {column.title &&
                <Text value={column.title} className="header__title" component="h5"/>
                }
                <div className={subClasses}>
                  {column.columnProps.map(prop => {
                    return columnProp(prop);
                  })}
                  {column.columnLastProps && column.columnLastProps.map(prop => {
                    return columnProp(prop);
                  })}
                </div>
              </div>
            );
          })}

          {/* Actions Button */}
          {submitButton &&
          <FormActions
            formActions={formActions}
            submitText={submitText}
            submitButton={submitButton}
            isValid={stepHasRequiredData(requiredData, userData, values)}
            dispatch={dispatch}
            values={values}
            waitText={getStepWaitText(requiredData, userData, values)}
            tracking={tracking}
            formParams={formParams}
            actionProps={actionProps}
            userData={userData}
            actionVariant={actionVariant}
            setValues={setValues}
            setFieldValue={setFieldValue}
          />
          }

        </div>
      )}

    </div>
  );
};

export default ColumnLayout;

ColumnLayout.defaultProps = {
  actionProps: null,
  errors: null,
  formActions: null,
  handleSubmit: null,
  onBlur: null,
  onChange: null,
  requiredData: {},
  setFormValues: null,
  setValues: null,
  submitButton: true,
  touched: null,
  tracking: ['tealiumSubmit'],
  userData: null,
  actionVariant: 'greyBox',
  hidden: false,
  showHide: null,
  title: null,
  className: '',
};

ColumnLayout.propTypes = {
  dispatch: PropTypes.func.isRequired,
  submitText: PropTypes.string,
  actionProps: PropTypes.array,
  actionVariant: PropTypes.string,
  errors: PropTypes.object,
  formActions: PropTypes.array,
  tracking: PropTypes.array,
  handleSubmit: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  requiredData: PropTypes.object,
  setFormValues: PropTypes.func,
  setValues: PropTypes.func,
  submitButton: PropTypes.bool,
  touched: PropTypes.object,
  userData: PropTypes.object,
  values: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  columnElements: PropTypes.array.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  hidden: PropTypes.bool,
  showHide: PropTypes.object,
  title: PropTypes.string,
  className: PropTypes.string,
};
