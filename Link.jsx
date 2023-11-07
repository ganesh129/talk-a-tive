import { compose } from 'recompose';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Icon from '../../Global/Icon';
import Text from '../../Global/Text';
import { replaceAll } from '../../../utilities/common';

const Link = ({
  label,
  link,
  icon,
  target,
  className,
  tracking,
  columns,
  dataTealium,
  translations,
  iconPos,
  encodeResponseData,
  divClassName,
}) => {
  let linkurl = replaceAll(link, translations, {});
  if (encodeResponseData !== '') {
    linkurl += encodeResponseData;
  }
  return (
    <div className={`form__field--${columns}col ${divClassName}`}>
      <a
        href={linkurl}
        target={target}
        className={`${className} ${tracking}`}
        data-tealium={dataTealium}
      >
        {icon && iconPos === 'before' &&
        <Icon icon={icon}/>
        }
        <Text value={label}/>
        {icon && iconPos === 'after' &&
        <Icon icon={icon}/>
        }
      </a>
    </div>
  );
};

export default compose(
  connect(state => {
    const {
      section: {
        packageData: {
          translations,
        },
      },
    } = state;
    return {
      translations,
    };
  })
)(Link);

Link.defaultProps = {
  icon: null,
  target: '_blank',
  className: '',
  tracking: 'tealiumLink',
  columns: '12',
  dataTealium: null,
  iconPos: 'before',
  encodeResponseData: '',
  divClassName: '',
};

Link.propTypes = {
  label: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  icon: PropTypes.string,
  target: PropTypes.string,
  className: PropTypes.string,
  tracking: PropTypes.string,
  columns: PropTypes.string,
  dataTealium: PropTypes.string,
  translations: PropTypes.object.isRequired,
  iconPos: PropTypes.string,
  encodeResponseData: PropTypes.string,
  divClassName: PropTypes.string,
};