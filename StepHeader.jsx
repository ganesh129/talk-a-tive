import PropTypes from 'prop-types';

// Components
import Text from '../../Global/Text';

const StepHeader = ({ title, desc }) => (
  <header className="step__header">
    {/* The Component Title */}
    {title &&
    <Text value={title} className="step__title" component="h3"/>
    }
    {/* The Component Description */}
    {desc &&
    <Text value={desc} className="step__desc" component="p"/>
    }
  </header>
);

export default StepHeader;

StepHeader.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string,
};
