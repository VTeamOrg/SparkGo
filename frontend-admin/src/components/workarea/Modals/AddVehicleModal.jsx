import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../CSS/Modal.css';
import { createData, fetchData } from '../../support/FetchService';

function AddVehicleModal({ isOpen, onRequestClose, onSave }) {
  const [newVehicle, setNewVehicle] = useState({
    city_id: '',
    type_id: '',
    name: '',
    status: 1, 
  });

  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetchData('vehicleTypes', (data) => {
      setVehicleTypes(data);
    });
    fetchData('cities', (data) => {
      setCities(data);
    });
  }, []);

  const handleAddVehicle = () => {
    // Ensure that 'status' is always 1
    const newVehicleWithStatus = { ...newVehicle, status: 1 };

    createData('vehicles', newVehicleWithStatus)
      .then(() => {
        onSave(newVehicleWithStatus);
        onRequestClose();
      })
      .catch((error) => {
        console.error('Error adding vehicle:', error);
      });
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="add-vehicle-modal">
      <h2>Add Vehicle</h2>
      <div>
        <label>City:</label>
        <select
          value={newVehicle.city_id}
          onChange={(e) => setNewVehicle({ ...newVehicle, city_id: e.target.value })}
          required
        >
          <option value="" disabled>
            Select City
          </option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Vehicle Type:</label>
        <select
          value={newVehicle.type_id}
          onChange={(e) => setNewVehicle({ ...newVehicle, type_id: e.target.value })}
          required
        >
          <option value="" disabled>
            Select Vehicle Type
          </option>
          {vehicleTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={newVehicle.name}
          onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
          required
        />
      </div>
      <div>
        <button onClick={handleAddVehicle}>Add Vehicle</button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
    </Modal>
  );
}

export default AddVehicleModal;
