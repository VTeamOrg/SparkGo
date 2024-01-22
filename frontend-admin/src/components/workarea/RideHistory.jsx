import { useState, useEffect } from 'react';


/**
 * RideHistory component for displaying a list of ride history entries.
 * @returns {JSX.Element} JSX representing the ride history component.
 */
function RideHistory() {
  /**
   * State to store the ride history data.
   * @type {Array}
   */    
  const [rideHistory, setRideHistory] = useState([]);

    /**
     * Simulated ride history data.
     * @type {Array}
     */
  useEffect(() => {
    const fetchedRideHistory = [
      {
        id: 1,
        startingPosition: '123 Main St, City A',
        endingPosition: '456 Elm St, City B',
        type: 'bike',
        timeElapsed: '1 hour 30 minutes',
        distanceTraveled: '20 miles',
        charge: '50.00 SEK',
        date: '2023-11-01',
      },
      {
        id: 2,
        startingPosition: '789 Oak St, City C',
        endingPosition: '987 Pine St, City D',
        type: 'scooter',
        timeElapsed: '2 hours',
        distanceTraveled: '25 miles',
        charge: '60.00 SEK',
        date: '2023-10-25',
      },
    ];

    /**
     * Sort ride history by date (most recent first).
     */
    fetchedRideHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

    /**
     * Set the ride history data in state.
     */
    setRideHistory(fetchedRideHistory);
  }, []);

  /* JSX to render data */
  return (
    <div className="misc-history">
      <h2>Ride History</h2>
      <ul>
        {rideHistory.map((ride) => (
          <li key={ride.id} className="history-entry">
            <h3 className="history-heading">{ride.type} - {ride.date}</h3>
            <p><strong>Starting Position:</strong> {ride.startingPosition}</p>
            <p><strong>Ending Position:</strong> {ride.endingPosition}</p>
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
