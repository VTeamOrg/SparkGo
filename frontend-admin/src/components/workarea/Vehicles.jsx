import React, { useState, useEffect } from 'react';
import './ApiTables.css';
import { fetchData, createData, deleteData, updateData } from '../support/FetchService';
import AddVehicleModal from './AddVehicleModal'; 
import EditVehicleModal from './EditVehicleModal'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showEditVehicleModal, setShowEditVehicleModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  useEffect(() => {
    fetchDataUpdateState();
  }, []);

  const fetchDataUpdateState = () => {
    fetchData('vehicles', (data) => {
      setVehicles(data);
    });
  };

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowEditVehicleModal(true);
  };

  const handleAddVehicle = () => {
    setShowAddVehicleModal(true);
  };

  const handleUpdateVehicle = async (editedVehicle) => {
    try {
      await updateData('vehicles', editedVehicle.id, editedVehicle);
      fetchDataUpdateState();
    } catch (error) {
      console.error('Error updating vehicle:', error.message);
    }

    setShowEditVehicleModal(false);
  };

  const handleSaveVehicle = async (newVehicle) => {
    try {
      await createData('vehicles', newVehicle);
      fetchDataUpdateState();
    } catch (error) {
      console.error('Error creating vehicle:', error.message);
    }

    setShowAddVehicleModal(false);
  };

  const handleDeleteVehicle = async (vehicleId) => {
    try {
      await deleteData('vehicles', vehicleId);
      fetchDataUpdateState();
    } catch (error) {
      console.error('Error deleting vehicle:', error.message);
    }
  };

  return (
    <div className="api">
      <h2>Vehicles</h2>
      <button onClick={handleAddVehicle}>Add Vehicle</button>

      <table className="api-table">
        <thead>
          <tr>
            <th>Vehicle ID</th>
            <th>City ID</th>
            <th>Type ID</th>
            <th>Rented By</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id} className="api-row">
              <td className="api-name">{vehicle.id}</td>
              <td className="api-coordinates">{vehicle.city_id}</td>
              <td className="api-city-id">{vehicle.type_id}</td>
              <td className="api-rented-by">{vehicle.rented_by}</td>
              <td className="api-edit">
                <button onClick={() => handleEditVehicle(vehicle)}>
                  <FontAwesomeIcon icon={faPencilAlt} />
                </button>
              </td>
              <td className="api-delete">
                <button onClick={() => handleDeleteVehicle(vehicle.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* AddVehicleModal component */}
      <AddVehicleModal
        isOpen={showAddVehicleModal}
        onRequestClose={() => setShowAddVehicleModal(false)}
        onSave={handleSaveVehicle}
      />

      {/* EditVehicleModal component */}
      {editingVehicle && (
        <EditVehicleModal
          isOpen={showEditVehicleModal}
          onRequestClose={() => setShowEditVehicleModal(false)}
          onSave={handleUpdateVehicle}
          vehicle={editingVehicle}
        />
      )}
    </div>
  );
}

export default Vehicles;
