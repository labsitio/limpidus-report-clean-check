import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AppProvider from './hooks';
import Routes from './routes';
import { Loader } from './components';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Routes />
        <Loader />
        <ToastContainer position="top-right" autoClose={7000} />
      </Router>
    </AppProvider>
  );
};

export default App;
