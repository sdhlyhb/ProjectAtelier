import React from 'react';
import { useState } from 'react';
import ReviewEntryCSS from './cssModule_Reviews/ReviewEntry.module.css';
import Stars from './Stars.jsx';
import HelpfulAndReport from './HelpfulAndReport.jsx';
import Highlighted from './Highlighted.jsx';

function ReviewEntry(props) {
  const reviewDate = new Date(props.review.date)
    .toLocaleDateString({}, {
      timeZone: 'UTC', month: 'long', day: '2-digit', year: 'numeric'
    });
  let percent = (props.review.rating / 5) * 100;
  const [imagePop, setImagePop] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [displayFull, setDisplayFull] = useState(false);
  return (
    <div className={ReviewEntryCSS.reviewEntryContainer} id='review-entry'>
      {/* stars rating display */}
      <div>
        {/* Stars rating: {props.review.rating} */}
        < Stars percent={percent} />
        <br />
      </div>
      <div className={ReviewEntryCSS.usernameTimestamp}>
        <span id='reviewer-name'>{props.review.reviewer_name}</span>
        {',    '}
        <span id='review-timestamp'>{reviewDate}</span>

      </div>

      <h3 id='review-summary' style={{ 'fontFamily': 'Montserrat' }}> {props.review.summary}</h3>
      {props.review.body.length <= 250
        ? <div id='review-body' className={ReviewEntryCSS.reviewBody}> <Highlighted text={props.review.body} highlight={props.search} /> </div>

        : props.review.body.length > 250 && !displayFull

          ? <div id='review-body' className={ReviewEntryCSS.reviewBody}><Highlighted text={props.review.body.slice(0, 250)} highlight={props.search} />{"..."}
            <a href='null' style={{ 'color': 'blue' }} onClick={e => {
              e.preventDefault();
              setDisplayFull(true);

            }}>
              Show More
            </a> </div>

          : <div id='review-body' className={ReviewEntryCSS.reviewBody}>
            {' '}
            {props.review.body}
            {' '}
          </div>
      }
      {/* conditional rendering of recommendation */}
      {props.review.recommend
        ? <div id='recomended-message' className={ReviewEntryCSS.recommendation}>
          &#10004; I recommend this product
        </div>
        : null
      }
      {/* conditional rendering of seller's response */}
      {props.review.response && props.review.response.length
        ? <div id='seller-response' className={ReviewEntryCSS.sellerResponse} style={{ 'backgroundColor': 'lightgrey' }}>
          <b>Response from seller:</b>
          <br />
          <br />
          {props.review.response}
        </div>
        : null
      }
      {/* conditional rendering of review photos */}
      {props.review.photos.length > 0
        ? <div className={ReviewEntryCSS.box}>
          {props.review.photos.map(
            (photo, i) => (
              <div key={photo.id} >
                <img
                  id={`review-photo-${photo.id}`}
                  alt="review-photo"
                  src={photo.url}
                  className={ReviewEntryCSS.reviewPhotos}
                  onClick={() => {
                    setImagePop(!imagePop);
                    setImageUrl(photo.url);
                  }}
                  onError={props.addDefaultSrc}

                />

              </div>
            )

          )}
          {imagePop
            ? (
              <div id="image-pop-modal"
                className={ReviewEntryCSS.photoModal}
              >
                <div className={ReviewEntryCSS.photoModalScroller}>
                  <img id="full-resolution-image"

                    onClick={() => setImagePop(!imagePop)}
                    alt="full-photo"
                    src={imageUrl}
                  />

                </div>
              </div>
            )
            : null}
        </div>
        : null

      }
      <HelpfulAndReport
        count={props.review.helpfulness}
        removeReportedReview={props.removeReportedReview}
        refresh={props.refresh}
        reviewId={props.review.review_id} />
      <hr
        style={{
          'background': 'grey',
          'color': 'grey',
          borderColor: 'grey',
          height: '1px',
          marginRight: '35px',
        }} />

    </div>

  );
}




export default ReviewEntry;