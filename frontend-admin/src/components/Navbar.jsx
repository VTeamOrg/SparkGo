import React from 'react';
import './Navbar.css';

function Navbar({ setActiveSection }) {

    const handleLogout = () => {
        /* Reload the page to go back to the beginning */
        window.location.reload();
      };

      return (
        <div className="navbar">
          <div className="title-container">
            <h2>
              Spark
              <span style={{ color: 'black' }}>GO</span>
            </h2>
          </div>
          <div className="top-buttons">
            <button onClick={() => setActiveSection('myAccount')}>My Account</button>
            <button onClick={() => setActiveSection('rideHistory')}>Ride History</button>
            <button onClick={() => setActiveSection('receipts')}>Receipts</button>
            <button onClick={() => setActiveSection('cities')}>Cities</button>
            <button onClick={() => setActiveSection('stations')}>Stations</button>
            <button onClick={() => setActiveSection('vehicles')}>Vehicles</button>
            <button onClick={() => setActiveSection('customers')}>Customers</button>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      );
}

export default Navbar;