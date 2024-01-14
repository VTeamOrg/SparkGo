import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../CSS/Modal.css';
import { updateData, fetchData } from '../../support/FetchService';
import PropTypes from 'prop-types';

function EditVehicleModal({ isOpen, onRequestClose, onSave, vehicle }) {

    const [editedVehicle, setEditedVehicle] = useState({
        city_id: '',
        type_id: '',
        name: '',
        vehicle_status: '',
      });

  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    setEditedVehicle({
      city_id: vehicle.city_id,
      type_id: vehicle.type_id,
      name: vehicle.name,
      vehicle_status: vehicle.vehicle_status,
    });

    fetchData('vehicleTypes', (data) => {
      setVehicleTypes(data);
    });

    fetchData('cities', (data) => {
      setCities(data);
    });
  }, [vehicle]);

  const handleEditVehicle = () => {
    updateData('vehicles', vehicle.id, editedVehicle)
      .then(() => {
        onSave(editedVehicle);
        onRequestClose();
      })
      .catch((error) => {
        console.error('Error updating vehicle:', error);
      });
  };

  EditVehicleModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    vehicle: PropTypes.shape({
      id: PropTypes.number.isRequired,
      city_id: PropTypes.number.isRequired,
      type_id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      vehicle_status: PropTypes.string.isRequired,
    }).isRequired,
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="edit-vehicle-modal">
      <h2>Edit Vehicle</h2>
      <div>
        <label>City:</label>
        <select
          value={editedVehicle.city_id}
          onChange={(e) => setEditedVehicle({ ...editedVehicle, city_id: e.target.value })}
          required
        >
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
          value={editedVehicle.type_id}
          onChange={(e) => setEditedVehicle({ ...editedVehicle, type_id: e.target.value })}
          required
        >
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
          value={editedVehicle.name}
          onChange={(e) => setEditedVehicle({ ...editedVehicle, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Status:</label>
        <input
          type="text"
          value={editedVehicle.vehicle_status}
          onChange={(e) => setEditedVehicle({ ...editedVehicle, vehicle_status: e.target.value })}
          required
        />
      </div>
      <div>
        <button onClick={handleEditVehicle}>Save Changes</button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
    </Modal>
  );
}

export default EditVehicleModal;
