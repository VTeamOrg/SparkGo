import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { CookiesProvider } from 'react-cookie';
import Init from './GStore.jsx';

import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Init />
    <BrowserRouter>
      <CookiesProvider>
        <ToastContainer />
        <App />
      </CookiesProvider>
    </BrowserRouter>
  </React.StrictMode>
)
