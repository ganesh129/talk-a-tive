import { Component } from 'preact';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CSSTransition from 'react-transition-group/CSSTransition';

// Components
import Text from '../../Global/Text';
import Icon from '../../Global/Icon';
import Coverage from './Coverage';
import { stepComponents } from '../../../constants/Steps';
import { checkConditions, validateCoverageCode } from '../../../utilities/package/packageUtils';
import { stepShowHide } from '../../../utilities/form/formUtils';
import { replaceData, clone, getCoverageCodesAndMergeCodes } from '../../../utilities/common';


class AccordionAdvanced extends Component {
  constructor(props) {
    super(props);
    this.setActive = this.setActive.bind(this);
    this.setHeight = this.setHeight.bind(this);
    this.setScrollPos = this.setScrollPos.bind(this);
    this.state = {
      active: false,
    };
  }

  setActive() {
    const { active } = this.state;
    this.setState({
      active: !active,
    });
  }

  setHeight() {
    const wrapperHeight = this.wrapper.offsetHeight;
    const padding = 40;
    const heightInPx = height => `${height}px`;
    const wrapperStyle = this.wrapper.style;

    // If it's already open, then close
    if (wrapperStyle.maxHeight === heightInPx(wrapperHeight) || wrapperStyle.maxHeight === 'none') {
      setTimeout(() => {
        wrapperStyle.maxHeight = '0px';
        wrapperStyle.maxHeight = heightInPx(wrapperHeight);
      }, 1);
    }

    // If it's closed, then open
    if (wrapperStyle.maxHeight !== heightInPx(wrapperHeight) &&
      wrapperStyle.maxHeight !== 'none' &&
      wrapperStyle.maxHeight !== '0px') {
      wrapperStyle.maxHeight = '0px';

      // We need the timeout to make sure the next function is executed after
      // the 0 is set
      setTimeout(() => {
        wrapperStyle.maxHeight = heightInPx(wrapperHeight + padding);
      }, 1);
    }
  }

  setScrollPos() {
    // When done, scroll to bottom of accordion
    let modalContainer = document.querySelector('.accordion');
    const allNodes = document.getElementsByTagName(import.meta.env.VITE_WRAPPER_TAG);
    if (allNodes[0].shadowRoot) {
      modalContainer = allNodes[0].shadowRoot.querySelector('.accordion');
    }
    modalContainer.scroll({
      top: modalContainer.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
  }

  render() {
    const {
      columns,
      title,
      type,
      variant,
      heading,
      contentInfo,
      userData,
      initialValues,
      dispatch,
      handleSubmit,
      onBlur,
      onChange,
      setValues,
      touched,
      values,
      setFormValues,
      errors,
      className,
      showPriceInfo,
      setFieldValue,
      addOnClass,
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
    };
    const { active } = this.state;
    const accordionClasses = classNames(
      'accordion', {
        'accordion--active': active,
        [`accordion--${type}`]: type,
        [`accordion--${variant}`]: variant,
        [`accordion--${columns}col`]: columns,
        [`accordion--advanced--${addOnClass}`]: addOnClass,
      }
    );

    const events = {
      'onEntering': this.setHeight,
      'onExiting': this.setHeight,
      'onEntered': this.setScrollPos,
    };
    const accordionClassOuter = `accordion__outer ${className}`;
    const { coverageList, priceInfo, packages, coverageMerge } = initialValues;

    const renderContentInfo = content => (
      <div>
        {content.map(info => {
          if (!info) {
            return '';
          }
          const gridClasses = `col col--${info.columns} ${info.className}`;
          // We clone the list so the original list don't gets updated.
          const tmpCoverageList = clone(coverageList);
          if (info.showCoverageInfo && (info.useCoverageCodes || info.usePackageId)) {
            let list;
            if (info.useCoverageCodes) {
              list = replaceData(info.useCoverageCodes, userData, false, false, false);
            }
            if (info.usePackageId) {
              const packList = packages.filter(pack => pack.id === userData.packageId);
              list = packList[0].totalCoverages;
            }
            Object.keys(coverageList)
              .forEach((key) => {
                if (list.indexOf(key) === -1) {
                  delete tmpCoverageList[key];
                }
              });
          }
          const [newCoverageList, coverageCodesMerge] =
            getCoverageCodesAndMergeCodes(
              tmpCoverageList,
              coverageMerge,
              userData
            );

          if (info.showHide && stepShowHide(false, info.showHide, userData, {})) {
            return <div/>;
          }

          return (
            <div className={gridClasses}>
              {info.title &&
              <Text
                className="accordion__desc"
                component="h5"
                value={info.title}
              />
              }
              {info.desc &&
              <Text
                className="accordion__text"
                component="p"
                value={info.desc}
              />
              }
              {info.showCoverageInfo &&
              <div className="column-layout">
                {coverageCodesMerge && Object.keys(coverageCodesMerge)
                  .map(coverageCode => {
                    return (
                      <div className="coverageInfo-outer">
                        <Coverage variant="text" coverageCode={coverageCode}/>
                      </div>);
                  })
                }
                {Object.keys(newCoverageList)
                  .filter(
                    coverageCode =>
                      !newCoverageList[coverageCode].hideInAccordion &&
                      validateCoverageCode({ code: coverageCode }, initialValues, userData))
                  .map(coverageCode => {
                    return (
                      <div className="coverageInfo-outer">
                        <Coverage variant="text" coverageCode={coverageCode}/>
                      </div>);
                  })
                }
              </div>
              }
              {(info.list) &&
              <ul>
                {info.list &&
                info.list.map(listItem => <Text component="li" value={listItem}/>)
                }
              </ul>
              }
              {info.listProps &&
              (info.listProps.map(listProp => {
                  const { hidden, showHide } = listProp;
                  const inputParams = {
                    ...listProp,
                    ...formParams,
                    userData,
                    dispatch,
                    initialValues,
                    hidden: (stepShowHide(hidden, showHide, userData, {})),
                  };
                  if (listProp.conditions && !checkConditions(listProp.conditions, userData)) {
                    return '';
                  }
                  const InputComponent = stepComponents[listProp.type];
                  if (InputComponent) {
                    return (
                      <div className="list-item">
                        <InputComponent {...inputParams}/>
                      </div>
                    );
                  }
                })
              )
              }
              {info.more &&
              <Text
                className="accordion__text"
                component="p"
                value={info.more}
              />
              }
            </div>
          );
        })
        }
      </div>
    );

    return (
      <div className={accordionClassOuter}>
        {heading &&
        <Text value={heading} component="h5"/>
        }
        <div>
          <div className={accordionClasses}>
            <button
              type="button"
              className="accordion__title"
              onClick={this.setActive}
            >
              <span>
                <Text value={title}/>
                <Icon icon="chevronDown" fill="red"/>
              </span>
            </button>

            <CSSTransition
              in={active}
              timeout={300}
              classNames="scaleInTop"
              unmountOnExit
              {...events}
            >
              <div
                className="accordion__wrapper rich-text"
                ref={wrapper => this.wrapper = wrapper}
              >
                {contentInfo &&
                renderContentInfo(contentInfo)
                }
                {showPriceInfo && priceInfo &&
                renderContentInfo(priceInfo)
                }
              </div>
            </CSSTransition>

          </div>
        </div>
      </div>
    );
  }
}

export default AccordionAdvanced;

AccordionAdvanced.defaultProps = {
  body: null,
  desc: null,
  text: null,
  variant: null,
  heading: null,
  contentInfo: null,
  userData: null,
  actionProps: null,
  errors: null,
  isValid: null,
  requiredData: {},
  submitButton: true,
  actionVariant: 'greyBox',
  className: '',
  showCoverageInfo: false,
  showPriceInfo: false,
  useCoverageCodes: null,
  usePackageId: false,
  addOnClass: '',
};

AccordionAdvanced.propTypes = {
  body: PropTypes.string,
  columns: PropTypes.string.isRequired,
  desc: PropTypes.string,
  text: PropTypes.string,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  variant: PropTypes.string,
  heading: PropTypes.string,
  contentInfo: PropTypes.array,
  dispatch: PropTypes.func.isRequired,
  userData: PropTypes.object,
  initialValues: PropTypes.object.isRequired,
  submitText: PropTypes.string,
  actionProps: PropTypes.array,
  actionVariant: PropTypes.string,
  errors: PropTypes.object,
  formActions: PropTypes.array,
  handleSubmit: PropTypes.func.isRequired,
  isValid: PropTypes.bool,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  requiredData: PropTypes.object,
  setFormValues: PropTypes.func.isRequired,
  setValues: PropTypes.func.isRequired,
  submitButton: PropTypes.bool,
  touched: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  className: PropTypes.string,
  showCoverageInfo: PropTypes.bool,
  showPriceInfo: PropTypes.bool,
  setFieldValue: PropTypes.func.isRequired,
  useCoverageCodes: PropTypes.array,
  usePackageId: PropTypes.bool,
  addOnClass: PropTypes.string,
};
