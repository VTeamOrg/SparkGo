import { useState, useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
import Cookies from 'js-cookie';
import PageNotFound from "./pages/PageNotFound";
import Home from "./pages/Home";
import Login from "./pages/Login";
// Import other components like Navbar, WorkArea, MapView if needed

const App = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loggedInStatus = Cookies.get('userLoggedIn');
    const role = Cookies.get('userRole');
    const id = Cookies.get('userId');

    if (loggedInStatus === 'true') {
      setUserLoggedIn(true);
      setUserRole(role);
      setUserId(id);
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={userLoggedIn ? <Home userRole={userRole} userId={userId} /> : <Login setUserLoggedIn={setUserLoggedIn} setUserRole={setUserRole} setUserId={setUserId} />} />
      <Route path="/login" element={<Login setUserLoggedIn={setUserLoggedIn} setUserRole={setUserRole} setUserId={setUserId} />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

export default App;