import React, { useState, useEffect } from 'react';
import googleButton from './assets/google_signin_buttons/web/1x/btn_google_signin_dark_pressed_web.png';
import './Login.css';
import axios from 'axios';

function Login({ setUserLoggedIn }) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in
    const userLoggedIn = localStorage.getItem('userLoggedIn');
    console.log('User logged in:', userLoggedIn);

    if (userLoggedIn === 'true') {
      // Add a check here to make sure the user is an admin before setting userLoggedIn
      axios.get('http://localhost:3000/v1/auth/check-admin')
        .then((response) => {
          const { isLoggedIn, isAdmin } = response.data;
          if (isAdmin) {
            setUserLoggedIn(true);
          }
        })
        .catch((error) => {
          console.error('Error checking admin status:', error);
        });
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
        // localStorage.setItem('userLoggedIn', 'true'); // Don't set this here
  
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
        </div>
      </div>
    </div>
  );
}

export default Login;
