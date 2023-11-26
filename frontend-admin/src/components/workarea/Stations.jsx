import React, { useState, useEffect } from 'react';
import './ApiTables.css';
import { fetchStationsData } from './FetchService';
import AddStationModal from './AddStationModal'; 

/**
 * Stations component to display station information.
 */
function Stations() {
  /* State to store station data */
  const [stations, setStations] = useState([]);

  const [showAddStationModal, setShowAddStationModal] = useState(false);
  
  /* Effect to fetch station data when the component mounts */
  useEffect(() => {
    /* Fetch station data */
    fetchStationsData((data) => {
      /* Update the component's state with station data */
      setStations(data);

      /* Format the data into markers */
      const formattedMarkers = data.map((station) => ({
        lat: station.coords_lat,
        lng: station.coords_long,
        infoText: station.name,
        id: station.id,
        cityName: station.city_name
      }));

      /* Emit an event with the formatted markers data */
      const event = new CustomEvent('stationsDataLoaded', { detail: formattedMarkers });
      window.dispatchEvent(event);

    });
  }, []);


  const handleAddStation = () => {
    setShowAddStationModal(true);
  };

  const handleSaveStation = (newStation) => {
    // Save the new station data to your backend or update the state as needed
    // You can make an API request to add the station here
    // Example: POST request to add the new station

    // Close the modal
    setShowAddStationModal(false);

    // You can also update the stations state if needed
    // setStations([...stations, newStation]);
  };

  /* JSX to render station data */
  return (
    <div className="stations">
      <h2>Stations</h2>
      <button onClick={handleAddStation}>Add Station</button>
      <table className="station-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Coordinates</th>
            <th>City</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((station) => (
            <tr key={station.id} className="station-row">
              <td className="station-name">{station.name}</td>
              <td className="station-coordinates">
                ({station.coords_lat}, {station.coords_long})
              </td>
              <td className="station-city-id">{station.city_name}</td>
            </tr>
          ))}
        </tbody>
      </table>

            {/* AddStationModal component */}
            <AddStationModal
        isOpen={showAddStationModal}
        onRequestClose={() => setShowAddStationModal(false)}
        onSave={handleSaveStation}
      />
    </div>
  );
  
}

export default Stations;
