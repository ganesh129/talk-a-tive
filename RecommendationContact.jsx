import { Component } from 'preact';
import React from 'react';
import PropTypes from 'prop-types';
import { stepComponents } from '../../../constants/Steps';
import Text from '../../Global/Text';

class RecommendationContact extends Component {
  render() {
    const {
      userData,
      inputContact,
      dispatch,
      initialValues,
      title,
      desc,
      handleSubmit,
      onBlur,
      onChange,
      setValues,
      touched,
      values,
      setFormValues,
      errors,
    } = this.props;

    const formParams = {
      handleSubmit,
      onChange,
      onBlur,
      touched,
      setValues,
      values,
      setFormValues,
      dispatch,
      userData,
      errors,
    };

    return (
      <article className="recommendation__contact">
        <div className="recommendation__contact--inner">
          <h2 className="recommendation__contact--title">{title}</h2>
          <div className="recommendation__contact--content">
            <Text value={desc} component="p" />
            <div className="grid recommendation__contact--input button--inline">
              {inputContact && inputContact.map(list => {
                const inputParams = {
                  ...list,
                  ...formParams,
                  initialValues: { ...initialValues },
                };
                const InputComponent = stepComponents[list.type];
                return (<div className='grid__col grid__col--12 grid__col--sm-4 grid__col--md-4'><InputComponent {...inputParams} /></div>);
              })}

            </div>
          </div>
        </div>
      </article>
    );
  }
}

export default RecommendationContact;

RecommendationContact.defaultProps = {
  inputContact: [],
  handleSubmit: null,
  onBlur: null,
  onChange: null,
  setFormValues: null,
  setValues: null,
  touched: null,
  values: null,
  errors: null,

};

RecommendationContact.propTypes = {
  userData: PropTypes.object.isRequired,
  title: PropTypes.object.isRequired,
  desc: PropTypes.object.isRequired,
  inputContact: PropTypes.array,
  dispatch: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  setFormValues: PropTypes.func,
  setValues: PropTypes.func,
  touched: PropTypes.object,
  values: PropTypes.object,
  initialValues: PropTypes.object.isRequired,
  errors: PropTypes.object,
};