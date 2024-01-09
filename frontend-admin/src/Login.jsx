import React, { useState } from 'react';
import googleButton from '../assets/google_signin_buttons/web/1x/btn_google_signin_dark_pressed_web.png';
import './Login.css';

function Login({ setUserLoggedIn }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Navigate to a given URL
  const navigate = (url) => {
    window.location.href = url;
  };

  // Authenticate with Google OAuth
  const auth = async () => {
    try {
      const response = await fetch('http://localhost:3000/v1/request', { method: 'POST' });
      const data = await response.json();
      navigate(data.url);
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  };

  const handleGoogleClick = () => {
    auth();
  };

  const handleLoginClick = () => {
    setIsLoggedIn(true);
    setUserLoggedIn(true);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>
          Spark<span style={{ color: 'black' }}>GO</span>
          <br />
          <span style={{ color: 'black' }}>Admin</span> portal
        </h2>
        <h3>Your two-wheeled adventure</h3>
        <div className="button-container">
          <button onClick={handleGoogleClick} className="blue-button button-text"> 
            <img src={googleButton} alt='Google Sign In'/>
          </button>

          <br />

          <button onClick={handleLoginClick} className="blue-button button-text">
            <span>Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;