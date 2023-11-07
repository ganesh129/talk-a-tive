import { Component } from 'preact';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';

// Components
import TextBlock from './TextBlock';

class Consent extends Component {
  constructor(props) {
    super(props);
    const { userData, setValues } = props;
    userData[props.id] = true;
    setValues({ ...userData });
  }

  getConsentTemplate() {
    const { userData, templateName } = this.props;
    if (userData.consents) {
      return (userData.consents.templates).filter((item) => item.templateName === templateName);
    }
    return [];
  }

  render() {
    const {
      variant,
      consentDisplay,
    } = this.props;

    const value = this.getConsentTemplate();

    return (
      <div>
        { consentDisplay &&
          <TextBlock
            desc={value.length > 0 ? value[0].content : ''}
            variant={variant}
          />
        }
      </div>
    );
  }
}


export default compose(
  connect(state => {
    const {
      userData,
    } = state;

    return { userData };
  })
)(Consent);

Consent.defaultProps = {
  variant: null,
  consentDisplay: true,
};

Consent.propTypes = {
  variant: PropTypes.string,
  userData: PropTypes.object.isRequired,
  templateName: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  setValues: PropTypes.func.isRequired,
  consentDisplay: PropTypes.bool,
};
