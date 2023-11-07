import Parser from 'html-react-parser';
import Html from 'html-parse-stringify';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { replaceAll } from '../../utilities/common';
import Icon from './Icon';

const Text = (
  {
    value,
    userData,
    className,
    numberFormat,
    component: Component,
    more,
    icon,
    iconClass,
    hidden,
    initialValues,
    currencyFormat,
    values,
    translations,
    error,
    errorData,
    toolTip,
    calcValue,
  }) => {
  if (hidden) {
    return null;
  }
  if (!value) {
    console.warn('You need to add a "Value" to the Text component'); // eslint-disable-line
    return null;
  }

  let additionalData = {};

  if (error && errorData && errorData.response
    && errorData.response.data) {
    additionalData = errorData.response.data;
  }

  let newValue = replaceAll(
    value,
    translations,
    { ...values, ...initialValues, ...userData, ...additionalData },
    numberFormat,
    currencyFormat
  );

  // if empty string then nothing to do.
  if (!newValue) {
    return null;
  }

  // Add target=_blank.
  const modifyAttributes = element => {
    const newElement = element;
    if (element.type === 'tag' && element.name === 'a') {
      const { attrs } = element;
      // Set all links to target blank.
      if (!attrs.target) {
        newElement.attrs.target = '_blank';
      }
    }
    return newElement;
  };
  let addTag = false;
  if (typeof newValue === 'string' && newValue.trim().indexOf('<') !== 0) {
    newValue = `<q>${newValue}</q>`
    addTag = true;
  }
  try {
    let html = Html.parse(newValue);
    // Check for html tags in string.
    html = html.map(outer => {
      const newOuter = outer;
      if (newOuter.children) {
        newOuter.children = outer.children.map(inner => (
          modifyAttributes(inner)
        ));
      }
      return modifyAttributes(newOuter);
    });
    newValue = Html.stringify(html);
    if (addTag) {
      newValue = newValue.substr(3).substring(0, newValue.length - 4);
    }
  } catch (e) {
    // eslint-disable-next-line
    console.error('wrong html tags', newValue);
  }

  // Add more if available.
  const output = typeof newValue === 'string' ? [Parser(newValue)] : [];
  if (more) {
    output.push(more);
  }
  return (
    <Component
      {...(className ? { 'className': className } : {})}
      data-rh={toolTip}
    >
      {icon &&
      <span className={iconClass}>
        <Icon icon={icon}/>
      </span>
      }
      {calcValue && <p className={className}>{value * 2 }{'kr. / årligt'}</p>}
      {output}
    </Component>
  );
};

export default compose(
  connect(state => {
    const {
      userData,
      section: {
        packageData: { translations },
      },
      app: { error, errorData },
    } = state;

    return { userData, translations, error, errorData };
  })
)(Text);

Text.defaultProps = {
  className: undefined,
  component: 'span',
  numberFormat: false,
  more: null,
  icon: null,
  iconClass: null,
  hidden: false,
  initialValues: null,
  currencyFormat: false,
  values: null,
  translations: null,
  error: false,
  errorData: null,
  toolTip: null,
  calcValue: false,
};

Text.propTypes = {
  value: PropTypes.string,
  userData: PropTypes.object.isRequired,
  className: PropTypes.string,
  component: PropTypes.string,
  numberFormat: PropTypes.bool,
  more: PropTypes.object,
  icon: PropTypes.string,
  iconClass: PropTypes.string,
  hidden: PropTypes.bool,
  initialValues: PropTypes.object,
  currencyFormat: PropTypes.bool,
  values: PropTypes.object,
  translations: PropTypes.object,
  error: PropTypes.bool,
  errorData: PropTypes.object,
  toolTip: PropTypes.string,
  calcValue: PropTypes.bool,
};
