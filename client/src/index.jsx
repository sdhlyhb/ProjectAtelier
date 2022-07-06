import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
// import { createRoot } from 'react-dom/client';
import RatingsAndReviews from './components/RatingsAndReviews/RatingsAndReviews.jsx';
import QuestionsAndAnswers from './components/QuestionsAndAnswers/QuestionsAndAnswers.jsx';
import ProductOverview from './components/ProductOverview/index.jsx';
import RelatedProductsAndOutfits from './components/RelatedProductsAndOutfits/index.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentId: 71697,
      product: {},
      productStyle: {},
      questionsAndAnswers: {}
    };
  }

  componentDidMount () {
    let sampleId = 71697;
    this.getProduct(sampleId);
    this.getProductStyles(sampleId);
    this.getQuestions(sampleId);
  }

  getProduct (id) {
    let url = `/products/${id}`;
    axios.get(url)
      .then(result => {
        this.setState({product: result.data});
      })
      .catch(err => {
        console.log(err);
      });
  }

  getProductStyles (id) {
    let url = `/products/${id}/styles`;
    axios.get(url)
      .then(result => {
        this.setState({productStyle: result.data});
      })
      .catch(err => {
        console.log(err);
      });
  }

  getQuestions (id) {
    let url = `/products/${id}/questions/`;
    axios.get(url)
      .then(result => {
        this.setState({questionsAndAnswers: result.data});
      })
      .catch(error => {
        console.log(error);
      });
  }

  render () {
    return (
      <div>
        <ProductOverview
          currentId={this.state.currentId}
          product={this.state.product}
          productStyle={this.state.productStyle}/>
        <RelatedProductsAndOutfits />
        <QuestionsAndAnswers results={this.state.questionsAndAnswers}/>
        <RatingsAndReviews />

      </div>

    );
  }
}

// ReactDOM.render(<App />, document.getElementById('app'));


/*****Edit to make it compatible with latest react version**********/
ReactDOM.createRoot(document.getElementById('app')).render(<App />);
