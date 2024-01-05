import React, { useState, useEffect } from 'react';
import googleButton from './assets/google_signin_buttons/web/1x/btn_google_signin_dark_pressed_web.png';
import './Login.css';

function Login({ setUserLoggedIn }) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    console.log('User logged in:', userLoggedIn);

    if (userLoggedIn === 'true') {
      setUserLoggedIn(true);
    }
  }, [setUserLoggedIn]);

  // Function to authenticate with Google OAuth
  const auth = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/v1/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
  
      if (data.url) {
        localStorage.setItem('userLoggedIn', 'true');
  
        if (data.userByEmail) {
          const userByEmail = data.userByEmail;
          localStorage.setItem('userId', userByEmail.id); // Store user ID
  
          // Set user as logged in
          setUserLoggedIn(true);
        }
  
        window.location.href = data.url;
      } else {
        console.error('Authentication URL not received:', data.error);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setIsLoading(false);
    }
  };

  const handleGoogleClick = () => {
    auth();
  };

  const handleLogin = () => {
    // Set user as logged in
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
          <button
            onClick={handleGoogleClick}
            className={`blue-button button-text ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : <img src={googleButton} alt="Google Sign In" />}
          </button>

          <br />

          <button
            onClick={handleLogin}
            className="blue-button button-text"
          >
            <span>Login (cheat, auto login)</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
