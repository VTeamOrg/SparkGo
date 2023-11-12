import React from 'react';

function WorkArea({ activeSection }) {
    const renderContent = () => {
      switch (activeSection) {
        case 'myAccount':
          return <div>My Account Content</div>;
        case 'rideHistory':
          return <div>Ride History Content</div>;
        case 'receipts':
          return <div>Receipts Content</div>;
        case 'stations':
          return <div>Stations Content</div>;
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