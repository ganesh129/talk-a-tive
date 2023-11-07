import { compose } from 'recompose';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CSSTransition from 'react-transition-group/CSSTransition';

// Components
import Text from '../../Global/Text';
import Button from './Button';
import { replaceAll } from '../../../utilities/common';
import Link from './Link';

// Constants
import { stepComponents } from '../../../constants/Steps';

const ProductCard = ({
  userData,
  initialValues,
  dispatch,
  values,
  setValues,
  translations,
  cardImage,
  cardBanner,
  cardTitle,
  cardBody,
  cardLink,
  cardButtonLabel,
  cardButtonColumns,
  cardClassName,
  isButtonSecondary,
  actions,
  showCard,
  showPurchaseSection,
  cardProps,
}) => {
  const cardImagePath = replaceAll(cardImage, translations, userData);
  const cardClass = classNames('product__card', {
    [`product__card-${cardClassName}`]: cardClassName,
  });

  const buttonType = isButtonSecondary ? 'secondary' : 'primary';
  const buttonClass = classNames(
    `product__card__section__container-button--${buttonType}`
  );
  const buttonWrapperClass = classNames({
    'product__card__section__container-button': !isButtonSecondary,
  });

  const linkClass = classNames(
    `product__card__section__container-link--${buttonType}`,
    'button',
    `button--${buttonType}`
  );

  const linkParams = {
    link: cardLink,
    className: linkClass,
    label: cardButtonLabel,
    columns: cardButtonColumns,
  };
  const buttonParams = {
    id: 'product__card__button',
    additionalClassName: buttonClass,
    label: cardButtonLabel,
    columns: cardButtonColumns,
    actions,
    dispatch,
    setValues,
    values,
  };

  const formParams = {
    setValues,
    values,
    dispatch,
    userData,
  };
  if (!showCard) {
    return null;
  }
  return (
    <CSSTransition
      in={true}
      appear={true}
      timeout={showPurchaseSection ? 1900 : 800}
      classNames="slideInTop"
    >
      <div className="product__confirmation__section__recommendation">
        <div className={cardClass}>
          <div className="product__card__section__picture">
            {cardImagePath && (
              <div className="product__card__section__picture-image">
                <img src={cardImagePath} alt="product" />
              </div>
            )}
            {cardBanner && (
              <Text
                value={cardBanner}
                className="product__card__section__picture-banner"
                component="p"
              />
            )}
          </div>
          <div className="product__card__section__container">
            {cardTitle && (
              <Text
                className="product__card__section__container-title"
                component="h5"
                value={cardTitle}
              />
            )}
            {cardBody && (
              <Text
                className="product__card__section__container-body"
                component="p"
                value={cardBody}
              />
            )}
            {cardLink && (
              <div className="product__card__section__container-link">
                <Link {...linkParams} />
              </div>
            )}
            {actions.length > 0 && !cardLink && (
              <Button {...buttonParams} className={buttonWrapperClass} />
            )}
            {cardProps &&
              cardProps.map((list) => {
                const inputParams = {
                  ...list,
                  ...formParams,
                  userData,
                  initialValues,
                };
                const InputComponent = stepComponents[list.type];
                return (
                  <div className="product__card__section__container--list-item">
                    <InputComponent {...inputParams} />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default compose(
  connect((state) => {
    const {
      section: {
        packageData: { translations },
      },
    } = state;
    return {
      translations,
    };
  })
)(ProductCard);

ProductCard.defaultProps = {
  userData: null,
  cardImage: '',
  cardBanner: '',
  cardTitle: '',
  cardBody: '',
  cardLink: '',
  cardButtonLabel: 'card-product-label-holder',
  cardButtonColumns: '12',
  cardClassName: '',
  isButtonSecondary: false,
  showCard: true,
  values: {},
  setValues: Function.prototype,
  actions: [],
  cardProps: [],
  showPurchaseSection: false,
};

ProductCard.propTypes = {
  userData: PropTypes.object,
  translations: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  values: PropTypes.object,
  setValues: PropTypes.func,
  cardImage: PropTypes.string,
  cardBanner: PropTypes.string,
  cardTitle: PropTypes.string,
  cardBody: PropTypes.string,
  cardLink: PropTypes.string,
  cardButtonLabel: PropTypes.string,
  cardButtonColumns: PropTypes.string,
  cardClassName: PropTypes.string,
  showCard: PropTypes.bool,
  isButtonSecondary: PropTypes.bool,
  actions: PropTypes.array,
  initialValues: PropTypes.object.isRequired,
  cardProps: PropTypes.array,
  showPurchaseSection: PropTypes.bool,
};