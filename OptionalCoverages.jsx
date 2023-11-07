import { Component } from 'preact';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';

import Coverage from './Coverage';
import Text from '../../Global/Text';

import { replaceData } from '../../../utilities/common';
import { setCoverageCodeFormParams, validateCoverageCode } from '../../../utilities/package/packageUtils';

class OptionalCoverages extends Component {
  render() {
    const {
      packageIdAdvance,
      advancedCoverageAction,
      handleSubmit,
      onChange,
      onBlur,
      errors,
      touched,
      setValues,
      values,
      setFormValues,
      initialValues,
      dispatch,
      userData,
      setFieldValue,
      optionalCoverageTitle,
    } = this.props;

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
      advancedCoverageAction,
    };

    const { packages } = initialValues;
    const packIdAdv = replaceData(packageIdAdvance, userData);
    const packageItemAdvanced = packages.reduce((ag, element) => {
      return element.id === packIdAdv ? element : ag;
    }, {});

    return (
      <div>
        {optionalCoverageTitle && <Text value={optionalCoverageTitle} component="h4" />}
        {packageItemAdvanced.availableCoverages
          .filter(coverageCode => validateCoverageCode({
            code: coverageCode,
          }, initialValues, userData))
          .map(coverage =>
            <div className="coverage-outer">
              <MediaQuery minWidth={769}>
                <div>
                  <Coverage
                    variant="checkbox"
                    id={coverage}
                    coverageCode={coverage}
                    {...setCoverageCodeFormParams(formParams, coverage)}
                    name="coverageCodes"
                  />
                </div>
              </MediaQuery>
              <MediaQuery maxWidth={768}>
                <div>
                  <Coverage
                    variant="accordion"
                    id={coverage}
                    coverageCode={coverage}
                    {...setCoverageCodeFormParams(formParams, coverage)}
                    name="coverageCodes"
                  />
                </div>
              </MediaQuery>
            </div>
          )}
      </div>
    );
  }
}

export default OptionalCoverages;

OptionalCoverages.defaultProps = {
  errors: null,
};

OptionalCoverages.propTypes = {
  errors: PropTypes.object,
  packageIdAdvance: PropTypes.string.isRequired,
  columns: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  userData: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  setValues: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  setFormValues: PropTypes.func.isRequired,
  touched: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  advancedCoverageAction: PropTypes.array.isRequired,
  optionalCoverageTitle: PropTypes.string.isRequired,
};