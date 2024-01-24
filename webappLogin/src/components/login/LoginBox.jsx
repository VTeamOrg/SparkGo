import { useState, useEffect } from 'react';
import { FcGoogle } from "react-icons/fc";
import Button from "../Button";

const LoginBox = ({ setUserLoggedIn, setUserRole, setUserId }) => {
  // Assuming you need a state for isLoading
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const validateSession = async () => {
      try {
        const response = await fetch('http://localhost:3000/v1/validate-session-user', {
          credentials: 'include', // Ensures cookies are sent with the request
        });
        const data = await response.json();
  
        if (data.userLoggedIn) {
          setUserLoggedIn(true);
          setUserRole(data.userRole);
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

    // You can return a function here if you need to clean up anything when the component unmounts.
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

      if (data.newUserCreated) {
        window.location.href = `http://localhost:5173/login?newUser=true&email=${encodeURIComponent(data.userEmail)}`;
      } else if (data.url) {
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
    <div className="w-full flex flex-col gap-16 items-center absolute left-2/4 top-[40%] translate-x-[-50%] translate-y-[-40%]">
      {/* ... existing UI components ... */}
      <Button onClick={auth}>
        <FcGoogle className="text-5xl" />
        <p className={`font-bold text-black text-xl text-text_color`}>
          {isLoading ? 'Loading...' : 'Continue with Google'}
        </p>
      </Button>
    </div>
  );
};

export default LoginBox;