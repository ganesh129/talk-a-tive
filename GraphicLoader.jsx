import { Component } from 'preact';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import React from 'react';
import MediaQuery from 'react-responsive';

// Components
import Icon from '../../Global/Icon';
import Trans from '../../Global/Translation';

class GraphicLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaderImages: [],
    };

    this.displayGraphics = this.displayGraphics.bind(this);
  }

  componentDidMount() {
    const { userData: { questionaries }, userData } = this.props;
    this.displayGraphics(questionaries, userData, this.props);
  }

  displayGraphics(questionaries, userData, props) {
    const that = this;
    let interval = 0;
    questionaries.forEach((item) => {
      setTimeout(() => {
        if ((!that.state.loaderImages.includes(item.value) && item.value !== '')) {
          if (item.id === props.propertyCondition
            && userData[props.propertyCompare] === props.propertyValue) {
            that.state.loaderImages.push(item.value.concat(props.propertyValue).replace(/[ ,]/g, ''));
          } else {
            that.state.loaderImages.push(item.value.replace(/[ ,]/g, ''));
          }
          that.setState({
            loaderProgressHeight: that.state.loaderProgressHeight,
            loaderImages: [...that.state.loaderImages],
          });
        }
      }, interval);
      interval += 2000;
    });
  }

  render() {
    return (
      <div className="graphic-outer">
        <MediaQuery minWidth={1200}>
          <div className="graphic-icons--outer">
            {this.state.loaderImages && this.state.loaderImages.map((item) => {
              return (
                <div id={item} className="graphic-icons">
                  <Icon icon={item} fill="none" className="animate" />
                </div>
              );
            })
            }
          </div>
        </MediaQuery>
        <div className="graphic-text--outer">
          {this.state.loaderImages && this.state.loaderImages.map((item) => {
            return (
              <div className="graphic-text--inner">
                <div className="graphic-loaderimg">
                  <span className="graphic-loaderimg-top"><Icon icon='checkmark' fill="none" /></span>
                  <span className="graphic-loaderimg-bottom"><span className="spinner" /></span>
                </div>
                <div className="graphic-text"><Trans value={item} /></div>
              </div>
            );
          })
          }
        </div>
      </div>
    );
  }
}


export default compose(
  connect(state => {
    const {
      userData,
    } = state;
    return {
      userData,
    };
  })
)(GraphicLoader);

GraphicLoader.propTypes = {
  userData: PropTypes.object.isRequired,
};
