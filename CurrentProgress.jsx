import PropTypes from 'prop-types';

const CurrentProgress = ({ currentProgress }) => (
  <div className="current-progress">
    <span className="current-progress__steps">
      {currentProgress.currentSectionId}
      .
      {currentProgress.currentPageData.currentPageId}
    </span>

    <span className="current-progress__separator">
      -
    </span>

    <span className="current-progress__section-title">
      {currentProgress.currentSectionName}
    </span>
  </div>
);

export default CurrentProgress;

CurrentProgress.propTypes = {
  currentProgress: PropTypes.object.isRequired,
};
