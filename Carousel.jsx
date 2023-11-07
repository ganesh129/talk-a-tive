import { Component } from 'preact';
import Slider from 'react-slick';
import PropTypes from 'prop-types';
import StarRatings from 'react-star-ratings';
import Text from '../../Global/Text';
import Icon from '../../Global/Icon';

class Carousel extends Component {
  render() {
    const {
      carouselInfo,
      userData,
    } = this.props;
    const settings = {
      dots: true,
      arrows: false,
      infinite: true,
      autoplay: true,
      speed: 1000,
      autoplaySpeed: 5000,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
    const { basePath } = userData;
    return (
      <article className="carousel-outer">
        <Icon icon="quoteSmall" fill="black"/>
        <Slider {...settings}>
          {carouselInfo.map(carouselVal => {
            const {
              reviewStar, reviewComment, reviewPerson, reviewDate, personImage,
            } = carouselVal;
            return (
              <div><StarRatings rating={reviewStar} numberOfStars={5} name='rating'/>
                {reviewComment &&
                <div className="review-comment"><p><Text value={reviewComment} /></p></div>}
                {reviewPerson &&
                <div>
                  {personImage &&
                    <img src={basePath + personImage} alt="reviewPerson" className="review-person"/>
                  }
                  <strong><Text value={reviewPerson} /></strong><span className="review-date"><Text value={reviewDate} /></span>
                </div>}
              </div>);
          })
        }
        </Slider>
      </article>
    );
  }
}

export default Carousel;
Carousel.defaultProps = {

};
Carousel.propTypes = {
  carouselInfo: PropTypes.array.isRequired,
  userData: PropTypes.object.isRequired,
};
