import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as icons from '../../assets/icons';

const Icon = ({
  icon,
  className,
  fill,
  stroke,
}) => {
  if (icons.default[icon] === undefined) {
    console.warn(`❌ The icon: ${icon}, doesn't exist.`); // eslint-disable-line
    return <i/>;
  }

  const iconClass = classNames('icon', {
    [`icon--${className}`]: className,
    [`icon--${icon}`]: !className,
    [`icon--fill-${fill}`]: fill,
    [`icon--stroke-${stroke}`]: stroke,
  });

  return (
    <i
      className={iconClass}
      dangerouslySetInnerHTML={{ __html: icons.default[icon] }}
    />
  );
};

export default Icon;

Icon.defaultProps = {
  fill: null,
  stroke: null,
  className: null,
};

Icon.propTypes = {
  icon: PropTypes.string.isRequired,
  className: PropTypes.string,
  fill: PropTypes.string,
  stroke: PropTypes.string,
};
