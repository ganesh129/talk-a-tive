import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import classNames from 'classnames';

// Actions
import { prevStepAction } from '../../actions/Section';

// Components
import Icon from '../Global/Icon';
import Trans from '../Global/Translation';

const BackButton = ({
  dispatch,
  className,
  label,
  displayImage,
  compactLayout,
}) => {
  const performBack = () => {
    dispatch(prevStepAction());
  };

  const backButtonClasses = classNames('back-button', {
    'back-button-v2': displayImage,
    'back-button-compact': compactLayout,
  });

  return (
    <div className={`${backButtonClasses} ${className}`}>
      <button
        className="button"
        onClick={(e) => performBack(e)}
        type="button"
      >
        {(!compactLayout) &&
        <span>
          <Icon icon="chevronRight" fill="red"/>
          <Trans value={label}/>
        </span>
      }
        {(compactLayout) &&
        <span>
          <Icon icon="arrowLeft" fill="black"/>
        </span>
      }
      </button>
    </div>
  );
};

export default compose(
  connect(state => {
    const {
      userData,
    } = state;
    return {
      userData,
    };
  })
)(BackButton);

BackButton.defaultProps = {
  className: '',
  label: 'go-back',
  displayImage: false,
  compactLayout: false,
};

BackButton.propTypes = {
  dispatch: PropTypes.func.isRequired,
  className: PropTypes.string,
  label: PropTypes.string,
  displayImage: PropTypes.bool,
  compactLayout: PropTypes.bool,
};
