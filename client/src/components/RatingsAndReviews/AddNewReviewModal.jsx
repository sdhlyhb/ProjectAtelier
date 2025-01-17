import React from 'react';
import axios from 'axios';
import AddStarRating from './AddStarRating.jsx';
import CharacteristicsForm from './CharacteristicsForm.jsx';
import AddNewReviewModalCSS from './cssModule_Reviews/AddNewReviewModal.module.css';
import WithTrackerHOC from '../../WithTrackerHOC.jsx';
import Wrapper from '../../Wrapper.jsx';

class AddNewReviewModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      currentItemName: '',

      currentItemId: 0,

      recommendStatus: 'yes', // default

      starRating: '', // default

      characteristics: {},

      summary: '',

      ReviewBody: '',

      images: [],

      imageFiles: [],

      uploadedImages: [],

      // uploaded: false,

      nickeName: '',

      Email: '',

      posted: false,

      overallRatingErr: true,

      CharacteristicsErr: true,

      reviewBodyErr: true,

      nickenameErr: true,

      EmailEmpty: true,

      EmailFormatErr: true,

      uploadErr: false,

      hasError: false,

    };
  }

  componentDidMount() {
    this.setState({
      currentItemName: this.props.currentName,
      currentItemId: this.props.currentProductId,
    });
  }

  componentDidUpdate(prevState, prevProps) {
    // if (prevState.images !== this.state.images) {
    //   this.imageUpload();
    // }

  }

  onValueChange(e) {
    this.setState({
      recommendStatus: e.target.value,
    });
  }

  onImageChange(e) {
    if (e.target.files && e.target.files[0]) {
      const img = e.target.files[0];
      const results = this.state.images;
      const files = this.state.imageFiles;

      results.push(URL.createObjectURL(img));
      files.push(img);

      this.setState({
        images: results,
        imageFiles: files,
        // uploaded: !preUploadStatus
      });
      this.imageUpload();
    }
  }

  imageUpload() {
    const updated = [];
    this.state.imageFiles.forEach((image) => {
      const formData = new FormData();
      formData.append('image', image);

      axios.post('/upload/images', formData, { headers: { 'content-Type': 'multipart/form-data' } })
        .then((response) => {
          updated.push(response.data);
          this.setState({
            uploadedImages: updated,

          });
        }).catch((err) => {
          this.setState({
            uploadErr: true,
          });
        });
    });
  }

  removeBtnClick(e) {
    e.preventDefault();
    console.log('e.currenttargetId:', e.currentTarget.id);
    const idToFilter = e.currentTarget.id.split('-')[2];
    const beforeRemove = this.state.uploadedImages;
    const imageFilesBeforeRmv = this.state.imageFiles;
    const imagesBeforeRemove = this.state.images;
    const afterRemove = beforeRemove.slice(0, idToFilter).concat(beforeRemove.slice(idToFilter + 1));
    const imageFilesAfterRemove = imageFilesBeforeRmv.slice(0, idToFilter).concat(imageFilesBeforeRmv.slice(idToFilter + 1));
    const imagesAfterRemove = imagesBeforeRemove.slice(0, idToFilter).concat(imagesBeforeRemove.slice(idToFilter + 1));

    this.setState({
      uploadedImages: afterRemove,
      imageFiles: imageFilesAfterRemove,
      images: imagesAfterRemove,

    });
  }

  passStarRating(overallRating) {
    console.log('this is the overall rating:', overallRating);
    this.setState({ starRating: overallRating });
  }

  passCharRating(charRating) {
    console.log('this is the characteristics rating data:', charRating);
    // convert the key to the corresponding id:
    const charRatingConverted = {};
    for (const key in charRating) {
      if (charRating[key].length) {
        const charKeyId = this.props.currentMeta.characteristics[key].id;
        charRatingConverted[charKeyId] = Number(charRating[key]);
      }
    }
    console.log('this is processed:', charRatingConverted);
    this.setState({ characteristics: charRatingConverted });
  }

  postReview(reviewObj) {
    axios.post('/reviews', reviewObj)
      .then((response) => {
        console.log('Review posted!', response);
      }).catch((err) => console.log('can not post review!', err));
  }

  validationInput() {
    if (this.state.starRating) {
      this.setState({
        overallRatingErr: false,
      });
    }
    if (Object.keys(this.state.characteristics).length === Object.keys(this.props.currentMeta.characteristics).length) {
      this.setState({
        CharacteristicsErr: false,
      });
    }
    if (this.state.ReviewBody.length >= 50) {
      this.setState({
        reviewBodyErr: false,
      });
    }
    if (this.state.nickeName) {
      this.setState({
        nickenameErr: false,
      });
    }
    if (this.state.Email) {
      this.setState({
        EmailEmpty: false,
      });
    }
    if (this.state.Email) {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.Email)) {
        this.setState({
          EmailFormatErr: false,
        });
      }
    }
  }

  async submitBtnClick(e) {
    e.preventDefault();
    await (this.validationInput());

    if (this.state.overallRatingErr || this.state.CharacteristicsErr || this.state.reviewBodyErr || this.state.nickenameErr || this.state.EmailEmpty || this.state.EmailFormatErr) {
      this.setState({ hasError: true });
    } else {
      const reviewObj = {};
      // eslint-disable-next-line camelcase
      reviewObj.product_id = Number(this.state.currentItemId);
      reviewObj.rating = this.state.starRating;
      reviewObj.summary = this.state.summary;
      reviewObj.body = this.state.ReviewBody;
      if (this.state.recommendStatus === 'yes') {
        reviewObj.recommend = true;
      } else {
        reviewObj.recommend = false;
      }
      reviewObj.name = this.state.nickeName;
      reviewObj.email = this.state.Email;
      reviewObj.photos = this.state.uploadedImages;
      reviewObj.characteristics = this.state.characteristics;
      console.log(reviewObj);

      this.postReview(reviewObj);
      this.setState({ posted: true, hasError: false });
      this.props.refresh();
    }
  }

  render() {
    return (
      // <WithTrackerHOC eventName={'AddNewReviewModal'}>
      <>
        <div className={AddNewReviewModalCSS.dimmerBg} />
        <div data-testid="addNewModal" id="add-new-review-modal-main" className={AddNewReviewModalCSS.modalContainer}>
          <h3>Write Your Review</h3>
          <div className={AddNewReviewModalCSS.ModalScroller}>
            <form>

              <div id="AddNewReviewModal-product-name">
                About
                {' '}
                <span style={{ color: 'blue', fontWeight: 'bolder' }}>{this.state.currentItemName}</span>
              </div>

              <div name="rating" id="AddNewReviewModal-Overall-star-rating">
                <br />
                <b>Overall Rating *</b>

                <AddStarRating passStarRating={this.passStarRating.bind(this)} />

              </div>
              <br />

              <div id="AddNewReviewModal-recommend">
                <label>
                  <b>Do you recommend this product? *</b>
                  {' '}
                </label>
                <input type="radio" value="yes" name="recommend" checked={this.state.recommendStatus === 'yes'} onChange={(e) => this.onValueChange(e)} />
                {' '}
                Yes
                <input type="radio" value="no" name="recommend" checked={this.state.recommendStatus === 'no'} onChange={(e) => this.onValueChange(e)} />
                {' '}
                No
              </div>
              <br />

              <CharacteristicsForm currentMeta={this.props.currentMeta} passCharRating={this.passCharRating.bind(this)} />
              <br />

              <div id="AddNewReviewModal-review-content">
                <label>
                  <b>Review Summary</b>
                  {' '}
                </label>
                <br />
                <textarea id="AddNewReviewModal-review-summary" style={{ width: '60%' }} type="text" name="summary" placeholder="Example: Best purchase ever!" maxLength="60" onChange={(e) => this.setState({ summary: e.target.value })} />
              </div>
              <div>
                <label><b>Review Body *</b></label>
                <br />
                <textarea id="AddNewReviewModal-review-body" style={{ width: '60%' }} type="text" name="body" placeholder="Why did you like the product or not?" maxLength="1000" rows="4" onChange={(e) => this.setState({ ReviewBody: e.target.value })} />
                <br />
                {this.state.ReviewBody.length < 50
                  ? (
                    <span style={{ color: 'red', fontSize: '10pt' }}>
                      <i>
                        Minimum required characters left:
                        {' '}
                        {50 - this.state.ReviewBody.length}
                      </i>
                    </span>
                  )
                  : (
                    <span style={{ color: 'blue', fontSize: '10pt' }}>
                      Minimum reached!
                      {' '}
                      {1000 - this.state.ReviewBody.length}
                      {' '}
                      characters to reach maximum length
                    </span>
                  )}
              </div>

              <div id="AddNewReviewModal-imageUploader">
                <h4>Upload your photos (up to 5) </h4>
                {this.state.uploadedImages.length

                  ? (
                    <div className={AddNewReviewModalCSS.imageBox}>
                      {this.state.uploadedImages.map((photo, index) => (
                        <div className={AddNewReviewModalCSS.imageEntryContainer} key={`uploadImg${index}`}>
                          <span
                            className={AddNewReviewModalCSS.removeBtn}
                            id={`remove-btn-${index}`}
                            onClick={
                              (e) => {
                                this.removeBtnClick(e);
                              }
                            }
                          >
                            {' '}
                            &#215;
                          </span>

                          <img className={AddNewReviewModalCSS.photoThumbnail} src={photo} />

                        </div>

                      ))}

                    </div>
                  )
                  : (
                    <div>
                      no photo yet
                      <br />
                    </div>
                  )}

                {this.state.images.length < 5
                  ? (
                    <div>
                      <br />
                      <label htmlFor="AddNewReviewModal-fileUpload">

                        <div id="AddNewReviewModal-addBtn" className={AddNewReviewModalCSS.addBtn}>
                          +
                        </div>
                      </label>
                      <input hidden id="AddNewReviewModal-fileUpload" type="file" onChange={this.onImageChange.bind(this)} accept="image/*" />

                    </div>
                  )
                  : null}

              </div>
              <br />

              <div id="AddNewReviewModal-user-info">
                <label><b>What is your nickname *</b></label>
                <input id="AddNewReviewModal-nickname-input" type="text" name="name" placeholder="Example: jackson11!" onChange={(e) => this.setState({ nickeName: e.target.value })} />
                <br />
                <label><b>Your Email *</b></label>
                <input id="AddNewReviewModal-email-input" type="text" name="email" placeholder="Example: jackson11@email.com" onChange={(e) => this.setState({ Email: e.target.value })} />
                <p style={{ fontSize: '10pt' }}>For authentication reasons, you will not be emailed</p>

              </div>
              {this.state.posted ? <div>Review posted!</div> : null}

              <button className={AddNewReviewModalCSS.button} data-testid="submitReview" id="AddNewReviewModal-submit-review-btn" onClick={(e) => this.submitBtnClick(e)}>Submit Review</button>

              {/* input content validation */}
              {this.state.hasError
                ? (
                  <div id="submissionError" data-testid="AddNewReviewModal-submissionErrorMsg" className={AddNewReviewModalCSS.errMsg}>
                    You must fix the following errors:
                    <br />
                    {this.state.overallRatingErr
                      ? <li>OverallRating empty</li>
                      : null}
                    {this.state.CharacteristicsErr
                      ? <li>Characteristics empty</li>
                      : null}
                    {this.state.reviewBodyErr
                      ? <li>Review Body is less than 50 chars</li>
                      : null}
                    {this.state.uploadErr
                      ? <li>Image upload error</li>
                      : null}
                    {this.state.nickenameErr
                      ? <li>Nickname empty</li>
                      : null}
                    {this.state.EmailEmpty
                      ? <li>Email empty</li>
                      : null}
                    {this.state.EmailFormatErr
                      ? <li>Email format Error</li>
                      : null}

                  </div>
                )

                : null}

              <div id="AddNewReviewModal-close-modal-btn" data-testid="closeModal" className={AddNewReviewModalCSS.removeBtn2} onClick={(e) => this.props.handleCancelClick(e)}>&#215;</div>

            </form>

          </div>

        </div>
      </>

    );
  }
}

export default AddNewReviewModal;
