import { Component } from 'preact';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CSSTransition from 'react-transition-group/CSSTransition';

// Components
import Text from '../../Global/Text';
import Icon from '../../Global/Icon';

class Accordion extends Component {
  constructor(props) {
    super(props);
    this.setActive = this.setActive.bind(this);
    this.setHeight = this.setHeight.bind(this);
    this.setScrollPos = this.setScrollPos.bind(this);
    this.state = {
      active: false,
    };
  }

  setActive() {
    const { active } = this.state;
    this.setState({
      active: !active,
    });
  }

  setHeight() {
    const wrapperHeight = this.wrapper.offsetHeight;
    const padding = 40;
    const heightInPx = height => `${height}px`;
    const wrapperStyle = this.wrapper.style;

    // If it's already open, then close
    if (wrapperStyle.maxHeight === heightInPx(wrapperHeight) || wrapperStyle.maxHeight === 'none') {
      wrapperStyle.maxHeight = '0px';
    }

    // If it's closed, then open
    if (wrapperStyle.maxHeight !== heightInPx(wrapperHeight) &&
      wrapperStyle.maxHeight !== 'none' &&
      wrapperStyle.maxHeight !== '0px') {
      wrapperStyle.maxHeight = '0px';

      // We need the timeout to make sure the next function is executed after the 0 is set
      setTimeout(() => {
        wrapperStyle.maxHeight = heightInPx(wrapperHeight + padding);
      }, 1);
    }
  }

  setScrollPos() {
    // When done, scroll to bottom of accordion
    const modalContainer = document.querySelector('.modal__content__inner');
    modalContainer.scroll({
      top: modalContainer.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
  }

  render() {
    const {
      body,
      columns,
      desc,
      text,
      title,
      type,
      variant,
      list,
    } = this.props;
    const { active } = this.state;
    const accordionClasses = classNames(
      'accordion', {
        'accordion--active': active,
        [`accordion--${type}`]: type,
        [`accordion--${variant}`]: variant,
        [`accordion--${columns}col`]: columns,
      }
    );

    const events = {
      'onEntering': this.setHeight,
      'onExiting': this.setHeight,
      'onEntered': this.setScrollPos,
    };

    return (
      <div className={accordionClasses}>

        <button type="button" className="accordion__title" onClick={this.setActive}>
          <span>
            <Text value={title}/>
            <Icon icon="chevronDown" fill="red"/>
          </span>
        </button>

        <CSSTransition
          in={active}
          timeout={300}
          classNames="scaleInTop"
          unmountOnExit
          {...events}
        >
          <div className="accordion__wrapper rich-text" ref={wrapper => this.wrapper = wrapper}>
            {desc &&
            <Text className="accordion__desc" component="p" value={desc}/>
            }

            {text &&
            <Text className="accordion__text" component="p" value={text}/>
            }

            {body &&
            <Text className="accordion__body" component="p" value={body}/>
            }

            {list &&
            <ul>
              {list.map(listItem => <Text component="li" value={listItem}/>)}
            </ul>
            }

          </div>
        </CSSTransition>

      </div>
    );
  }
}

export default Accordion;

Accordion.defaultProps = {
  body: null,
  desc: null,
  text: null,
  variant: null,
  list: null,
};

Accordion.propTypes = {
  body: PropTypes.string,
  columns: PropTypes.string.isRequired,
  desc: PropTypes.string,
  text: PropTypes.string,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  variant: PropTypes.string,
  list: PropTypes.array,
};
