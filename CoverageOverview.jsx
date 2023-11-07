import { Component } from 'preact';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// Components
import Text from '../../Global/Text';
import Icon from '../../Global/Icon';
import Coverage from './Coverage';
import { checkConditions, validateCoverageCode } from '../../../utilities/package/packageUtils';
import { stepShowHide } from '../../../utilities/form/formUtils';
import { clone } from '../../../utilities/common';
import { stepComponents } from '../../../constants/Steps';


class CoverageOverview extends Component {
  render() {
    const {
      columns,
      title,
      type,
      contentInfo,
      userData,
      initialValues,
      dispatch,
      className,
      showDocuments,
    } = this.props;
    const coverageOverviewClasses = classNames(
      'coverage-overview', {
        [`coverage-overview--${type}`]: type,
        [`coverage-overview--${columns}col`]: columns,
      }
    );

    const coverageOverviewTitle = 'coverage-overview__title';

    const coverageOverviewClassOuter = `coverage-overview__outer ${className}`;
    const { coverageList, priceInfo } = initialValues;

    const renderContentInfo = content => (
      <div>
        {content.map(info => {
          if (!info) {
            return '';
          }
          // We clone the list so the original list don't gets updated.
          const newCoverageList = clone(coverageList);

          if (info.showHide && stepShowHide(false, info.showHide, userData, {})) {
            return <div/>;
          }

          return (
            <div>
              {info.showCoverageInfo &&
              <div className="column-layout">
                {Object.keys(newCoverageList)
                  .filter(
                    coverageCode =>
                      !newCoverageList[coverageCode].hideInAccordion &&
                      validateCoverageCode({ code: coverageCode }, initialValues, userData))
                  .map(coverageCode => {
                    return (
                      <div className="coverageInfo-outer">
                        <span>
                          <Coverage
                            variant="compactButton"
                            coverageCode={coverageCode}
                          />
                          <div className="right-justification">
                            <Icon icon="chevronLeft"/>
                          </div>
                        </span>
                      </div>);
                  })
                }
              </div>
              }
              {info.listProps &&
              (info.listProps.map(listProp => {
                  const { hidden, showHide } = listProp;
                  const inputParams = {
                    ...listProp,
                    userData,
                    dispatch,
                    initialValues,
                    hidden: (stepShowHide(hidden, showHide, userData, {})),
                  };
                  if (listProp.conditions && !checkConditions(listProp.conditions, userData)) {
                    return '';
                  }
                  const InputComponent = stepComponents[listProp.type];
                  return (
                    <div className="list-item">
                      <InputComponent {...inputParams}/>
                    </div>
                  );
                })
              )
              }
            </div>
          );
        })
        }
      </div>
    );

    return (
      <div className={coverageOverviewClassOuter}>
        <div>
          <div className={coverageOverviewClasses}>
            <span className={coverageOverviewTitle}>
              <Text value={title}/>
            </span>
            <div
              className="coverage-overview__wrapper rich-text"
              ref={wrapper => this.wrapper = wrapper}
            >
              {contentInfo &&
                renderContentInfo(contentInfo)
              }
              {showDocuments && priceInfo &&
              renderContentInfo(priceInfo)
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CoverageOverview;

CoverageOverview.defaultProps = {
  contentInfo: null,
  userData: null,
  className: '',
  showDocuments: false,
};

CoverageOverview.propTypes = {
  columns: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  contentInfo: PropTypes.array,
  userData: PropTypes.object,
  initialValues: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  className: PropTypes.string,
  showDocuments: PropTypes.bool,
};