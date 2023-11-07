import React from 'react';
import PropTypes from 'prop-types';
// Utils
import { getProgressLength, getSections, isLastSection } from '../../utilities/section/sectionUtils';

// Components
import ProgressSection from './ProgressSection';

const ProgressBar = ({
  packageData,
  error,
  currentSectionId,
  finishedSections,
  currentProgress,
  sectionOrder,
}) => {
  if (Object.keys(packageData).length === 0) {
    return <div />;
  }
  const sections = getSections(packageData, currentProgress.currentSectionGroup);
  if (isLastSection(sections, currentProgress, sectionOrder)) {
    finishedSections.push(currentProgress.currentSectionId);
  }
  const { progressLength, finishedLength } = getProgressLength(sections, currentProgress);
  return (
    <div className="progress-bar">
      {/* Progression Bar */}
      {error ?
        <div className="add_space" /> :
        <div className="progress-bar__line">
          <span className="line__background" />
          <span className="line__active" style={{ transform: `scaleX(${progressLength})` }} />
          <span className="line__finished" style={{ transform: `scaleX(${finishedLength})` }} />
        </div>
      }
      {/* Sections */}
      {!error && sections &&
        <ProgressSection
          packageData={packageData}
          sections={sections}
          currentSectionId={currentSectionId}
          finishedSections={finishedSections}
          sectionOrder={sectionOrder}
        />
      }

    </div>
  );
};

export default ProgressBar;

ProgressBar.propTypes = {
  packageData: PropTypes.object.isRequired,
  error: PropTypes.bool.isRequired,
  currentSectionId: PropTypes.number.isRequired,
  sectionOrder: PropTypes.array.isRequired,
  currentProgress: PropTypes.object.isRequired,
  finishedSections: PropTypes.array.isRequired,
};
