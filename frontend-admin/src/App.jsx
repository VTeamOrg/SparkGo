import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Navbar from './components/Navbar';
import WorkArea from './components/WorkArea';
import MapView from './components/MapView';

function App() {  
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

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