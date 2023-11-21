import React, { useEffect } from 'react';
import MyAccount from './workarea/MyAccount'; 
import RideHistory from './workarea/RideHistory'; 
import Receipts from './workarea/Receipts'; 
import Cities from './workarea/Cities'; 
import Stations from './workarea/Stations'; 

function WorkArea({ activeSection }) {

  /* Emit an event when a new section is selected */
  useEffect(() => {
    const event = new CustomEvent('sectionSelected', { detail: activeSection });
    window.dispatchEvent(event);
  }, [activeSection]);

    const renderContent = () => {
      switch (activeSection) {
        case 'myAccount':
          return <MyAccount />;
        case 'rideHistory':
          return <RideHistory />;
        case 'receipts':
          return <Receipts />;
        case 'cities':
          return <Cities />;  
        case 'stations':
          return <Stations />;  
        case 'vehicles':
          return <div>Vehicles Content</div>;
        case 'customers':
          return <div>Customers Content</div>;
        default:
          return null;
      }
    };
  
    return (
      <div className="work-area">
        {renderContent()}
      </div>
    );
  }

export default WorkArea;