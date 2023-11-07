import PropTypes from 'prop-types';
import classNames from 'classnames';

// Utils
import { actionHandler, stepShowHide } from '../../../utilities/form/formUtils';

// Components
import Text from '../../Global/Text';
import Icon from '../../Global/Icon';
import { stepComponents } from '../../../constants/Steps';

const Hero = ({
  title,
  desc,
  label,
  columns,
  body,
  buttonText,
  subType,
  actions,
  dispatch,
  variant,
  price,
  icon,
  iconClass,
  bodyShowHide,
  userData,
  afterButtonText,
  afterButtonTextMore,
  altLabel,
  setFieldValue,
  setValues,
  initialValues,
  values,
  heroType,
  innerClass,
}) => {
  // The Button should not be rendered for the following variants
  const hideButton = [
    'subPrice',
  ];
  const heroClass = classNames(
    'hero', {
      [`hero--${variant}`]: variant,
      [`hero--${columns}col`]: columns,
      [`hero--${heroType}`]: heroType,
    }
  );
  const innerClasses = classNames(
    'inner hero__inner', {
      [`${innerClass}`]: innerClass,
    }
  );
  const bodyShow = !stepShowHide(false, bodyShowHide, userData, {});
  const getLinkReadMore = function (props) {
    if (!props) {
      return '';
    }
    const ButtonComponent = stepComponents.button;
    const buttonParams = {
      ...props,
      dispatch,
    };
    return <ButtonComponent {...buttonParams} />;
  };

  return (
    <article className={heroClass}>
      <div className="hero__wrapper">
        <div className={innerClasses}>

          {(title || desc || body) &&
          <div className="hero__left">
            {title &&
            <Text value={title} className="hero__title" component="h2"/>
            }
            {desc &&
            <Text value={desc} className="hero__description" component="h6"/>
            }
            {bodyShow && body &&
            <Text value={body} className="price__voucher" component="p" icon={icon} iconClass={iconClass}/>
            }
          </div>
          }

          <div className="hero__right">
            {/* Buttons */}

            {(label || price || altLabel) &&
            <h3 className="hero__usp">
              {price &&
              <Text value="$[price]" className="usp__prefix" numberFormat={true}/>
              }
              {label &&
              <Text value={label} className="usp__suffix" values={values}/>
              }
              {altLabel &&
              (altLabel.length > 0 &&
                altLabel.map(prop => {
                  const inputParams = {
                    ...prop,
                    dispatch,
                    userData,
                    setFieldValue,
                    setValues,
                    initialValues,
                  };
                  const InputComponent = stepComponents[prop.type];
                  return (<InputComponent {...inputParams}/>);
                })
              )
              }
            </h3>
            }

            {!hideButton.includes(variant) && buttonText &&
            <button
              type={subType}
              className="button button--primary"
              {...(actions ? { 'onClick': e => actionHandler(actions, null, e, dispatch, values, setValues) } : {})}
            >
              <span>
                {buttonText}
                <Icon icon="chevronLeft" fill="red"/>
              </span>
            </button>
            }

            {afterButtonText &&
              <Text value={afterButtonText} more={getLinkReadMore(afterButtonTextMore)}/>
            }
          </div>
        </div>
      </div>
    </article>
  );
};

export default Hero;

Hero.defaultProps = {
  label: null,
  body: null,
  variant: null,
  title: null,
  desc: null,
  subType: 'button',
  actions: [],
  icon: null,
  iconClass: null,
  bodyShowHide: {},
  afterButtonText: null,
  afterButtonTextMore: null,
  altLabel: null,
  heroType: null,
  innerClass: 'inner--large',
};

Hero.propTypes = {
  columns: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  price: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  title: PropTypes.string,
  subType: PropTypes.string,
  desc: PropTypes.string,
  actions: PropTypes.array,
  label: PropTypes.string,
  altLabel: PropTypes.array,
  variant: PropTypes.string,
  body: PropTypes.string,
  icon: PropTypes.string,
  iconClass: PropTypes.string,
  bodyShowHide: PropTypes.object,
  userData: PropTypes.object.isRequired,
  afterButtonText: PropTypes.string,
  afterButtonTextMore: PropTypes.object,
  initialValues: PropTypes.object.isRequired,
  setValues: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  setFormValues: PropTypes.func.isRequired,
  touched: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  heroType: PropTypes.string,
  innerClass: PropTypes.string,
};
