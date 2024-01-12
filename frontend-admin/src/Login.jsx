import React, { useState, useEffect } from 'react';
import googleButton from './assets/google_signin_buttons/web/1x/btn_google_signin_dark_pressed_web.png';
import './Login.css';
import Cookies from 'js-cookie';
import { refillWallet } from './components/support/Utils';

function Login({ setUserLoggedIn, setUserRole, setUserId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const successParam = urlParams.get('success');
    const roleParam = urlParams.get('role');
    const userIdParam = urlParams.get('userId');

    if (successParam === 'true') {
      setAuthSuccess(true);
      Cookies.set('userLoggedIn', 'true', { secure: true, sameSite: 'strict', expires: 1 });
      setUserLoggedIn(true);

      // Store the role and userId in state
      setUserRole(roleParam);
      setUserId(userIdParam);
      console.log("role", roleParam);
      console.log("userIdParam", userIdParam);

      // Remove the 'success', 'role', and 'userId' parameters from the URL
      const newUrl = window.location.href.split('?')[0];
      window.history.replaceState({}, document.title, newUrl);
    } else if (successParam === 'false') {
      setAuthSuccess(false);
    }

    // Check if the URL contains the 'stripe' parameter
    if (window.location.search.includes('stripe=success_wallet_refilled')) {
      // Get the 'refilledAmount' parameter from the URL
      const refilledAmount = urlParams.get('amount');
      const userId = urlParams.get('userId');

      // Call the refillWallet function with userId and refilledAmount
      refillWallet(userId, refilledAmount)
        .then(() => {
          // Close the window or handle the success as needed
          console.log("test");
//          window.close();
        })
        .catch((error) => {
          console.error('Error refilling wallet:', error);
          // Handle the error as needed
        });
    }

    // Clear 'userLoggedIn' cookie when the component unmounts
    return () => {
      Cookies.remove('userLoggedIn', { secure: true, sameSite: 'strict' });
    };
  }, [setUserLoggedIn, setUserRole, setUserId]);

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
