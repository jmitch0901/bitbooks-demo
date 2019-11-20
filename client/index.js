// global imports
import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './assets/styles/root.scss';

// React
import React from 'react';
import ReactDOM from 'react-dom';

//redux
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider, connect } from 'react-redux';

//reducers
import reducers from './reducers/index';

//middleware
import reduxThunk from 'redux-thunk';
//import { devTools, persistState } from 'redux-devtools';
const middleware = [reduxThunk];

const finalCreateStore = compose(applyMiddleware(...middleware))(createStore)(
  reducers
);

// configure axios interceptors
import * as HttpResponseInterceptor from './interceptors/HttpResponseInterceptor';
HttpResponseInterceptor.configureInterceptor(finalCreateStore);

// Root App
import App from './App';

ReactDOM.render(
  <Provider store={finalCreateStore}>
    <App />
  </Provider>,
  document.getElementById('root')
);
