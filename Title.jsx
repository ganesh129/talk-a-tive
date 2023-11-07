import PropTypes from 'prop-types';

// Components
import Text from '../../Global/Text';

const Title = ({
  title,
  variant,
  titleClasses,
}) => {
  return (
    <div className="title__header">
      {title &&
      <Text className={titleClasses} component={variant} value={title}/>
      }
    </div>
  );
};

export default Title;

Title.defaultProps = {
  title: null,
  variant: null,
  titleClasses: null,
};

Title.propTypes = {
  title: PropTypes.string,
  variant: PropTypes.string,
  titleClasses: PropTypes.string,
};
