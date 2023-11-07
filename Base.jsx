import { Component } from 'preact';
import PropTypes from 'prop-types';
import CSSTransition from 'react-transition-group/CSSTransition';

// Utils
import { pageTransitionType } from '../../utilities/section/sectionUtils';
import { scrollPosition } from '../../utilities/common';

// Components
import Page from '../Page';


class BaseSection extends Component {
  render() {
    const {
      actions,
      price,
      loaderProgress,
      finishedSections,
      packageData,
      currentProgress,
      userData,
      activeSectionData,
      error,
      errorData,
    } = this.props;
    const { initialValues, initialValues: { insertToState, errorDisplay } } = packageData;
    const newInitialValue = {};
    if (insertToState) {
      insertToState.forEach(element => {
        newInitialValue[element] = initialValues[element];
      });
    }
    return (
      <div>
        {/* Render the active pages  */}
        {activeSectionData.pages &&
        (
          <div className="pages">
            {activeSectionData.pages.map(page => {
              const activePage = page.pageId === currentProgress.currentPageData.currentPageId;
              const { component: { componentName }, loaderType } = page;
              return (
                <CSSTransition
                  in={activePage}
                  unmountOnExit
                  onExiting={this.onExitingCallback}
                  onExit={scrollPosition}
                  {...pageTransitionType(componentName, loaderType)}
                >
                  <Page
                    actions={actions}
                    price={price}
                    pageData={page}
                    currentProgress={currentProgress}
                    loaderProgress={loaderProgress}
                    userData={userData}
                    initialValues={newInitialValue}
                    error={error}
                    errorData={errorData}
                    activePage={activePage}
                    activeSectionData={activeSectionData}
                    errorDisplay={errorDisplay}
                    onExit={scrollPosition}
                  />
                </CSSTransition>
              );
            })}
          </div>
          )
        }
      </div>
    );
  }
}

export default BaseSection;

BaseSection.propTypes = {
  activeSectionData: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  currentProgress: PropTypes.object.isRequired,
  currentSectionId: PropTypes.number.isRequired,
  loaderProgress: PropTypes.number.isRequired,
  finishedSections: PropTypes.array.isRequired,
  packageData: PropTypes.object.isRequired,
  userData: PropTypes.object.isRequired,
  sectionOrder: PropTypes.array.isRequired,
  price: PropTypes.string.isRequired,
  error: PropTypes.bool.isRequired,
  errorData: PropTypes.object.isRequired,
};
