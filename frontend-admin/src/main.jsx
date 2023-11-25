import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import './index.css';


console.log('main.js: Start rendering App component');
ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
);
console.log('main.js: Finish rendering App component');
