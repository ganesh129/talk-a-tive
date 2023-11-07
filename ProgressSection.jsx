import PropTypes from 'prop-types';
import classNames from 'classnames';
import MediaQuery from 'react-responsive';

// Utils
import { getOrderIndex } from '../../utilities/section/sectionUtils';
import Text from '../Global/Text';
import Icon from '../Global/Icon';

const ProgressSection = ({
  sections,
  currentSectionId,
  finishedSections,
  sectionOrder,
}) => (
  <ul className="section__list">
    {sections.map(section => {
      const sectionIndex = getOrderIndex(section.sectionId, sectionOrder);
      const currentSectionIndex = getOrderIndex(currentSectionId, sectionOrder);
      const lastSectionIndex = getOrderIndex(
        sections[sections.length - 1].sectionId, sectionOrder);
      const sectionFinished =
        finishedSections.includes(section.sectionId);

      const sectionClass = classNames('section', {
        'section--finished': sectionFinished,
        'section--active': currentSectionIndex === sectionIndex,
        'section--last': lastSectionIndex === sectionIndex,
      });

      return (
        <li className={sectionClass}>
          {sectionFinished &&
          <div>
            <div className="section__number"/>
            <Icon icon="checkmark" fill="red"/>
          </div>
          }
          {!sectionFinished &&
          <div className="section__number">{section.sectionId}</div>
          }
          <MediaQuery minWidth={480}>
            <h6 className="section__title">
              <Text value={section.name}/>
            </h6>
          </MediaQuery>
        </li>
      );
    })}
  </ul>);

export default ProgressSection;

ProgressSection.propTypes = {
  sections: PropTypes.array.isRequired,
  currentSectionId: PropTypes.number.isRequired,
  finishedSections: PropTypes.array.isRequired,
  sectionOrder: PropTypes.array.isRequired,
};
