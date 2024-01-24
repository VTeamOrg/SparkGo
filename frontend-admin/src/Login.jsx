import { useState, useEffect } from 'react';
import googleButton from './assets/google_signin_buttons/web/1x/btn_google_signin_dark_pressed_web.png';
import './Login.css';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';


function Login({ setUserLoggedIn, setUserRole, setUserId }) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const validateSession = async () => {
      try {
        let response = await fetch('http://localhost:3000/v1/validate-session', {
          credentials: 'include',
        });
    
        if (!response.ok) {
          // If the first request fails, try the second endpoint
          response = await fetch('http://localhost:3000/v1/validate-session-user', {
            credentials: 'include',
          });
    
          if (!response.ok) {
            // If the second request also fails
            throw new Error(`Server responded with status: ${response.status}`);
          }
        }
    
        const data = await response.json();
  
        if (data.userLoggedIn) {
          setUserLoggedIn(true);
          setUserRole(Cookies.get('userRole'));
          setUserId(data.userId);
        } else {
          setUserLoggedIn(false);
          // Optionally, redirect non-logged-in users or show an error message
        }
      } catch (error) {
        console.error('Error during session validation:', error);
        setUserLoggedIn(false);
        // Handle the error
      }
    };
  
    validateSession();
  
    return () => {
      // Clear client-side cookies if needed
    };
  }, [setUserLoggedIn, setUserRole, setUserId]);

  const auth = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/v1/request?redirect=admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await response.json();

      console.log(data)

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Authentication URL not received:', data.error);
      }
    } catch (error) {
      console.error('Error during authentication:', error);
    } finally {
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
          {!Cookies.get('userLoggedIn') && (
            <button
              onClick={auth}
              className={`blue-button button-text ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : <img src={googleButton} alt="Google Sign In" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  setUserLoggedIn: PropTypes.func.isRequired,
  setUserRole: PropTypes.func.isRequired,
  setUserId: PropTypes.func.isRequired,
};

export default Login;