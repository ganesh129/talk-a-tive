import PropTypes from 'prop-types';

const Divider = ({ className, rows }) => (
  <span className={`divider divider--${rows}rows ${className}`}/>
);

export default Divider;

Divider.defaultProps = {
  className: '',
  rows: '1',
};

Divider.propTypes = {
  className: PropTypes.string,
  rows: PropTypes.string,
};