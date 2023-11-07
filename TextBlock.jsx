import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isValidElement } from 'react';

// Components
import Text from '../../Global/Text';
import { stepComponents } from '../../../constants/Steps';
import { stepHasRequiredData, stepShowHide } from '../../../utilities/form/formUtils';


const TextBlock = ({
  columns,
  body,
  type,
  list,
  title,
  desc,
  descMore,
  descClass,
  variant,
  bodyClass,
  titleClass,
  listProps,
  dispatch,
  userData,
  hidden,
  messages,
  numberFormat,
  currencyFormat,
  setValues,
  className,
  actionVariant,
  icon,
  id,
}) => {
  if (hidden) {
    return <div />;
  }

  const isHeader = type === 'textHeader';
  const textClasses = classNames(
    'text', {
      [`text--${type}`]: type,
      [`text--${variant}`]: variant,
      [`text--${columns}col`]: columns,
    }
  );
  const titleClasses = `text__title ${titleClass}`;
  const bodyClasses = `text__body ${bodyClass}`;
  const descClasses = `text__desc ${descClass}`;

  let more = descMore;
  if (more && !isValidElement(more)) {
    const params = { ...descMore, dispatch, setValues };
    const Component = stepComponents[params.type];
    more = <Component {...params} />;
  }
  return (
    <div className={textClasses}>

      {title &&
        <Text className={titleClasses} component={isHeader ? 'h4' : 'h5'} value={title} numberFormat={numberFormat} currencyFormat={currencyFormat} />
      }

      {body &&
        <Text className={bodyClasses} component="p" value={body} numberFormat={numberFormat} currencyFormat={currencyFormat} />
      }
      {
        actionVariant === 'confirmationTitle1' && <Text className="infoTitle1" component="p" value='Kontaktoplysninger' id={id}/>
      }
      {
        actionVariant === 'confirmationTitle2' && <Text className="infoTitle2" component="p" value='Betalingsoplysninger' id={id}/>
      }
      {
        actionVariant === 'calculation' && <p className={className} numberFormat={numberFormat} currencyFormat={currencyFormat}>{(userData.turnoverValue / 12).toFixed(3)}{userData.calculatedUnit}</p>
      }
      {list && actionVariant !== 'cpr' &&
        <ul className="text__list">
          {list.map(listItem => <Text className="list-item" component="li" value={listItem} numberFormat={numberFormat} currencyFormat={currencyFormat} />)}
          {listProps &&
            (listProps.length > 0 &&
              listProps.map(listProp => {
                const { showHide } = listProp;
                const inputParams = {
                  ...listProp,
                  userData,
                  dispatch,
                  hidden: (stepShowHide(listProp.hidden, showHide, userData, {})),
                };
                const InputComponent = stepComponents[listProp.type];
                const isValid = stepHasRequiredData(
                  listProp.requiredData,
                  userData,
                  null
                );
                if (inputParams.hidden || !isValid) {
                  return '';
                }
                return (<li className="list-item"><InputComponent {...inputParams} /></li>);
              })
            )
          }
        </ul>
      }
      {list && actionVariant === 'cpr' &&
        <ul className={`text__list ${className}`}>
          {list.map(listItem =>
            <Text className="list-item" component="li" value={listItem} numberFormat={numberFormat} currencyFormat={currencyFormat} />
            )}
          {listProps &&
            (listProps.length > 0 &&
              listProps.map(listProp => {
                const { showHide } = listProp;
                const inputParams = {
                  ...listProp,
                  userData,
                  dispatch,
                  hidden: (stepShowHide(listProp.hidden, showHide, userData, {})),
                };
                const InputComponent = stepComponents[listProp.type];
                const isValid = stepHasRequiredData(
                  listProp.requiredData,
                  userData,
                  null
                );
                if (inputParams.hidden || !isValid) {
                  return '';
                }
                return (<li className="list-item"> <img src={icon} alt='' /><InputComponent {...inputParams} /></li>);
                // return (<img src={icon} alt=''/>);
              })
            )
          }
        </ul>
      }

      {
        desc &&
        <Text className={descClasses} component="p" value={desc} more={more} numberFormat={numberFormat} currencyFormat={currencyFormat}/>
      }
      {
        messages &&
        messages.map(message => <Text component="p" value={message} numberFormat={numberFormat} currencyFormat={currencyFormat} />)
      }

    </div >
  );
};

export default TextBlock;

TextBlock.defaultProps = {
  columns: '12',
  body: null,
  list: null,
  title: null,
  desc: null,
  descMore: null,
  variant: null,
  titleClass: '',
  bodyClass: '',
  listProps: null,
  messages: null,
  numberFormat: false,
  currencyFormat: false,
  className: '',
  actionVariant: '',
  icon: null,
  id: '',
  descClass: '',
};

TextBlock.propTypes = {
  type: PropTypes.string,
  list: PropTypes.array,
  columns: PropTypes.string,
  body: PropTypes.string,
  title: PropTypes.string,
  desc: PropTypes.string,
  descMore: PropTypes.object,
  variant: PropTypes.string,
  titleClass: PropTypes.string,
  bodyClass: PropTypes.string,
  listProps: PropTypes.array,
  dispatch: PropTypes.func,
  userData: PropTypes.object,
  hidden: PropTypes.bool,
  messages: PropTypes.array,
  numberFormat: PropTypes.bool,
  currencyFormat: PropTypes.bool,
  setValues: PropTypes.func,
  className: PropTypes.string,
  actionVariant: PropTypes.string,
  icon: PropTypes.string,
  descClass: PropTypes.string,
  id: PropTypes.string,
};
