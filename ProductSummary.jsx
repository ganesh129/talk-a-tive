import { compose } from 'recompose';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CSSTransition from 'react-transition-group/CSSTransition';
import lifecycle from 'react-pure-lifecycle';

// Utils
import { calcColumns } from '../../../utilities/form/formUtils';

// Constants
import { stepComponents } from '../../../constants/Steps';

// Components
import Text from '../../Global/Text';
import Coverage from './Coverage';
import Icon from '../../Global/Icon';
import {
  getCoverageCodesAndMergeCodes,
  replaceAll,
  getChosenPackage,
  getUsedCoverageCodes,
  getCampaignOffersAndIcon,
  showPackageNameOnSectionCoverage,
  scrollPosition } from '../../../utilities/common';
import Label from '../../Form/Label';


const ProductSummary = ({
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
  sectionHeader,
  sectionContact,
  sectionCoverage,
  sectionConsent,
  sectionPrice,
  sectionDate,
  sectionVoucher,
  sections,
  sectionsRight,
  translations,
  campaigns,
  packageName,
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
  };


  const { chosenPackageName, basketList = [] } = userData;
  let { chosenPackage } = userData;
  chosenPackage = getChosenPackage(chosenPackage, basketList);
  const { showPrePrice } = sectionPrice;
  const { coverageMerge, coverageList } = initialValues;
  const usedCoverageCode = getUsedCoverageCodes(userData, chosenPackage);
  const [coverageCodes, coverageCodesMerge] =
    getCoverageCodesAndMergeCodes(
      usedCoverageCode,
      coverageMerge,
      userData
    );

  const { campaign } = getCampaignOffersAndIcon(
    sectionVoucher,
    initialValues,
    basketList,
    packageName,
    campaigns,
    userData);

  const sectionDateBody = replaceAll(sectionDate.body, translations, userData);
  const showPackageNameOnCoverageSection = showPackageNameOnSectionCoverage(sectionCoverage);
  const additionalValues = sectionCoverage.additionalValues
    .map(listItem => replaceAll(listItem, translations, userData))
    .filter(listItem => listItem.length > 0);

  return (
    <div className="summary">
      <div className="summary__row--product">
        <div className="summary__outer">
          {sectionHeader &&
            <div className="summary__section summary__header">
              <Text value={sectionHeader.title} className="header__title" component="h5"/>
            </div>
          }

          {sectionDateBody &&
            <div className="summary__section summary__section--dateBody">
              <Text value={sectionDateBody} component="div"/>
            </div>
          }

          {sectionCoverage &&
            <div className="summary__section summary__section--coverage">
              <Text value={sectionCoverage.title} component="span"/>
              {chosenPackageName && showPackageNameOnCoverageSection && <Text value={sectionCoverage.packageTitle} component="span"/>}
              <div className="summary__coverage">
                {Object.keys(coverageCodesMerge).map(listItem => {
                return (
                  <div className="summary__coverage-list">
                    <Icon icon="checkmark" fill="black"/>
                    <Coverage variant="name" coverageCode={listItem}/>
                  </div>);
              })}
                {coverageCodes
                .filter(coverage => coverageList[coverage] && !coverageList[coverage].icon)
                .map((listItem, i, a) => {
                  const summaryClass = classNames(
                    'summary__coverage-list', {
                      'last': i === (a.length - 1)
                        && additionalValues.length === 0,
                    }
                  );
                  return (
                    <div className={summaryClass}>
                      <Icon icon="checkmark" fill="black"/>
                      <Coverage variant="name" coverageCode={listItem}/>
                    </div>);
                })}
                {additionalValues
                .map((listItem, i) => {
                  const summaryClass = classNames(
                    'summary__coverage-list',
                    'summary__coverage-list-additional', {
                      'last': i === additionalValues.length - 1,
                    }
                  );

                  return (
                    <div className={summaryClass}>
                      <div>
                        <Icon icon="checkmark" fill="black"/>
                        <Text
                          value={listItem}
                          component="div"
                          className='summary__coverage-list-additionallist'
                        />
                      </div>
                    </div>
                  );
                })}
                {coverageCodes
                .filter(coverage => coverageList[coverage] && coverageList[coverage].icon)
                .map(coverage => {
                  return (
                    <div className="summary__coverage-list advantage">
                      <Icon icon={coverageList[coverage].icon}/>
                      <Coverage variant="name" coverageCode={coverage}/>
                    </div>);
                })
              }
              </div>
            </div>
          }
        </div>

        {sectionContact &&
            sectionContact.map(prop => {
              return (
                <div className="summary__outer">
                  <div className="summary__section summary__contact">
                    <div className="summary__contact--inner">
                      <Text value={prop.title} className="summary__header header__title" component="h5"/>
                      <Text value={prop.body} className="header__title" component="div"/>
                    </div>
                  </div>
                </div>
              );
            })}

        {sections &&
          <div className="summary__outer">
            {sections.map(componentProp => {
            const inputParams = {
              'children': sections,
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
              price: userData.price,
              userData,
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
          }
          </div>
        }
      </div>
      {(sectionPrice ||
        sectionConsent ||
        sectionsRight) &&
        <div className="summary__row--consent">
          <div className="summary__outer--no-box">
            {sectionPrice &&
              <div className="summary__section summary__header">
                <Text value={sectionPrice.title} className="leftSection" component="h5"/>
                <div className="summary__prices">
                  {campaign &&
                    <div className="summary__prePrice">
                      {sectionPrice.showPrePrice &&
                        <div className="summary__prePrice__section">
                          <Text value={sectionPrice.prePriceTitle} className="leftSection" component="h5"/>
                          <div className="rightSection line-through">
                            <Text
                              value={sectionPrice.prePrice}
                              className="summary__prePrice--amount"
                              component="span"
                              numberFormat={true}
                            />

                            <Text value={sectionPrice.unit} className="summary__prePrice--currency" component="span"/>
                          </div>
                        </div>
                      }
                      <div className="summary__prePrice__section">
                        <Text value={sectionPrice.discountTitle} className="leftSection" component="h5"/>
                        <div className="rightSection">
                          <Text
                            value={sectionPrice.discount}
                            className="summary__prePrice--amount"
                            component="span"
                            numberFormat={true}
                          />

                          <Text value={sectionPrice.unit} className="summary__prePrice--currency" component="span"/>
                        </div>
                      </div>

                    </div>
                  }

                  {!sectionPrice.hidePrice &&
                    <div className="summary__price">
                      <Text value={sectionPrice.priceTitle} className="leftSection" component="h5"/>
                      <div className="rightSection">
                        <Text
                          value={sectionPrice.price}
                          className="summary__price--amount"
                          component="span"
                          numberFormat={true}
                        />

                        <Text value={sectionPrice.unit} className="summary__price--currency" component="span"/>
                      </div>
                    </div>
                  }
                  {sectionPrice.showLabelActions &&
                    <div className='summary__prices__footer__note'>
                      <Label
                        id='advanceSummaryFooterNote'
                        label={sectionPrice.taxFooterNoteTitle}
                        className='label__action'
                        actions={sectionPrice.labelActions}
                        dispatch={dispatch}
                        values={values}
                        setValues={setValues}
                      />
                    </div>
                  }
                </div>
              </div>
            }
            {sectionConsent &&
              (sectionConsent.map(list => {
                const inputParams = {
                  ...list,
                  ...formParams,
                  userData,
                  initialValues: { ...initialValues },
                };
                const InputComponent = stepComponents[list.type];
                return (<div className='list-item'><InputComponent {...inputParams} /></div>);
              }))
            }
          </div>
          {sectionsRight &&
            <div className="summary__outer">
              {(sectionsRight.map(list => {
                const inputParams = {
                  ...list,
                  ...formParams,
                  userData,
                  initialValues: { ...initialValues },
                };
                const InputComponent = stepComponents[list.type];
                return (<InputComponent {...inputParams} />);
              }))}
            </div>
          }
        </div>
      }
    </div>
  );
};
const componentDidMount = () => {
  scrollPosition();
};
const methods = {
  componentDidMount,
};
export default lifecycle(methods)(compose(
  connect(state => {
    const {
      section: {
        packageData: {
          translations,
          campaigns,
          initialValues: {
            packageName,
          },
        },
      },
    } = state;
    return {
      translations,
      campaigns,
      packageName,
    };
  })
)(ProductSummary));

ProductSummary.defaultProps = {
  errors: null,
  handleSubmit: null,
  onBlur: null,
  onChange: null,
  setFormValues: null,
  setValues: null,
  touched: null,
  userData: null,
  values: null,
  sectionHeader: null,
  sectionContact: null,
  sectionCoverage: null,
  sectionConsent: null,
  sectionPrice: null,
  sectionDate: null,
  sectionVoucher: null,
  sections: null,
  sectionsRight: null,
  campaigns: null,
};

ProductSummary.propTypes = {
  dispatch: PropTypes.func.isRequired,
  errors: PropTypes.object,
  handleSubmit: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  setFormValues: PropTypes.func,
  setValues: PropTypes.func,
  touched: PropTypes.object,
  userData: PropTypes.object,
  values: PropTypes.object,
  initialValues: PropTypes.object.isRequired,
  sectionHeader: PropTypes.object,
  sectionContact: PropTypes.array,
  sectionCoverage: PropTypes.object,
  sectionConsent: PropTypes.array,
  sectionPrice: PropTypes.object,
  sectionDate: PropTypes.object,
  sectionVoucher: PropTypes.array,
  sections: PropTypes.array,
  sectionsRight: PropTypes.array,
  translations: PropTypes.object.isRequired,
  campaigns: PropTypes.array,
  packageName: PropTypes.string.isRequired,
};