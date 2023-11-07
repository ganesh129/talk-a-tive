import PropTypes from 'prop-types';

const Space = ({ rows }) => (
  <span className={`space space--${rows}rows`}/>
);

export default Space;

Space.defaultProps = {
  rows: '1',
};

Space.propTypes = {
  rows: PropTypes.string,
};
