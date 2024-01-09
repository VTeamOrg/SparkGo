import React, { useState, useEffect } from 'react';
import googleButton from './assets/google_signin_buttons/web/1x/btn_google_signin_dark_pressed_web.png';
import './Login.css';
import Cookies from 'js-cookie';

function Login({ setUserLoggedIn }) {
  const [isLoading, setIsLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const successParam = urlParams.get('success');
  
    if (successParam === 'true') {
      setAuthSuccess(true);
      Cookies.set('userLoggedIn', 'true', { secure: true, sameSite: 'strict', expires: 1 });
      setUserLoggedIn(true);
  
      // Remove the 'success' parameter from the URL
      const newUrl = window.location.href.split('?')[0];
      window.history.replaceState({}, document.title, newUrl);
    } else if (successParam === 'false') {
      setAuthSuccess(false);
    }
  
    // Clear 'userLoggedIn' cookie when the component unmounts
    return () => {
      Cookies.remove('userLoggedIn', { secure: true, sameSite: 'strict' });
    };
  }, [setUserLoggedIn]);

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
          {!Cookies.get('userLoggedIn') ? (
            <button
              onClick={auth}
              className={`blue-button button-text ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : <img src={googleButton} alt="Google Sign In" />}
            </button>
          ) : null}
          <br />
          {authSuccess === true && (
            <p style={{ color: 'green' }}>Authentication successful!</p>
          )}
          {authSuccess === false && (
            <p style={{ color: 'red' }}>Authentication failed. Please try again.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
