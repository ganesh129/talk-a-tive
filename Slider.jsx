import { Component } from 'preact';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SlickSlider from 'react-slick';
import CSSTransition from 'react-transition-group/CSSTransition';
import isEmpty from 'lodash/isEmpty';
import { compose } from 'recompose';
import { connect } from 'react-redux';

// Utils
import { calcColumns, stepShowHide } from '../../../utilities/form/formUtils';
import { checkConditions } from '../../../utilities/package/packageUtils';

// Constants
import { stepComponents } from '../../../constants/Steps';

// Components
import Text from '../../Global/Text';
import Icon from '../../Global/Icon';

class Slider extends Component {
  render() {
    const {
      body,
      columns,
      desc,
      title,
      type,
      variant,
      props,
      userData,
    } = this.props;
    const isHeader = type === 'textHeader';
    const sliderClasses = classNames(
      'slider', {
        [`slider--${type}`]: type,
        [`slider--${variant}`]: variant,
        [`slider--${columns}col`]: columns,
      }
    );

    // Slick settings
    const slickSettings = {
      dots: false,
      arrows: false,
      speed: 1000,
      slidesToShow: 1,
      slidesToScroll: 1,
      draggable: false,
      autoplay: true,
      autoplaySpeed: 4000,
      swipe: false,
    };

    const newsPros = props.filter(prop => {
      if (prop.showHide) {
        if (stepShowHide(prop.hidden ? prop.hidden : false, prop.showHide, userData, {})) {
          return false;
        }
      }
      if (prop.conditions && !checkConditions(prop.conditions, userData)) {
        return false;
      }
      return true;
    });

    const loaderType = props.find((propdata) => propdata.type === 'spinner');
    return (
      <div className={sliderClasses}>

        {title &&
        <Text className="text__title" component={isHeader ? 'h4' : 'h6'} value={title}/>
        }

        {desc &&
        <Text className="text__desc" component="p" value={desc}/>
        }

        {!isEmpty(props) && (
          <div className="slider__content">
            { loaderType ?
              <div className="throbber">
                <div className="throbber__container">
                  <div className="spinner"/>
                  <h5 className="throbber__title">
                    <Text className="text__desc" component="span" value={loaderType.title}/>
                  </h5>
                </div>
              </div> :
              <div>
                <Icon icon="quote"/>

                {/* If there's any props */}
                <SlickSlider {...slickSettings}>

                  {newsPros.map(prop => {
                    const inputParams = {
                      ...prop,
                      'columns': calcColumns(prop),
                    };
                  const InputComponent = stepComponents[prop.type];
                  return (
                    <CSSTransition
                      in={prop.hidden !== true}
                      timeout={300}
                      classNames="slideInLeft"
                      unmountOnExit
                    >
                      <InputComponent {...inputParams}/>
                    </CSSTransition>
                  );
                })}
                </SlickSlider>
              </div>
            }
          </div>
        )}

        {body &&
        <Text className="text__body" component="p" value={body}/>
        }

      </div>
    );
  }
}

export default compose(
  connect(state => {
    const {
      userData,
    } = state;
    return {
      userData,
    };
  })
)(Slider);

Slider.defaultProps = {
  body: null,
  title: null,
  desc: null,
  variant: null,
};

Slider.propTypes = {
  body: PropTypes.string,
  columns: PropTypes.string.isRequired,
  props: PropTypes.array.isRequired,
  desc: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string.isRequired,
  variant: PropTypes.string,
  userData: PropTypes.object.isRequired,
};
