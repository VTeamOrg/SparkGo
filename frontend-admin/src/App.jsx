import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './Login';
import Navbar from './components/Navbar';
import WorkArea from './components/WorkArea';
import MapView from './components/MapView';

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in based on the presence of a JWT token
/*    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setUserLoggedIn(true);
    } */
  }, []);

  return (
    <div className="App">
      {userLoggedIn ? (
        <div className="app-container">
          <div className="navbar">
            <Navbar setActiveSection={setActiveSection} />
          </div>
          <div className="content">
            <WorkArea activeSection={activeSection} />
          </div>
          <div className="mapview">
            <MapView />
          </div>
        </div>
      ) : (
        <Login setUserLoggedIn={setUserLoggedIn} />
      )}
    </div>
  );
}

export default App;
