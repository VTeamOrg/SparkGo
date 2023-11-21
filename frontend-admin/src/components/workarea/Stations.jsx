import React, { useState, useEffect } from 'react';
import './ApiTables.css';

/**
 * Stations component to display station information.
 */
function Stations() {
  /* State to store station data */
  const [stations, setStations] = useState([]);

  /* State to store station coordinates */
//  const [coordinates, setCoordinates] = useState([]);

  /* should this by dynamic?? */
  /* API URL to fetch station data */
  const apiUrl = 'http://localhost:1337/stations';
  
  /* Effect to fetch station data when the component mounts */
  useEffect(() => {
    /**
     * Fetches station data from the API.
     */
    const fetchStations = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch station data');
        }
        const data = await response.json();
        setStations(data.data);
        // Format the data into markers
        const formattedMarkers = data.data.map((station) => ({
          lat: station.coords_lat,
          lng: station.coords_long,
          infoText: station.name,
          id: station.id,
        }));

        // Emit an event with the formatted markers data
        const event = new CustomEvent('stationsDataLoaded', { detail: formattedMarkers });
        window.dispatchEvent(event);
        console.log(formattedMarkers);
      } catch (error) {
        console.error('Error fetching station data:', error);
      }
    };
  
    /* Call fetchStations when the component mounts */
    fetchStations();
  }, []);

  /* JSX to render station data */
  return (
    <div className="stations">
      <h2>Stations</h2>
      <table className="station-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Coordinates</th>
            <th>City ID</th>
            {/* Add additional table headers as needed */}
          </tr>
        </thead>
        <tbody>
          {stations.map((station) => (
            <tr key={station.id} className="station-row">
              <td className="station-name">{station.name}</td>
              <td className="station-coordinates">
                ({station.coords_lat}, {station.coords_long})
              </td>
              <td className="station-city-id">{station.city_id}</td>
              {/* Add additional table cells for additional information */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  
  
}

export default Stations;
