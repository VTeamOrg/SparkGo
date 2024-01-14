import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../CSS/Modal.css';
import { fetchData } from '../../support/FetchService';
import AddVehicle from '../HTML/AddVehicle';
import PropTypes from 'prop-types';

/**
 * A modal component for adding a new vehicle.
 *
 * @param {Object} props - The component's props.
 * @param {boolean} props.isOpen - Whether the modal is open.
 * @param {Function} props.onRequestClose - Callback to close the modal.
 * @param {Function} props.onSave - Callback to save the new vehicle.
 */
function AddVehicleModal({ isOpen, onRequestClose, onSave }) {
  /**
   * Initial values for the new vehicle form.
   */
  const initialNewVehicle = {
    city_id: '',
    type_id: '',
    name: '',
    status: 1,
  };

  /**
   * State to manage the new vehicle form data.
   */
  const [newVehicle, setNewVehicle] = useState(initialNewVehicle);

  /**
   * State to store vehicle types fetched from the API.
   */
  const [vehicleTypes, setVehicleTypes] = useState([]);

  /**
   * State to store cities fetched from the API.
   */
  const [cities, setCities] = useState([]);

  /**
   * Fetch vehicle types and cities from the API on component mount.
   */
  useEffect(() => {
    fetchData('vehicleTypes', (data) => {
      setVehicleTypes(data);
    });
    fetchData('cities', (data) => {
      setCities(data);
    });
  }, []);

  /**
   * Handles the addition of a new vehicle.
   * Calls the onSave callback with the new vehicle data, resets the form, and closes the modal.
   */
  const handleAddVehicle = () => {
    onSave(newVehicle);
    setNewVehicle(initialNewVehicle);
    onRequestClose();
  };

  AddVehicleModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="add-vehicle-modal">
      <AddVehicle
        newVehicle={newVehicle}
        setNewVehicle={setNewVehicle}
        vehicleTypes={vehicleTypes}
        cities={cities}
        handleAddVehicle={handleAddVehicle}
        onRequestClose={onRequestClose}
      />
    </Modal>
  );
}

export default AddVehicleModal;
