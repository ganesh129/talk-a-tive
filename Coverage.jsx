import { Component } from 'preact';
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import CSSTransition from 'react-transition-group/CSSTransition';

// Constants
import { stepComponents } from '../../../constants/Steps';
import Icon from '../../Global/Icon';
import { getCoverageDescription, coverageHasLong } from '../../../utilities/coverage/descriptionUtils';
import { getCoverageTitle } from '../../../utilities/coverage/titleUtils';
import { getCoverageRecommendationTitle } from '../../../utilities/coverage/recommendationTitleUtils';

class Coverage extends Component {
  constructor(props) {
    super(props);
    const { showDescription } = this.props;

    this.state = {
      showDesc: showDescription,
      variantClass: '',
    };
  }

  render() {
    const {
      variant,
      coverageList,
      coverageMerge,
      coverageVariation,
      coverageCode,
      userData,
      name,
      isValid,
      errors,
      touched,
      setValues,
      values,
      dispatch,
      onChange,
      onBlur,
      showTitle,
      advancedCoverageAction,
      overrideTitle,
      showDescription,
      callBack,
      product,
    } = this.props;

    let showHide = true;
    let { showDesc, variantClass } = this.state;

    const getCompactButton = function (labelTitle, listProps) {
      const ButtonComponent = stepComponents.button;
      const buttonParams = {
        id: coverageCode,
        type: 'button',
        variant: 'text',
        label: labelTitle,
        actions: [
          {
            actionType: 'changeUserData',
            props: {
              fields: [
                {
                  field: 'chosenCoverageCode',
                  value: coverageCode,
                },
              ],
            },
          },
          {
            actionType: 'modal',
            props: {
              name: 'coverageDetails',
            },
          },
        ],
        isValid,
        errors,
        touched,
        setValues,
        values,
        dispatch,
        onChange,
        onBlur,
      };
      if (listProps) {
        return {
          button: ButtonComponent,
          params: buttonParams,
        };
      }
      return <ButtonComponent {...buttonParams} />;
    };

    const getLinkReadMore = function (linkTitle, listProps) {
      const ButtonComponent = stepComponents.button;
      const buttonParams = {
        id: coverageCode,
        type: 'button',
        variant: 'text',
        label: linkTitle,
        actions: [
          {
            actionType: 'modal',
            props: {
              modalType: listProps ? 'info' : 'coverage',
              props: [{
                type: 'coverage',
                variant: 'modal',
                coverageCode,
              }],
            },
          },
        ],
        isValid,
        errors,
        touched,
        setValues,
        values,
        dispatch,
        onChange,
        onBlur,
      };
      if (listProps) {
        return {
          button: ButtonComponent,
          params: buttonParams,
        };
      }
      return <ButtonComponent {...buttonParams} />;
    };
    let hasLong = false;
    let title = '';
    let desc = '';
    const newCoverageCode = coverageCode || userData.chosenCoverageCode;
    if (!coverageList[newCoverageCode] &&
      (!coverageMerge || !coverageMerge[newCoverageCode])) {
        console.warn(`Can't find coverage code: ${newCoverageCode}`); // eslint-disable-line
      return '';
    }

    title = overrideTitle ||
      getCoverageTitle(coverageVariation,
        coverageList,
        coverageMerge,
        variant,
        newCoverageCode,
        showTitle);

    if (callBack) {
      showHide = callBack(title.length, newCoverageCode);
    }

    if (showDescription) {
      desc = getCoverageDescription(coverageVariation,
        coverageList,
        coverageMerge,
        variant,
        newCoverageCode,
        userData,
        product);
      hasLong = coverageHasLong(coverageList, coverageVariation, coverageMerge, newCoverageCode);
    }

    let InputComponent = null;
    let params = null;
    switch (variant) {
      case 'modal':
        InputComponent = stepComponents.textBlock;
        params = {
          title,
          desc,
          titleClass: 'modal__title--coverage',
          dispatch,
        };
        break;

      case 'text':
        InputComponent = stepComponents.textBlock;
        params = {
          title,
          type: 'textBlock',
          desc,
          isValid,
          errors,
          touched,
          setValues,
          values,
          dispatch,
          onChange,
          onBlur,
        };
        if (hasLong) {
          params.descMore = getLinkReadMore('Læs mere');
        }
        break;

      case 'longOrShort':
        InputComponent = stepComponents.textBlock;
        params = {
          title,
          descClass: 'text__desc__coverage',
          type: 'textBlock',
          desc,
          isValid,
          errors,
          touched,
          setValues,
          values,
          dispatch,
          onChange,
          onBlur,
        };
        break;

      case 'name':
        InputComponent = stepComponents.textBlock;
        params = {
          title,
          type: 'textBlock',
        };
        break;

      case 'nameText':
        InputComponent = stepComponents.textBlock;
        params = {
          desc: title,
          type: 'textBlock',
        };
        break;

      case 'nameSimple':
        InputComponent = stepComponents.textSimple;
        params = {
          value: title,
          component: 'span',
          type: 'textSimple',
        };
        break;

      case 'listProps': {
        const readMore = getLinkReadMore(title, true);
        InputComponent = readMore.button;
        ({ params } = readMore);
        break;
      }

      case 'compactButton': {
        const readMore = getCompactButton(title, true);
        InputComponent = readMore.button;
        ({ params } = readMore);
        break;
      }

      case 'accordion': {
        // TODO: Handle CoverageMerge in the future.
        let description = desc;
        if (showDesc) {
          description = null;
        }
        InputComponent = stepComponents.checkbox;
        params = {
          id: newCoverageCode,
          type: 'checkbox',
          label: title,
          isValid,
          errors,
          touched,
          setValues,
          values,
          dispatch,
          onChange,
          onBlur,
          options: [
            {
              label: title,
              id: newCoverageCode,
              name,
              desc: description,
              actions: advancedCoverageAction,
            },
          ],
        };
        if (hasLong) {
          params.options[0].descMore = getLinkReadMore('Læs mere');
        }
        break;
      }

      case 'checkbox':
        // TODO: Handle CoverageMerge in the future.
        InputComponent = stepComponents.checkbox;
        params = {
          id: newCoverageCode,
          type: 'checkbox',
          label: title,
          isValid,
          errors,
          touched,
          setValues,
          values,
          dispatch,
          onChange,
          onBlur,
          options: [
            {
              label: title,
              id: newCoverageCode,
              name,
              desc,
              actions: advancedCoverageAction,
            },
          ],
        };
        if (hasLong) {
          params.options[0].descMore = getLinkReadMore('Læs mere');
        }
        break;

      case 'recommendation':
        InputComponent = stepComponents.textBlock;
        params = {
          desc,
          type: 'textBlock',
        };
        break;
      case 'recommendationTitle':
        title = getCoverageRecommendationTitle(coverageVariation,
          coverageList,
          coverageMerge,
          newCoverageCode,
          userData,
          product
        );
        InputComponent = stepComponents.textSimple;
        params = {
          value: title,
          component: 'span',
          className: 'recommendation-trans',
          type: 'textSimple',
        };
        break;

      default:
        console.warning('Unknown variant "' + variant + '" for coverage code "' + newCoverageCode + '"'); // eslint-disable-line
    }

    const showHideDescription = () => {
      showDesc = !showDesc;
      variantClass = '';
      if (!showDesc) {
        variantClass = 'accordion--active';
      }

      this.setState({
        showDesc,
        variantClass,
      });
    };

    return (
      <CSSTransition
        in={showHide}
        timeout={300}
        classNames="fadeIn"
        unmountOnExit
      >
        <span className={variantClass}>
          <InputComponent {...params} />
          {variant === 'accordion' &&
          <button type="button" className="accordion__title" onClick={() => showHideDescription()}>
            <span>
              <Icon icon="chevronDown" fill="red"/>
            </span>
          </button>
          }
        </span>
      </CSSTransition>
    );
  }
}

export default compose(
  connect(state => {
    const {
      section: {
        packageData: {
          initialValues: {
            coverageList,
            coverageMerge,
            coverageVariation,
          },
        },
      },
      userData,
    } = state;
    return {
      coverageList,
      coverageMerge,
      coverageVariation,
      userData,
    };
  })
)(Coverage);

Coverage.defaultProps = {
  styling: null,
  name: null,
  showDescription: true,
  showTitle: true,
  advancedCoverageAction: [],
  overrideTitle: null,
  callBack: null,
  product: null,
};

Coverage.propTypes = {
  coverageList: PropTypes.object.isRequired,
  coverageMerge: PropTypes.object,
  coverageVariation: PropTypes.object,
  userData: PropTypes.object.isRequired,
  variant: PropTypes.string.isRequired,
  coverageCode: PropTypes.string.isRequired,
  styling: PropTypes.string,
  name: PropTypes.string,
  isValid: PropTypes.bool,
  errors: PropTypes.object,
  touched: PropTypes.object,
  setValues: PropTypes.func,
  values: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  showDescription: PropTypes.bool,
  showTitle: PropTypes.bool,
  advancedCoverageAction: PropTypes.array,
  overrideTitle: PropTypes.string,
  callBack: PropTypes.func,
  product: PropTypes.string,
};
