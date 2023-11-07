import { Component } from 'preact';
import React from 'react';
import MediaQuery from 'react-responsive';
import PropTypes from 'prop-types';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import Icon from '../../Global/Icon';
import Text from '../../Global/Text';
import Trans from '../../Global/Translation';
import Coverage from './Coverage';
import { FullPage, Slide } from '../../Fullpage/index';
import { actionHandler, stepShowHide } from '../../../utilities/form/formUtils';


class Recommendation extends Component {
  constructor(props) {
    super(props);
    this.fullPageHook = this.fullPageHook.bind(this);
  }

  componentDidMount() {
    window.onscroll = () => {
      this.isViewportVisibleFooter('#last');
      this.isViewportVisibleHeader('#recommendation-product');
    };
    document.body.classList.add('footer-control-open', 'header-open');
    document.body.classList.remove('footer-control-normal', 'footer-control-close', 'header-close');
  }

  fullPageHook(hook) {
    this.state.hook = hook;
  }

  isViewportVisibleFooter(elem) {
    const recommendation = document.querySelectorAll(elem);
    const recommendationContent = recommendation && recommendation.length > 0 ?
      recommendation[recommendation.length - 1] : null;
    if (recommendationContent) {
      const bounding = recommendationContent.getBoundingClientRect();
      if (
        !(bounding.top >= 0 &&
          bounding.left >= 0 &&
          bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
        )) {
        document.body.classList.add('footer-control-open');
        document.body.classList.remove('footer-control-close', 'footer-control-normal');
      } else {
        document.body.classList.add('footer-control-close');
        document.body.classList.remove('footer-control-normal', 'footer-control-open');
      }
    }
  }

  isViewportVisibleHeader(elem) {
    const recommendation = document.querySelectorAll(elem);
    const recommendationContent = recommendation && recommendation.length > 0 ?
      recommendation[recommendation.length - 1] : null;
    if (recommendationContent) {
      const bounding = recommendationContent.getBoundingClientRect();
      if (
        !(bounding.top >= 0 &&
          bounding.left >= 0 &&
          bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
        )) {
        document.body.classList.add('header-normal');
        document.body.classList.remove('header-open', 'header-close');
        if (document.querySelectorAll('.recommendation-contact')) {
          document.querySelectorAll('.recommendation-contact').forEach(item => {
            item.classList.remove('contact-animate');
            setTimeout(() => { item.classList.add('contact-animate'); }, 200);
          });
        }
      } else {
        document.body.classList.add('header-open');
        document.body.classList.remove('header-normal', 'header-close');
        if (document.querySelectorAll('.recommendation-contact')) {
          document.querySelectorAll('.recommendation-contact').forEach(item => {
            item.classList.remove('contact-animate');
          });
        }
      }
    }
  }
  render() {
    const {
      userData,
      coverageInfo,
      header,
      subHeader,
      hasCarText,
      headerFamilyText,
      headerCityText,
      transitionHeader,
      contactDetails,
      actions,
      dispatch,
      initialValues,
      showIconsInMobile,
    } = this.props;

    const { recommendation, questionaries, hasCar } = userData;
    const { coverageList } = initialValues;
    let recommendedOuterClassName;
    if (Object.keys(recommendation).length === 6 || Object.keys(recommendation).length === 5) {
      recommendedOuterClassName = 'recommendation-content--inner';
    } else if (Object.keys(recommendation).length <= 4) {
      recommendedOuterClassName = 'recommendation-content--inner recommendation-style1';
    }
    const bubbleClicker = (slide) => {
      this.state.hook.scrollToSlide(slide);
    };
    const recommendationDetails = (productName, index) => {
      const recommendationDetail = recommendation[productName];
      const percentage = recommendationDetail.prevalence;
      const percentageVal = percentage.toString();
      const bubbleName = `${productName}-bubble`;
      const pdtClass = `recommendation-products recommendation-products--${index}`;
      return (
        <button className={pdtClass} onClick={() => bubbleClicker(index + 2)} >
          <div className="recommendation-products--content">
            <Trans value={bubbleName} />
            <div>
              <Text value={percentageVal} component="span" />
              <Text value='%' component="span" />
            </div>
          </div>
        </button>
      );
    };

    const recommendationDetailsMobile = (productName, index) => {
      const recommendationDetail = recommendation[productName];
      const percentage = recommendationDetail.prevalence;
      const percentageVal = percentage.toString();
      const bubbleName = `${productName}-bubble`;
      const anchorId = `#product--${index}`;
      const pdtClass = `recommendation-products recommendation-products--${index}`;
      return (
        <AnchorLink className={pdtClass} href={anchorId}>
          <div className="recommendation-products--content">
            <Trans value={bubbleName} />
            <div>
              <Text value={percentageVal} component="span" />
              <Text value='%' component="span" />
            </div>
          </div>
        </AnchorLink>
      );
    };

    const recommendTopCoverage = (coverage) => {
      const percentage = coverage.prevalence;
      const percentageVal = percentage.toString();
      const coverageStyle = {
        width: `${percentage}%`,
        opacity: percentage / 100,
      };
      return (
        <div className="recommendation-coverage--percentageouter">
          <span className="recommendation-coverage--percentage" style={coverageStyle} />
          <Text value={coverageList[coverage.coverage].name} component="span" />
          <span>({percentageVal}%) </span>
        </div>
      );
    };

    const recommendationCoverage = (productName, recommendationInfo, index) => {
      let coverageId;
      if (Object.keys(recommendationInfo).length - 1 === index) {
        coverageId = 'last';
      } else if (index === 0) {
        coverageId = 'first';
      } else {
        coverageId = index;
      }
      const coverageDesc = `${coverageId}Desc`;
      const productDetail = recommendation[productName];
      const iconName = coverageInfo[productName].icon;
      const fromIcon = coverageInfo[productName].iconFrom;
      let iconNameDisplay;
      if (fromIcon === 'questionaries') {
        const iconDisplay = questionaries && questionaries.filter(item => {
          return item.id === iconName;
        });
        iconNameDisplay = iconDisplay && iconDisplay[0].value;
      } else {
        iconNameDisplay = userData[iconName];
      }
      return (
        <Slide>
          <div className="recommendation-content" id={coverageId}>
            <div className="recommendation-coverage">
              <div className="recommendation-coverage--icon">
                {iconNameDisplay &&
                  <Icon icon={iconNameDisplay.replace(/[ ,]/g, '')} fill="black" />
                }
              </div>
              <div className="recommendation-coverage--content">
                <Trans value={productName} className="recommendation-coverage--name" />
                <div className="recommendation-coverage--title" >
                  <Text value={coverageInfo[productName].title} component="span" />
                  <Coverage variant="recommendationTitle" coverageCode={productDetail.coverages[0].coverage} product={productDetail.product} />
                </div>
                {productDetail.coverages &&
                  <div className="recommendation-coverage--desc" id={coverageDesc}>
                    <Coverage variant="recommendation" coverageCode={productDetail.coverages[0].coverage} product={productDetail.product} />
                  </div>
                }
                {productDetail.coverages &&
                  <Text value={coverageInfo[productName].recommendationDesc} component="div" className="recommendation-coverage--info" />
                }
                {coverageInfo[productName] &&
                  coverageInfo[productName].type &&
                  coverageInfo[productName].type === 'text' &&
                  <div>
                    <Text value={coverageInfo[productName].additionalInfoTitle} component="h3" />
                    <Text value={coverageInfo[productName].additionalInfoDesc} component="div" className="recommendation-coverage--additional" />
                  </div>
                }
                {coverageInfo[productName] &&
                  coverageInfo[productName].type &&
                  coverageInfo[productName].type === 'coverage' &&
                  <div className="recommendation-coverage--topouter">
                    <Text value={coverageInfo[productName].additionalInfoTitle} component="h3" />
                    {productDetail.coverages.map(coverage => {
                      return recommendTopCoverage(coverage);
                    })}
                  </div>
                }
                {coverageInfo[productName] &&
                  coverageInfo[productName].type &&
                  coverageInfo[productName].type === 'graphic' &&
                  <div className="recommendation-graphic">
                    <Text value={coverageInfo[productName].graphicTitle} component="h3" />
                    {coverageInfo[productName].graphicDisplay.map(item => {
                      return (
                        <div className="recommendation-coverage--geography">
                          <Text value={item.percentage} component="div" className="recommendation-coverage--geography-perc" />
                          <Icon icon={item.icon} fill="black" />
                          <Text value={item.text} component="div" className="recommendation-coverage--geography-text" />
                        </div>
                      );
                    })}
                  </div>
                }
              </div>
            </div>
            <div className="recommendation-contact">
              <Text value={contactDetails.title} component="div" className="recommendation-contact--text" />
              <button
                type="button"
                className="button button--primary"
                {...(actions ? { 'onClick': e => actionHandler(actions, null, e, dispatch) } : {})}
              >
                <Text value={contactDetails.buttonText} />
              </button>
            </div>
          </div>

        </Slide>
      );
    };

    const recommendationCoverageMobile = (productName, recommendationInfo, index) => {
      const productDetail = recommendation[productName];
      const contentId = `product--${index}`;
      let iconNameDisplay;
      if (showIconsInMobile) {
        const iconName = coverageInfo[productName].icon;
        const fromIcon = coverageInfo[productName].iconFrom;

        if (fromIcon === 'questionaries') {
          const iconDisplay = questionaries && questionaries.filter(item => {
            return item.id === iconName;
          });
          iconNameDisplay = iconDisplay && iconDisplay[0].value;
        } else {
          iconNameDisplay = userData[iconName];
        }
      }
      return (
        <div className="recommendation-content" id={contentId}>
          <div className="recommendation-coverage">
            <div className="recommendation-coverage--icon">
              {iconNameDisplay &&
                <Icon icon={iconNameDisplay.replace(/[ ,]/g, '')} fill="black"/>
              }
            </div>
            <div className="recommendation-coverage--content">
              <Trans value={productName} className="recommendation-coverage--name" />
              <div className="recommendation-coverage--title" >
                <Text value={coverageInfo[productName].title} component="span" />
                <Coverage variant="recommendationTitle" coverageCode={productDetail.coverages[0].coverage} product={productDetail.product} />
              </div>
              {productDetail.coverages &&
                <div className="recommendation-coverage--desc">
                  <Coverage variant="recommendation" coverageCode={productDetail.coverages[0].coverage} product={productDetail.product} />
                </div>
              }
              {productDetail.coverages &&
                <Text value={coverageInfo[productName].recommendationDesc} component="div" className="recommendation-coverage--info" />
              }
              {coverageInfo[productName] &&
                coverageInfo[productName].type &&
                coverageInfo[productName].type === 'text' &&
                <div>
                  <Text value={coverageInfo[productName].additionalInfoTitle} component="h3" />
                  <Text value={coverageInfo[productName].additionalInfoDesc} component="div" className="recommendation-coverage--additional" />
                </div>
              }
              {coverageInfo[productName] &&
                coverageInfo[productName].type &&
                coverageInfo[productName].type === 'coverage' &&
                <div className="recommendation-coverage--topouter">
                  <Text value={coverageInfo[productName].additionalInfoTitle} component="h3" />
                  {productDetail.coverages.map(coverage => {
                    return recommendTopCoverage(coverage);
                  })}
                </div>
              }
              {coverageInfo[productName] &&
                coverageInfo[productName].type &&
                coverageInfo[productName].type === 'graphic' &&
                <div className="recommendation-graphic">
                  <Text value={coverageInfo[productName].graphicTitle} component="h3" />
                  {coverageInfo[productName].graphicDisplay.map(item => {
                    return (
                      <div className="recommendation-coverage--geography">
                        <Text value={item.percentage} component="div" className="recommendation-coverage--geography-perc" />
                        <Icon icon={item.icon} fill="black" />
                        <Text value={item.text} component="div" className="recommendation-coverage--geography-text" />
                      </div>
                    );
                  })}
                </div>
              }
            </div>
          </div>
          <div className="recommendation-contact">
            <Text value={contactDetails.title} component="div" />
            <button
              type="button"
              className="button button--primary"
              {...(actions ? { 'onClick': e => actionHandler(actions, null, e, dispatch) } : {})}
            >
              <Text value={contactDetails.buttonText} />
            </button>
          </div>
        </div>
      );
    };

    return (
      <article className="recommendation-outer">
        <MediaQuery minWidth={1200}>
          <FullPage controls hook={this.fullPageHook}>
            <Slide>
              <div className="recommendation-content recommendation-content--product" id="recommendation-product">
                <h2 className="recommendation-header">
                  <Text value={header} component="span" className="recommendation-header--transform" />
                  <Trans value={userData[headerFamilyText]} component="strong" />
                  <Text value={headerCityText} component="span" />
                </h2>
                <Text value={subHeader} component="h3" className="recommendation-subheader" />
                <div className={recommendedOuterClassName}>
                  {recommendation &&
                    <div>
                      {Object.keys(recommendation).map((recommendationDetail, index) => {
                        return recommendationDetails(recommendationDetail, index);
                      })}
                    </div>
                  }
                </div>
              </div>
            </Slide>
            <Slide>
              <div className="recommendation-compare" id="compare">
                <Text value={transitionHeader} component="h2" />
              </div>
            </Slide>
            {recommendation && Object.keys(recommendation).sort((a, b) => {
              return b.prevalence - a.prevalence;
            }).map((recommendationDetail, index) => {
              return recommendationCoverage(recommendationDetail, recommendation, index);
            })}
          </FullPage>
        </MediaQuery>
        <MediaQuery maxWidth={1199}>
          <div>
            <div className="recommendation-content recommendation-content--product">
              <h1 className="recommendation-header" >
                <Text value={header} component="span" className="recommendation-header--transform" />
                <Trans value={userData[headerFamilyText]} component="strong" />
                <Text value={headerCityText} component="span" />
                {hasCar === 'true' &&
                  <Text value={hasCarText} component="span" />
                }
              </h1>
              <Text value={subHeader} component="h2" className="recommendation-subheader" />
              <div className={recommendedOuterClassName}>
                {recommendation &&
                  <div>
                    {Object.keys(recommendation).map((recommendationDetail, index) => {
                      return recommendationDetailsMobile(recommendationDetail, index);
                    })}
                  </div>
                }
              </div>
            </div>
            {recommendation && Object.keys(recommendation).sort((a, b) => {
              return b.prevalence - a.prevalence;
            }).map((recommendationDetail, index) => {
              return recommendationCoverageMobile(recommendationDetail, recommendation, index);
            })}
          </div>
        </MediaQuery>
      </article>
    );
  }
}

export default Recommendation;

Recommendation.defaultProps = {
  coverageInfo: null,
  contactDetails: null,
  actions: [],
  header: '',
  subHeader: '',
  hasCarText: '',
  headerFamilyText: '',
  headerCityText: '',
  transitionHeader: '',
  showIconsInMobile: false,
};

Recommendation.propTypes = {
  userData: PropTypes.object.isRequired,
  title: PropTypes.object.isRequired,
  coverageInfo: PropTypes.array,
  contactDetails: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  actions: PropTypes.array,
  header: PropTypes.string,
  subHeader: PropTypes.string,
  hasCarText: PropTypes.string,
  headerFamilyText: PropTypes.string,
  headerCityText: PropTypes.string,
  initialValues: PropTypes.object.isRequired,
  transitionHeader: '',
  showIconsInMobile: PropTypes.bool,
};
