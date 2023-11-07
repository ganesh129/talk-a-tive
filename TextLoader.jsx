import { Component } from 'preact';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import React from 'react';
import Icon from '../../Global/Icon';
import Text from '../../Global/Text';
import { checkConditions } from '../../../utilities/package/packageUtils';

class TextLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaderMessages: [],
    };
    this.loadMessages = this.loadMessages.bind(this);
    this.pushMessages = this.pushMessages.bind(this);
  }

  componentDidMount() {
    const { userData } = this.props;
    this.loadMessages(this.props.loadText, userData);
  }

  pushMessages(item) {
    const that = this;
    that.state.loaderMessages.push(item);
    that.setState({
      loaderMessages: [...that.state.loaderMessages],
    });
  }

  loadMessages(loadText, userData) {
    const that = this;
    let interval = 0;
    const newLoadText = loadText.filter(prop => {
      if (prop.conditions && !checkConditions(prop.conditions, userData)) {
        return false;
      }
      return true;
    });
    newLoadText.forEach((item, index) => {
      const key = `show${index}`;
      setTimeout(() => {
        that.setState({
          [key]: true,
        });
      }, interval);
      interval += 2000;
      this.pushMessages(item);
    });
  }


  render() {
    const { userData: { loaderProgress }, loaderTitle } = this.props;
    return (
      <div className="loader__input--wrapper">
        <div className="loader__input--container">
          <Text value={loaderTitle} component="h1" className="display__text--md margin__bottom--medium" />
          {this.state.loaderMessages && this.state.loaderMessages.map((item, index) => {
            const indexId = index;
            const compare = this.state.loaderMessages.length - 1;
            const key = `show${index}`;
            return (
              <div className="loader__input--outer">
                <div className={this.state[key] ? 'loader--flex' : 'loader--flex disabled'}>
                  <div className="loader__input--icon">
                    {indexId < compare && this.state[key] &&
                      <span>
                        <span className="loader__input--loaded"><Icon icon='checkmark' fill="none" /></span>
                        <span className="loader__input--loading"><span className="spinner" /></span>
                      </span>
                    }
                    {indexId === compare && this.state[key] &&
                      <span className="loader__input--service">
                        <span className={loaderProgress === 1 ? 'show' : 'hide'}><Icon icon='checkmark' fill="none" /></span>
                        <span className={loaderProgress === 0 ? 'show' : 'hide'}><span className="spinner" /></span>
                      </span>
                    }
                  </div>
                  <div className="loader__input--text"><Text value={item.text} /></div>
                </div>

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
)(TextLoader);

TextLoader.propTypes = {
  loadText: PropTypes.object.isRequired,
  userData: PropTypes.object.isRequired,
  loaderTitle: PropTypes.string.isRequired,
};
