import React from 'react';
import './Login.css';

function Login() {
  // (dummy function for now)
  const handleGoogleClick = () => {
    console.log('Google button clicked');
  };
  const handleLoginClick = () => {
    console.log('Login button clicked');
  };

  return (
  <div className="login-container">
    <div className="login-box">

      <h2>
        Spark
        <span style={{ color: 'black' }}>GO</span>
      </h2>
      <h3>Your two-wheeled adventure</h3>

      <div className="button-container">
        <button onClick={handleGoogleClick} className="blue-button button-text">
          <div className="button-content">
            <img src={process.env.PUBLIC_URL + '/images/Google_logo.svg'} alt="Google Logo" />
            <span>Continue with Google</span>
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