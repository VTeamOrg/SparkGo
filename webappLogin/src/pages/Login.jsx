import React, { useState, useEffect } from 'react';
import { curr_theme } from "../GStore";
import LoginBg from "../assets/login-bg.svg";
import LoginBgLight from "../assets/login-bg-light.svg";
import LoginBox from "../components/login/LoginBox";
import { useLocation } from 'react-router-dom'; // Import useLocation hook

const Login = () => {
  // useState and other hooks can now be used here
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [newUserMessage, setNewUserMessage] = useState("");
  const location = useLocation();

  return (
    <section
      className={`bg-bg_color w-full h-full`}
      style={{
        backgroundImage: `url(${curr_theme.value === "dark" ? LoginBg : LoginBgLight})`,
        backgroundSize: 'cover',
      }}
    >
        {newUserMessage && <p className="new-user-message">{newUserMessage}</p>}
      <LoginBox
        setUserLoggedIn={setUserLoggedIn}
        setUserRole={setUserRole}
        setUserId={setUserId}
      />
    </section>
  );
}

export default Login;