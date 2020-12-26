import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Redux part
import { createStore,applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import AuthReducer from './store/reducers/auth'

import thunk from 'redux-thunk';


const store = createStore(AuthReducer,applyMiddleware(thunk)); 


const ReduxApp = (
  <Provider store={store}>
      <App />
  </Provider>
)

ReactDOM.render(
  <React.StrictMode>
    {ReduxApp }
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
