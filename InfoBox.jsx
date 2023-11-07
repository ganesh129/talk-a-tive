import { Component } from 'preact';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CSSTransition from 'react-transition-group/CSSTransition';

// Components
import Text from '../../Global/Text';
import { actionHandler } from '../../../utilities/form/formUtils';
import { stepComponents } from '../../../constants/Steps';

import Coverage from './Coverage';

class InfoBox extends Component {
  constructor(props) {
    super(props);
    const { id } = props;
    this.state = {};
    this.state[props.id] = {
      showFull: false,
    };

    this.showFull = this.state[id].showFull;
    this.totalLength = 0;
    this.coverageCode = [];
    this.coverages = props.coverages.split('.').reduce((obj, index) => obj[index], props.userData);
    this.hiddenCoverageCount = 0;
    this.coverage = {};
  }

  render() {
    const {
      id,
      title,
      label,
      columns,
      body,
      list,
      buttonText,
      actions,
      dispatch,
      listProps,
      userData,
      setFieldValue,
      setValues,
      values,
      coverages,
      coverageText,
      coverageMoreText,
      coverageAndText,
      buttonDataTealium,
    } = this.props;

    const textClasses = classNames(
      'infobox', {
        [`infobox--${columns}col`]: columns,
      }
    );
    const callback = (length, coverage) => {
      this.totalLength += length;
      this.hiddenCoverageCount = this.coverages.length - this.coverageCode.length;
      if (!this.coverageCode.includes(coverage) && this.totalLength < 60) {
        this.coverageCode.push(coverage);
        this.coverage[coverage] = true;
        if (this.coverageCode.length === this.coverages.length) {
          this.showFull = true;
        }
        return true;
      }

      if (this.showFull || this.coverageCode.includes(coverage)) {
        return true;
      }
      this.coverage[coverage] = false;
      return false;
    };
    return (
      <article className={textClasses}>
        <div className="infobox__content">

          {/* Header */}
          <header className="infobox__header">
            {title &&
              <Text value={title} className="header__title" component="h4" />
            }

            {label &&
              <Text value={label} className="header__label" component="h6" />
            }
          </header>

          {/* Body Text */}
          {body &&
            <Text value={body} className="infobox__body" component="div" />
          }
          {/* List Items */}
          {list &&
            <ul className="infobox__list list">
              {list.map(listItem => <Text className="list__item" component="li" value={listItem} />)}
              {coverageText &&
                <li className="list__item list__item--title">
                  <span className="infobox__list--coverage"><strong>{coverageText}</strong></span>
                  {coverages.split('.').reduce((obj, index) => obj[index], userData).map(listItem =>
                    <CSSTransition
                      in={this.coverage[listItem] !== false}
                      timeout={300}
                      classNames="fadeIn"
                      unmountOnExit
                    >
                      <span className="infobox__list--coverage">
                        <Coverage variant="listProps" coverageCode={listItem} callBack={callback} />
                      </span>
                    </CSSTransition>
                  )
                  }
                  {!this.showFull &&
                    <div className="form__field form__field--button form__field--button-text infobox__list--showmore">
                      <span className="leftAlign">&nbsp;{coverageAndText}&nbsp;</span>
                      <button
                        type="button"
                        className="button button--text leftAlign"
                        id={id}
                        name={id}
                        onClick={() => {
                          const newState = this.state;
                          newState[id].showFull = true;
                          this.showFull = true;
                          Object.keys(this.coverage).forEach(element => {
                            this.coverage[element] = true;
                          });
                          this.setState(newState);
                        }}
                      >
                        {this.hiddenCoverageCount}&nbsp;{coverageMoreText}
                      </button>
                    </div>
                  }
                </li>}
              {listProps &&
                (listProps.length > 0 &&
                  listProps.map(listProp => {
                    const inputParams = {
                      ...listProp,
                      dispatch,
                      userData,
                      setFieldValue,
                      setValues,
                    };
                    const InputComponent = stepComponents[listProp.type];
                    return (<li className="list__item list__item-sub"><InputComponent {...inputParams} /></li>);
                  })
                )
              }
            </ul>
          }

          {/* Buttons */}
          {buttonText && actions &&

            <div className="form__field form__field--advancedLink form__field--button form__field--button-text form__field--12col">
              <button
                type="submit"
                className="button button--text"
                id={id}
                name={id}
                onClick={e => actionHandler(actions, null, e, dispatch,
                  { ...values, setFieldValue }, setValues)
                }
                data-tealium={buttonDataTealium}
              >
                <Text value={buttonText} />
              </button>
            </div>
          }

        </div>
      </article>
    );
  }
}

export default InfoBox;

InfoBox.defaultProps = {
  label: null,
  body: null,
  list: null,
  buttonText: null,
  actions: [],
  listProps: [],
  coverages: null,
  coverageText: null,
  coverageMoreText: null,
  coverageAndText: null,
  buttonDataTealium: null,
};

InfoBox.propTypes = {
  id: PropTypes.string.isRequired,
  columns: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  actions: PropTypes.array,
  list: PropTypes.array,
  listProps: PropTypes.array,
  label: PropTypes.string,
  body: PropTypes.string,
  buttonText: PropTypes.string,
  userData: PropTypes.object.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setValues: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
  coverages: PropTypes.string,
  coverageText: PropTypes.string,
  coverageMoreText: PropTypes.string,
  coverageAndText: PropTypes.string,
  buttonDataTealium: PropTypes.string,
};
