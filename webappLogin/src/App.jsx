import { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import Cookies from 'js-cookie';
import PageNotFound from "./pages/PageNotFound";
import Home from "./pages/Home";
import Login from "./pages/Login";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = Cookies.get('userLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" />;
};

const App = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const loggedInStatus = Cookies.get('userLoggedIn');
    if (loggedInStatus === 'true') {
      setUserLoggedIn(true);
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      <Route path="/login" element={<Login setUserLoggedIn={setUserLoggedIn} />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;