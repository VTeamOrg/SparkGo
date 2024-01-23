import React from 'react';
import './index.css';
// import ReactDOM from 'react-dom/client.js';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { CookiesProvider } from 'react-cookie';
import App from './App.jsx';
import MsgBox from './components/msgBox/MsgBox.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MsgBox />
    <BrowserRouter>
      <CookiesProvider>
        <ToastContainer />
        <App />
      </CookiesProvider>
    </BrowserRouter>
  </React.StrictMode>
)
