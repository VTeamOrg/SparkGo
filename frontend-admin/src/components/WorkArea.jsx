import React, { useEffect } from 'react';
import MyAccount from './workarea/MyAccount'; 
import RideHistory from './workarea/RideHistory'; 
import Receipts from './workarea/Receipts'; 
import Cities from './workarea/Cities'; 
import Stations from './workarea/Stations'; 
import VehicleTypes from './workarea/VehicleTypes'; 
import PriceList from './workarea/PriceList'; 
import { emitEnableMapEvent, emitDisableMapEvent } from './support/MapUtils';


function WorkArea({ activeSection }) {
  useEffect(() => {
    console.log("active: ", activeSection);
    /* Emit the appropriate map event based on the selected section */
    if (activeSection === 'myAccount' || activeSection === 'vehicleTypes'
    || activeSection === 'pricingPlans') {
      emitDisableMapEvent(); 
    } else {
      emitEnableMapEvent(); 
    }
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
        case 'vehicleTypes':
          return <VehicleTypes />; 
        case 'vehicles':
          return <div>Vehicles Content</div>;
        case 'pricingPlans':
          return <PriceList />;   
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