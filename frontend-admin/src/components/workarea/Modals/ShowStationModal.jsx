import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../CSS/Modal.css';
import '../CSS/ApiTables.css';
import { fetchData } from '../../support/FetchService';
import PropTypes from 'prop-types';

Modal.setAppElement('#root');

function ShowStationModal({ isOpen, onRequestClose, stationId }) {
  const [vehicles, setVehicles] = useState([]);

  // Define a callback function to handle the response data
  const handleResponseData = (data) => {
    console.log(data);
    setVehicles(data[0]);
  };

  useEffect(() => {
    const getAllVehiclesByStationId = async () => {
      if (isOpen && stationId) {
        try {
          // Fetch vehicles by station ID using your API endpoint and pass the callback function
          fetchData(`vehicles/byStation/${stationId}`, handleResponseData);
        } catch (error) {
          console.error('Error fetching vehicles:', error);
        }
      }
    };

    getAllVehiclesByStationId();
  }, [isOpen, stationId]);

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="show-station-modal">
      <h2>Vehicles at Station {stationId}</h2>
      <div className="vehicle-list">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Name</th>
              <th>Type</th>
              <th>Rented</th>
              <th>Battery</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id}>
                <td>{vehicle.id}</td>
                <td>{vehicle.status}</td>
                <td>{vehicle.name}</td>
                <td>{vehicle.type_name}</td>
                <td>{vehicle.rentedBy}</td>
                <td>{vehicle.battery}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
}

ShowStationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  stationId: PropTypes.number.isRequired,
};

export default ShowStationModal;
