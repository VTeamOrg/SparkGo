import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './Login';
import Navbar from './components/Navbar';
import WorkArea from './components/WorkArea';
import MapView from './components/MapView';
import axios from 'axios';
import { API_URL } from '../config';

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if the user is logged in and is an admin
    axios.get(`${API_URL}/v1/auth/check-admin`)
    .then((response) => {
      const { isLoggedIn, isAdmin } = response.data;
      if (isLoggedIn && isAdmin) {
        setUserLoggedIn(true);
        console.log("admin!");
      }
    });
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
