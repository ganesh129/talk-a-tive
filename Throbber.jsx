import PropTypes from 'prop-types';
import CSSTransition from 'react-transition-group/CSSTransition';

const Throbber = ({ appLoading }) => {
  return (
    <CSSTransition
      in={appLoading === true}
      timeout={300}
      classNames="fadeIn"
      unmountOnExit
    >
      <div className="throbber">
        <div className="throbber__container">
          <div className="spinner"/>
          <h5 className="throbber__title">Vent venligst</h5>
        </div>
      </div>
    </CSSTransition>
  );
};

export default Throbber;

Throbber.propTypes = {
  appLoading: PropTypes.bool.isRequired,
};
