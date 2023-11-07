import { compose } from 'recompose';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CSSTransition from 'react-transition-group/CSSTransition';

// Components
import TextBlock from './TextBlock';
import Text from '../../Global/Text';
import Link from './Link';
import ProductCard from './ProductCard';
import { replaceAll } from '../../../utilities/common';
import { validateNumberBetweenRange } from '../../../utilities/form/formValidators';

const ProductConfirmation = ({
  userData,
  initialValues,
  translations,
  className,
  sectionHeader,
  sectionBody,
  sectionLink,
  sectionCard,
  showPurchaseSection,
}) => {
  const sectionTitle = sectionHeader.title
    ? replaceAll(sectionHeader.title, translations, userData)
    : '';

  const { age } = userData;

  const ageLimit =
    initialValues.ageLimits &&
    initialValues.ageLimits.filter((item) =>
      validateNumberBetweenRange(age, item.min, item.max)
    ).length > 0
      ? initialValues.ageLimits.filter((item) =>
        validateNumberBetweenRange(age, item.min, item.max)
      )[0].value
      : '';

  const productConfirmationClass = classNames('product__confirmation', {
    [`product__confirmation-${className}`]: className,
  });

  let {
    cardTitle,
    cardBody,
    cardLink,
    cardButtonLabel,
    cardImage,
    cardBanner,
    actions,
    showCard,
  } = sectionCard;

  const { cardButtonColumns, isButtonSecondary, cardClassName, cardProps } =
    sectionCard;

  if (sectionCard.cardParams) {
    ({ showCard, actions } = sectionCard.cardParams.filter(
      (items) => items.ageLimit === ageLimit
    )[0] || { showCard, actions });

    ({ cardTitle, cardBody, cardLink, cardButtonLabel, cardImage, cardBanner } =
      sectionCard.cardParams.filter((items) => items.ageLimit === ageLimit)
        .length > 0 &&
      sectionCard.cardParams.filter((items) => items.ageLimit === ageLimit)[0]
        .props
        ? sectionCard.cardParams.filter(
          (items) => items.ageLimit === ageLimit
        )[0].props[0]
        : {
          cardImage,
          cardBanner,
          cardTitle,
          cardBody,
          cardLink,
          cardButtonLabel,
        });
  }
  // get card parameters in case there is a default value for all of the cards
  const getDefaultCardParams = (cardParam, cardParamName) => {
    if (!cardParam && sectionCard[cardParamName]) {
      return sectionCard[cardParamName];
    }
    return cardParam;
  };

  showCard = !(showCard === false || sectionCard.showCard === false);
  const cardParams = {
    cardTitle: getDefaultCardParams(cardTitle, 'cardTitle'),
    cardBody: getDefaultCardParams(cardBody, 'cardBody'),
    cardLink: getDefaultCardParams(cardLink, 'cardLink'),
    cardButtonLabel: getDefaultCardParams(cardButtonLabel, 'cardButtonLabel'),
    cardImage: getDefaultCardParams(cardImage, 'cardImage'),
    cardBanner: getDefaultCardParams(cardBanner, 'cardBanner'),
    actions: getDefaultCardParams(actions, 'actions'),
    cardButtonColumns,
    cardClassName,
    isButtonSecondary,
    showCard,
    showPurchaseSection,
    cardProps,
  };

  const showRecommendationSection = !!(
    showCard &&
    cardParams.cardTitle &&
    cardParams.cardBody &&
    cardParams.cardImage
  );
  return (
    <div className={productConfirmationClass}>
      {showPurchaseSection && (
        <CSSTransition
          in={true}
          appear={true}
          timeout={800}
          classNames="slideInTop"
        >
          <div className="product__confirmation__section__purchase">
            <div className="product__confirmation__section__purchase-header">
              {sectionTitle && (
                <Text
                  value={sectionTitle}
                  className="step__title"
                  component="h3"
                />
              )}
            </div>
            <div className="product__confirmation__section__purchase-body">
              {Object.keys(sectionBody).length > 0 && (
                <TextBlock {...sectionBody} />
              )}
            </div>
            <div className="product__confirmation__section__purchase-link">
              {Object.keys(sectionLink).length > 0 && <Link {...sectionLink} />}
            </div>
          </div>
        </CSSTransition>
      )}
      {showRecommendationSection && <ProductCard {...cardParams} />}
    </div>
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
)(ProductConfirmation);

ProductConfirmation.defaultProps = {
  userData: {},
  className: '',
  sectionHeader: {},
  sectionBody: {},
  sectionLink: {},
  sectionCard: {},
  showPurchaseSection: true,
};

ProductConfirmation.propTypes = {
  userData: PropTypes.object,
  initialValues: PropTypes.object.isRequired,
  className: PropTypes.string,
  translations: PropTypes.object.isRequired,
  sectionHeader: PropTypes.object,
  sectionBody: PropTypes.object,
  sectionLink: PropTypes.object,
  sectionCard: PropTypes.object,
  showPurchaseSection: PropTypes.bool,
};
