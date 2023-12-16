import React, { useState } from 'react';
import './Login.css';

function Login({ setUserLoggedIn }) {

  /* logged in state from app.js to handle conditional navbar and work area */
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleGoogleClick = () => {
    console.log('Google button clicked');
  };
  const handleLoginClick = () => {
    /* perform authentication here */
    setIsLoggedIn(true);

    /* Update userLoggedIn state in App.js */
    setUserLoggedIn(true);
    console.log('Login button clicked');
  };

  return (
    <div className="login-container">
        <div className="login-box">
          <h2>
            Spark<span style={{ color: 'black' }}>GO</span>
            <br></br>
            <span style={{ color: 'black' }}>Admin</span> portal
          </h2>
          <h3>Your two-wheeled adventure</h3>
          <div className="button-container">

          <button onClick={handleGoogleClick} className="blue-button button-text"> 
            <div className="button-content">
              <span>Continue with Google ?</span>
            </div>
          </button>         

          <br></br>

          <button onClick={handleLoginClick} className="blue-button button-text">
            <span>Login</span>
          </button>

          </div>
        </div>
    </div>
  );
}

export default Login;
