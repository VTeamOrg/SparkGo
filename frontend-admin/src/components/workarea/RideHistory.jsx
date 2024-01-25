import { useState, useEffect } from 'react';
import { fetchData, createData, deleteData, updateData } from '../support/FetchService';

/**
 * RideHistory component for displaying a list of ride history entries.
 * @returns {JSX.Element} JSX representing the ride history component.
 */
function RideHistory() {
  const [rideHistory, setRideHistory] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);

  useEffect(() => {
    const fetchedRideHistory = [
      {
        id: 1,
        startingPosition: [56.1610, 15.5848],
        endingPosition: [56.1750, 15.5890],
        type: 'bike',
        timeElapsed: '1 hour 30 minutes',
        distanceTraveled: '20 miles',
        charge: '50.00 SEK',
        date: '2023-11-01',
      },
      {
        id: 2,
        startingPosition: [56.1703, 15.5850],
        endingPosition: [56.1806, 15.6000],
        type: 'scooter',
        timeElapsed: '2 hours',
        distanceTraveled: '25 miles',
        charge: '60.00 SEK',
        date: '2023-10-25',
      },
    ];

    fetchedRideHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
    setRideHistory(fetchedRideHistory);

    
    fetchData('stations',(stationsData) => {
      /* Update the component's state with station data */
      /* Format the data into markers */
      const formattedMarkers = stationsData.map((station) => ({
        lat: station.coords_lat,
        lng: station.coords_long,
        infoText: station.name,
        id: station.id,
        cityName: station.city_name,
      }));

      /* Emit an event with the formatted markers data */
      const event = new CustomEvent('stationsDataLoaded', { detail: formattedMarkers });
      window.dispatchEvent(event);
    });
    
  }, []);

  const handleRideClick = (ride) => {
    setSelectedRide(ride);

    console.log(ride);
    // Emit the event with start and end coordinates
    const startCoords = ride.startingPosition;
    const endCoords = ride.endingPosition;

    console.log(startCoords);

    console.log(endCoords);

    const rideDataEvent = new CustomEvent('rideDataLoaded', {
      detail: { startCoords, endCoords },
    });
    window.dispatchEvent(rideDataEvent);
  };

  return (
    <div className="misc-history">
      <h2>Ride History</h2>
      <ul>
        {rideHistory.map((ride) => (
          <li
            key={ride.id}
            className={`history-entry ${ride === selectedRide ? 'selected' : ''}`}
            onClick={() => handleRideClick(ride)}
          >
            <h3 className="history-heading">{ride.type} - {ride.date}</h3>
            <p><strong>Starting Position:</strong> {ride.startingPosition.join(', ')}</p>
            <p><strong>Ending Position:</strong> {ride.endingPosition.join(', ')}</p>
            <p><strong>Time Elapsed:</strong> {ride.timeElapsed}</p>
            <p><strong>Distance Traveled:</strong> {ride.distanceTraveled}</p>
            <p><strong>Charge:</strong> {ride.charge}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RideHistory;
