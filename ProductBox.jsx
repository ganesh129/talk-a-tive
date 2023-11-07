import { Component } from 'preact';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import MediaQuery from 'react-responsive';
import CSSTransition from 'react-transition-group/CSSTransition';

// Components
import Text from '../../Global/Text';
import Label from '../../Form/Label';
import { actionHandler, stepShowHide } from '../../../utilities/form/formUtils';
import { setCoverageCodeFormParams, validateCoverageCode, checkConditions } from '../../../utilities/package/packageUtils';
import Icon from '../../Global/Icon';
import Coverage from './Coverage';
import { stepComponents } from '../../../constants/Steps';
import { getCoverageCodesAndMergeCodes, replaceData } from '../../../utilities/common';

class ProductBox extends Component {
  constructor(props) {
    super(props);
    this.setActive = this.setActive.bind(this);
    this.state = {
      active: false,
      floaterVisible: false,
    };
  }

  componentDidMount() {
    const screenWidth = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;
    if (screenWidth <= 768) {
      window.onscroll = () => {
        this.isViewportVisible('.infobox__header');
      };
    }
  }

  setActive() {
    const { active } = this.state;
    this.setState({
      active: !active,
    });
  }

  isViewportVisible(elem) {
    const infoBox = document.querySelectorAll(elem);
    const productbox = infoBox && infoBox.length > 0 ? infoBox[infoBox.length - 1] : null;
    if (productbox) {
      const bounding = productbox.getBoundingClientRect();
      if (
        bounding.right >= 0 &&
        bounding.bottom <= 0
      ) {
        this.setState({
          floaterVisible: true,
        });
      } else {
        this.setState({
          floaterVisible: false,
        });
      }
    }
  }

  render() {
    const {
      id,
      columns,
      body,
      actions,
      dispatch,
      label,
      productBoxes,
      productFooterNote,
      userData,
      initialValues,
      setValues,
      values,
      onBlur,
      onChange,
      touched,
      handleSubmit,
      setFormValues,
      errors,
      advancedCoverage,
      packageIdAdvance,
      subProductLabel,
      recommendedText,
      coverageText,
      setFieldValue,
      labelActions,
      activeCoverage,
      serviceName,
      subProductCoverageCode,
      buttonTextMobile,
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
      activeCoverage,
      serviceName: replaceData(serviceName, userData),
    };

    const { packages, coverageList, coverageMerge } = initialValues;
    const advancedClasses = classNames(
      'grid__col', 'grid__col--12', 'grid__col--md-8', 'advanced-coverage'
    );
    const packIdAdv = replaceData(packageIdAdvance, userData);
    const packageItemAdvanced = packages.reduce((ag, element) => {
      return element.id === packIdAdv ? element : ag;
    }, {});

    let boxClasses;
    if (advancedCoverage) {
      boxClasses = 'grid productbox__outer productbox__advanced';
    } else {
      boxClasses = 'grid productbox__outer';
    }

    let priceFloaterClass;
    if (this.state.floaterVisible) {
      priceFloaterClass = 'grid productbox__floater productbox__floater-slidetop';
    } else {
      priceFloaterClass = 'grid productbox__floater productbox__floater-slidebottom';
    }
    const priceUnitLabel = replaceData(label, userData);

    const voucherLink = (title, linkId, variant = null) => {
      if (variant === 'modal') {
        return <Text value={title} />;
      }
      const ButtonComponent = stepComponents.button;
      const buttonParams = {
        id: linkId,
        type: 'button',
        variant: 'text',
        label: title,
        actions: [
          {
            actionType: 'modal',
            props: {
              name: 'campaign',
              campaign: 'voucher',
            },
          },
        ],
        errors,
        touched,
        setValues,
        setFieldValue,
        values,
        dispatch,
        onChange,
        onBlur,
      };
      return <ButtonComponent {...buttonParams} />;
    };
    const renderProductBox = (productBox) => {
      const {
        title, buttonText, buttonClass, footerText, packagePrice, recommended,
        coverages, packageId, subLabelActionEnabled, subLabelActions, subLabelActionText,
        variant, showPrePrice, packagePrePrice,
      } = productBox;
      const campaign = initialValues.campaign &&
      (
        !initialValues.campaign.showForPackages
        || initialValues.campaign.showForPackages.includes(packageId)
      )
        ? initialValues.campaign.productBox || {} : {};
      campaign.text = footerText || campaign.description;
      let buttonClasses = `button button--${buttonClass}`;

      if (recommended && checkConditions(recommended, userData)) {
        buttonClasses = 'button button--primary';
      }

      let textClasses;
      if (recommended && checkConditions(recommended, userData)) {
        textClasses = classNames(
          'infobox', 'productbox', 'grid__col', 'grid__col--12', 'productbox__recommended', {
            [`grid__col--md-${columns}`]: columns,
          }
        );
      } else {
        textClasses = classNames(
          'infobox', 'productbox', 'grid__col', 'grid__col--12', {
            [`grid__col--md-${columns}`]: columns,
          }
        );
      }

      const packageItem = packages.reduce((ag, element) => {
        return element.id === packageId ? element : ag;
      }, {});
      const [coverageCodes, coverageCodesMerge] =
        getCoverageCodesAndMergeCodes(
          coverages && coverages.split('.').reduce((obj, index) => obj[index], userData),
          coverageMerge,
          userData
        );

      const labelPropsAdvanced = {
        actions: labelActions, dispatch, values, setValues,
      };

      const labelActionProps = {
        actions: subLabelActions, dispatch, values, setValues,
      };
      if (advancedCoverage) {
        // Set form params for each coverage code.
        if (!values.coverageCodes) {
          formParams.values.coverageCodes = [...coverages.split('.').reduce((obj, index) => obj[index], userData)];
          formParams.values.coverageCodes.forEach(coverageCode => {
            formParams.values[coverageCode] = true;
          });
          setValues({ ...formParams.values });
        }
      }
      return (
        <article className={textClasses} id={title}>
          {recommended && checkConditions(recommended, userData) &&
            <div className="infobox__recommended"><Text value={recommendedText} /></div>
          }
          <div className="infobox__content">
            {/* Header */}
            <header className="infobox__header">
              {title &&
                <Text value={title} className="header__title" component="h4" />
              }
              <MediaQuery maxWidth={768}>
                {packagePrePrice && showPrePrice && !advancedCoverage
                  && checkConditions(showPrePrice, userData) &&
                  <div className="infobox__preprice">
                    <Text value={packagePrePrice} numberFormat={true} />
                    {Object.hasOwnProperty.call(initialValues, 'units') &&
                      Object.hasOwnProperty.call(userData, label) &&
                      <span> {initialValues.units[userData[label]]}</span>
                    }
                  </div>
                }
              </MediaQuery>
              <MediaQuery maxWidth={768}>
                {packagePrice && !advancedCoverage &&
                  <div className="infobox__price">
                    <Text value={packagePrice} numberFormat={true} />
                    {Object.hasOwnProperty.call(initialValues, 'units') &&
                      Object.hasOwnProperty.call(userData, priceUnitLabel) &&
                      <span>{initialValues.units[userData[priceUnitLabel]]}</span>
                    }

                    {(!Object.hasOwnProperty.call(initialValues, 'units') ||
                      !Object.hasOwnProperty.call(userData, priceUnitLabel)) &&
                      <span>
                        {priceUnitLabel}
                      </span>
                    }
                  </div>
                }
              </MediaQuery>
              <MediaQuery maxWidth={768}>
                {!advancedCoverage &&
                  <div className="infobox__subproduct">
                    {userData.subProduct && userData.subProduct.length > 0 && subProductLabel &&
                      <Coverage variant="listProps" coverageCode={subProductCoverageCode} overrideTitle={subProductLabel} />
                    }
                  </div>
                }
              </MediaQuery>
            </header>

            {/* Body Text */}
            {body &&
              <Text value={body} className="infobox__body" component="div" />
            }

            {/* List Items */}
            <MediaQuery minWidth={769}>
              {coverages &&
                <ul className="infobox__list list">
                  {variant === 'modal' && <li className="list__item list__item--title"><Text value={coverageText} /></li>}
                  {coverageMerge && Object.keys(coverageCodesMerge)
                    .map(key =>
                      <li className="list__item">
                        <div className={coverageCodesMerge[key]}>
                          {(!variant || variant !== 'modal') && <Icon icon="checkmark" fill="black" />}
                          <Coverage variant={variant === 'modal' ? 'nameText' : 'listProps'} coverageCode={key} showDescription={false} />
                        </div>
                      </li>
                    )
                  }
                  {coverageCodes
                    .filter(item => coverageList && coverageList[item])
                    .map(listItem =>
                      <li className="list__item">
                        <div className={packageItem.coverages.reduce((ag, coverage) => {
                          if (coverage.code === listItem && checkConditions(coverage.conditions, userData) && variant !== 'modal') { return coverage.style; }
                          return ag;
                        }, '')}
                        >
                          {(!variant || variant !== 'modal') && <Icon icon="checkmark" fill="black" />}
                          <Coverage variant={variant === 'modal' ? 'nameText' : 'listProps'} coverageCode={listItem} showDescription={false} />
                        </div>
                      </li>
                    )
                  }
                </ul>
              }
            </MediaQuery>
            <MediaQuery maxWidth={768}>
              {coverages &&
                <div>
                  <ul className="infobox__list list">
                    <li className="list__item list__item--title"><Text value={coverageText} /></li>
                    {coverageMerge && Object.keys(coverageCodesMerge)
                      .map(key =>
                        <li className="list__item">
                          <div className={coverageCodesMerge[key]}>
                            <Coverage variant="listProps" coverageCode={key} showDescription={false} />
                          </div>
                        </li>/
                      )
                    }
                    {coverageCodes.map(listItem =>
                      <li className="list__item">
                        <div className={packageItem.coverages.reduce((ag, coverage) => {
                          if (coverage.code === listItem
                            && checkConditions(coverage.conditions, userData)) {
                            return coverage.style;
                          }
                          return ag;
                        }, '')}
                        >
                          <Coverage variant="listProps" coverageCode={listItem} showDescription={false} />
                        </div>
                      </li>)
                    }
                  </ul>
                  {campaign.text &&
                    <div className="list__item--voucher">
                      {voucherLink(campaign.text, `voucher-${packageId}`, variant)}
                    </div>
                  }
                </div>
              }
            </MediaQuery>
            {subLabelActionEnabled &&
              <div className="productbox__footernote grid__col grid__col--12 grid__col--md-12">
                <Label
                  id="advancedProductFooterNote"
                  label={subLabelActionText}
                  className="label__action"
                  {...labelActionProps}
                  values={values}
                  setValues={setValues}
                />
              </div>
            }
            <MediaQuery minWidth={769}>
              {campaign.text &&
                <div className="infobox__gavekort">
                  {(!variant || variant !== 'modal') && <Icon icon={campaign.icon || 'voucherSmall'} fill="red" />}
                  {voucherLink(campaign.text, `voucher-${packageId}`, variant || campaign.variant)}
                </div>
              }
            </MediaQuery>

            <MediaQuery minWidth={769}>
              {packagePrePrice && showPrePrice && checkConditions(showPrePrice, userData) &&
                <div className="infobox__preprice">
                  <Text value={packagePrePrice} numberFormat={true} />
                  {Object.hasOwnProperty.call(initialValues, 'units') &&
                    Object.hasOwnProperty.call(userData, label) &&
                    <span> {initialValues.units[userData[label]]}</span>
                  }
                </div>
              }
            </MediaQuery>

            <MediaQuery minWidth={769}>
              {packagePrice &&
                <div className="infobox__price">
                  <Text value={packagePrice} numberFormat={true} />
                  {Object.hasOwnProperty.call(initialValues, 'units') &&
                    Object.hasOwnProperty.call(userData, priceUnitLabel) &&
                    <span>{initialValues.units[userData[priceUnitLabel]]}</span>
                  }

                  {(!Object.hasOwnProperty.call(initialValues, 'units') ||
                    !Object.hasOwnProperty.call(userData, priceUnitLabel)) &&
                    <span>
                      {priceUnitLabel}
                    </span>
                  }
                </div>
              }
            </MediaQuery>
            <MediaQuery minWidth={769}>
              <div className="infobox__subproduct">
                {userData.subProduct && userData.subProduct.length > 0 && subProductLabel &&
                  <Coverage variant="listProps" coverageCode={subProductCoverageCode} overrideTitle={subProductLabel} />
                }
              </div>
            </MediaQuery>
            {/* Buttons */}
            {buttonText && actions &&
              <button
                type="button"
                className={buttonClasses}
                id={id}
                name={id}
                onClick={e =>
                  actionHandler(
                    actions,
                    null,
                    e,
                    dispatch,
                    { ...values, ...userData, chosenPackage: packageId, chosenPackageName: title },
                    setValues,
                    { chosenPackage: packageId, chosenPackageName: title }
                  )
                }
              >
                <Text value={buttonText} />
              </button>
            }
          </div>
          {advancedCoverage && productFooterNote &&
            <div className="productbox__footernote  grid__col grid__col--12 grid__col--md-12">
              <Label
                id="advancedProductFooterNote"
                label={productFooterNote}
                className="label__action"
                {...labelPropsAdvanced}
              />
            </div>
          }
        </article>
      );
    };
    const productPriceFloater = (productBox) => {
      const {
        title, buttonText, packagePrice, recommended,
      } = productBox;
      let mobileFloaterClasses;
      if (recommended && checkConditions(recommended, userData)) {
        mobileFloaterClasses = 'productbox__floater--outer productbox__floater--recommended';
      } else {
        mobileFloaterClasses = 'productbox__floater--outer';
      }
      const scrollToPosition = (elem) => {
        const elementToScroll = document.getElementById(elem);
        elementToScroll.scrollIntoView({ behavior: 'smooth' });
      };
      return (
        <div className={mobileFloaterClasses}>
          <div className="productbox__floater--title">{title}</div>
          <div className="productbox__floater--price">
            {packagePrice &&
              <div className="productbox__floater--price-inner">
                <div className="infobox__price">
                  <Text value={packagePrice} numberFormat={true} />
                  {Object.hasOwnProperty.call(initialValues, 'units') &&
                    Object.hasOwnProperty.call(userData, priceUnitLabel) &&
                    <span className="productbox__floater--unit">{initialValues.units[userData[priceUnitLabel]]}</span>
                  }

                  {(!Object.hasOwnProperty.call(initialValues, 'units') ||
                    !Object.hasOwnProperty.call(userData, priceUnitLabel)) &&
                    <span className="productbox__floater--unit">
                      {priceUnitLabel}
                    </span>
                  }
                  {buttonText && actions &&
                    <span className="productbox__floater--button">
                      <button
                        type="button"
                        className="label__action button button--text"
                        id={id}
                        name={id}
                        onClick={() =>
                          scrollToPosition(title)
                        }
                      >
                        <Text value={buttonTextMobile} />
                      </button>
                    </span>
                  }
                </div>
              </div>
            }


          </div>
        </div>
      );
    };
    const productAdvancedPriceFloater = (productBox) => {
      const {
        title, buttonText, packagePrice, packageId,
      } = productBox;
      return (
        <div className='productbox__floater--advanced'>
          <div className="productbox__floater--title">{title}
            <div className="infobox__price">
              <Text value={packagePrice} numberFormat={true} />
              {Object.hasOwnProperty.call(initialValues, 'units') &&
                Object.hasOwnProperty.call(userData, priceUnitLabel) &&
                <span className="productbox__floater--unit">{initialValues.units[userData[priceUnitLabel]]}</span>
              }

              {(!Object.hasOwnProperty.call(initialValues, 'units') ||
                !Object.hasOwnProperty.call(userData, priceUnitLabel)) &&
                <span className="productbox__floater--unit">
                  {priceUnitLabel}
                </span>
              }
            </div>
          </div>
          <div className="productbox__floater--price">
            {buttonText && actions &&
              <button
                type="button"
                className="button button--primary"
                id={id}
                name={id}
                onClick={e =>
                  actionHandler(
                    actions,
                    null,
                    e,
                    dispatch,
                    {
                      ...values,
                      ...userData,
                      chosenPackage: packageId,
                      chosenPackageName: title,
                    },
                    setValues
                  )
                }
              >
                <Text value={buttonText} />
              </button>
            }
          </div>


        </div>
      );
    };
    const labelProps = { actions: labelActions, dispatch, values, setValues };
    return (
      <div className={boxClasses}>
        {advancedCoverage &&
          <div className={advancedClasses}>
            <h4>Tilvalgsdækninger</h4>
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
        }
        {productBoxes.map(productBox => {
          if (productBox.showHide && stepShowHide(false, productBox.showHide, userData, values)) {
            return <div />;
          }
          return renderProductBox(productBox);
        })}
        {(productFooterNote && !advancedCoverage) &&
          <div className="productbox__footernote  grid__col grid__col--12 grid__col--md-12">
            <Label
              id="productFooterNote"
              label={productFooterNote}
              className="label__action"
              {...labelProps}
            />
          </div>
        }
        <MediaQuery maxWidth={768}>
          {!advancedCoverage &&
            <CSSTransition
              in={this.state.floaterVisible}
              timeout={300}
              classNames="scaleInTop"
              unmountOnExit
            >
              <div className={priceFloaterClass}>
                {productBoxes.map(productBox => {
                  return productPriceFloater(productBox);
                })}
              </div>
            </CSSTransition>
          }
        </MediaQuery>

        <MediaQuery maxWidth={768}>
          {advancedCoverage &&
            <CSSTransition
              in={true}
              timeout={300}
              classNames="scaleInTop"
              unmountOnExit
            >
              <div className="">
                {productBoxes.map(productBox => {
                  return productAdvancedPriceFloater(productBox);
                })}
              </div>
            </CSSTransition>
          }
        </MediaQuery>
      </div>
    );
  }
}


export default ProductBox;

ProductBox.defaultProps = {
  body: null,
  label: null,
  actions: [],
  component: 'span',
  productFooterNote: '',
  errors: null,
  subProductLabel: '',
  recommendedText: '',
  labelActions: null,
  coverageText: '',
  activeCoverage: false,
  serviceName: null,
  subProductCoverageCode: null,
  buttonTextMobile: '',
};

ProductBox.propTypes = {
  id: PropTypes.string.isRequired,
  columns: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  actions: PropTypes.array,
  body: PropTypes.string,
  label: PropTypes.string,
  component: PropTypes.string,
  productBoxes: PropTypes.array.isRequired,
  productFooterNote: PropTypes.string,
  userData: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  setValues: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  errors: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  setFormValues: PropTypes.func.isRequired,
  touched: PropTypes.object.isRequired,
  advancedCoverage: PropTypes.bool.isRequired,
  packageIdAdvance: PropTypes.string.isRequired,
  subProductLabel: PropTypes.string,
  recommendedText: PropTypes.string,
  setFieldValue: PropTypes.func.isRequired,
  labelActions: PropTypes.object,
  coverageText: PropTypes.string,
  activeCoverage: PropTypes.bool,
  serviceName: PropTypes.string,
  subProductCoverageCode: PropTypes.string,
  buttonTextMobile: PropTypes.string,
};
