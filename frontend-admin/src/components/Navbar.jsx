import PropTypes from 'prop-types';
import './Navbar.css';

function Navbar({ setActiveSection, userRole }) {
  const handleLogout = async () => {
    // Send a request to the backend to clear cookies
    await fetch('http://localhost:3000/v1/logout', {
      method: 'GET',
      credentials: 'include', // Important to include credentials
    });

    // Redirect to the login page or home page
    window.location.href = 'http://localhost:5173/';
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
        <button onClick={() => handleLinkClick('plans')}>Plans</button>
        {userRole === 'admin' && (
          <>
            <button onClick={() => handleLinkClick('cities')}>Cities</button>
            <button onClick={() => handleLinkClick('stations')}>Stations</button>
            <button onClick={() => handleLinkClick('vehicleTypes')}>Vehicle types</button>
            <button onClick={() => handleLinkClick('vehicles')}>Vehicles</button>
            <button onClick={() => handleLinkClick('priceList')}>Price lists</button>
            <button onClick={() => handleLinkClick('frequencies')}>Frequencies</button>
            <button onClick={() => handleLinkClick('members')}>Members</button>
          </>
        )}
      </div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

Navbar.propTypes = {
  setActiveSection: PropTypes.func.isRequired,
  userRole: PropTypes.string.isRequired,
};

export default Navbar;