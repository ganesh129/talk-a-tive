import PropTypes from 'prop-types';

// Component
import Text from './Text';

const Translation = ({
  value,
  className,
  component,
}) => {
  const text = `\${${value}}`;
  return (
    <Text
      value={text}
      className={className}
      component={component}
    />
  );
};

export default Translation;

Translation.defaultProps = {
  component: undefined,
  className: undefined,
};

Translation.propTypes = {
  value: PropTypes.string.isRequired,
  component: PropTypes.string,
  className: PropTypes.string,
};
