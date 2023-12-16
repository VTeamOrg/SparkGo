import React, { useEffect } from 'react';
import MyAccount from './workarea/MyAccount'; 
import RideHistory from './workarea/RideHistory'; 
import Receipts from './workarea/Receipts'; 
import Cities from './workarea/Cities'; 
import Stations from './workarea/Stations'; 
import VehicleTypes from './workarea/VehicleTypes'; 
import PriceList from './workarea/PriceList'; 
import Plans from './workarea/Plans'; 
import Frequencies from './workarea/Frequencies'; 
import Members from './workarea/Members'; 
import { emitEnableMapEvent, emitDisableMapEvent } from './support/MapUtils';


function WorkArea({ activeSection }) {
  useEffect(() => {
    console.log("active: ", activeSection);
    /* Emit the appropriate map event based on the selected section */
    if (activeSection === 'myAccount' || activeSection === 'vehicleTypes'
    || activeSection === 'priceList' || activeSection === 'plans'
    || activeSection === 'frequencies' || activeSection === 'members') {
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
        case 'priceList':
          return <PriceList />; 
        case 'plans':
          return <Plans />;     
        case 'frequencies':
          return <Frequencies />;             
        case 'members':
          return <Members />;
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