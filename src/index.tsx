import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './i18n';
import { BrowserRouter } from 'react-router-dom';
// import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);
