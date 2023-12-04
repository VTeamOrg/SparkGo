import React from 'react';
import './Navbar.css';

function Navbar({ setActiveSection }) {

    const handleLogout = () => {
        /* Reload the page to go back to the beginning */
        window.location.reload();
      };

      const handleLinkClick = (section) => {
        setActiveSection(section);
    
        // Dispatch a custom event to signal the MapView component
        const event = new CustomEvent('clearMarkers');
        window.dispatchEvent(event);
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
            <button onClick={() => handleLinkClick('myAccount')}>My Account</button>
            <button onClick={() => handleLinkClick('rideHistory')}>Ride History</button>
            <button onClick={() => handleLinkClick('receipts')}>Receipts</button>
            <button onClick={() => handleLinkClick('cities')}>Cities</button>
            <button onClick={() => handleLinkClick('stations')}>Stations</button>
            <button onClick={() => handleLinkClick('vehicles')}>Vehicles</button>
            <button onClick={() => handleLinkClick('customers')}>Customers</button>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      );
}

export default Navbar;