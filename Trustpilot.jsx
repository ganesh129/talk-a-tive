import { Component } from 'preact';
import PropTypes from 'prop-types';
import React from 'react';

const TrustBox = ({ trustBoxRef, businessUnitId, templateId }) => {
  const ref = trustBoxRef;

  return (
    <div
      ref={(dom) => { ref.dom = dom; } }
      className="trustpilot-widget"
      data-template-id={templateId}
      data-businessunit-id={businessUnitId}
      data-locale="da-DK"
      data-theme="light"
      data-style-width="100%"
      data-stars="3,4,5"
    />
  );
};

class TrustPilotWidget extends Component {
  constructor(props) {
    super(props);
    this.trustBoxRef = {};
  }

  componentDidMount() {
    if (window.Trustpilot) {
      window.Trustpilot.loadFromElement(this.trustBoxRef.dom, true);
    }
  }

  render(props) {
    return <TrustBox trustBoxRef={this.trustBoxRef} {...props} />;
  }
}
export default TrustPilotWidget;

TrustPilotWidget.propTypes = {
  businessUnitId: PropTypes.string.isRequired,
  templateId: PropTypes.string.isRequired,
};

TrustBox.propTypes = {
  trustBoxRef: PropTypes.object.isRequired,
  businessUnitId: PropTypes.string.isRequired,
  templateId: PropTypes.string.isRequired,
};