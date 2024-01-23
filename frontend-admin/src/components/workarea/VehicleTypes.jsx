import { useState, useEffect } from 'react';
import './CSS/Data.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash  } from '@fortawesome/free-solid-svg-icons';
import { fetchData, createData, deleteData, updateData } from '../support/FetchService';
import { SearchBar } from './HTML/General';

/**
 * Component for managing and displaying vehicle types.
 */
function VehicleTypes() {
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [newVehicleType, setNewVehicleType] = useState('');
  const [editingVehicleTypeId, setEditingVehicleTypeId] = useState(null);
  const [editedVehicleTypeName, setEditedVehicleTypeName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData('vehicleTypes', (data) => {
      setVehicleTypes(data);
    });
  }, []);

    /**
   * Handle adding a new vehicle type.
   */
  const handleAddVehicleType = () => {
    const newType = {
      name: newVehicleType,
    };

    createData('vehicleTypes', newType)
      .then((data) => {
        setVehicleTypes([...vehicleTypes, data]);
        setNewVehicleType('');

        fetchData('vehicleTypes', (updatedData) => {
          setVehicleTypes(updatedData);
        });
      })
      .catch((error) => {
        console.error('Error adding vehicle type:', error);
      });
  };

    /**
   * Handle editing a vehicle type.
   * @param {number} vehicleTypeId - The ID of the vehicle type to edit.
   */
  const handleEdit = (vehicleTypeId) => {
    setEditingVehicleTypeId(vehicleTypeId);
    const vehicleTypeToEdit = vehicleTypes.find((type) => type.id === vehicleTypeId);
    setEditedVehicleTypeName(vehicleTypeToEdit.name);
  };

  /**
 * Handle saving edits to a vehicle type.
 * @param {number} vehicleTypeId - The ID of the vehicle type to edit.
 */
  const handleSaveEdit = async (vehicleTypeId) => {
    const editedType = {
      name: editedVehicleTypeName,
    };
  
    try {
      const updatedType = await updateData('vehicleTypes', vehicleTypeId, editedType);
  
      if (updatedType) {
        const updatedTypes = vehicleTypes.map((type) =>
          type.id === vehicleTypeId ? updatedType : type
        );
        setVehicleTypes(updatedTypes);
        setEditingVehicleTypeId(null);
        setEditedVehicleTypeName('');
        fetchData('vehicleTypes', (data) => {
            setVehicleTypes(data);
          });
      } else {
        console.error('Error updating vehicle type:', updatedType);
      }
    } catch (error) {
      console.error('Error editing vehicle type:', error);
    }
  };
  
  /**
 * Handle canceling the edit operation for a vehicle type.
 */
  const handleCancelEdit = () => {
    setEditingVehicleTypeId(null);
    setEditedVehicleTypeName('');
  };

  /**
 * Handle deleting a vehicle type.
 * @param {object} vehicleTypeToDelete - The vehicle type to be deleted.
 */
  const handleDeleteVehicleType = async (vehicleTypeToDelete) => {
  
    try {
      await deleteData('vehicleTypes', vehicleTypeToDelete.id);
      const updatedTypes = vehicleTypes.filter((type) => type.id !== vehicleTypeToDelete.id);
      setVehicleTypes(updatedTypes);
    } catch (error) {
      console.error('Error deleting vehicle type:', error);
    }
  };

  /**
 * Filter and display vehicle types based on the search term.
 * @type {array} filteredVehicleTypes - The filtered vehicle types to be displayed.
 */
  const filteredVehicleTypes = vehicleTypes
  ? searchTerm
    ? vehicleTypes.filter((vehicleType) =>
        vehicleType.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : vehicleTypes
  : [];

    /* JSX to render data */
  return (
    <div className="data">
      <h2>Vehicle Types</h2>

      <div className="add-search">
        {/* Add vehicle type field & button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddVehicleType();
          }}
          className="add-data-form"
        >
          <input
            type="text"
            placeholder="Enter a new vehicle type"
            value={newVehicleType}
            onChange={(e) => setNewVehicleType(e.target.value)}
          />
          <button type="submit" className="add-data-button">
            Add Vehicle Type
          </button>
        </form>

      {/* Search bar */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Existing vehicle types list */}
      <div className="data-list">
        <ul>
        {filteredVehicleTypes.map((vehicleType, index) => (
        <li key={index} className="data-entry">
            <div className="data-info">
            {editingVehicleTypeId === vehicleType.id ? (
                <div>
                <input
                    type="text"
                    value={editedVehicleTypeName}
                    onChange={(e) => setEditedVehicleTypeName(e.target.value)}
                />
                <button onClick={() => handleSaveEdit(vehicleType.id)}>Save</button>
                </div>
            ) : (
                vehicleType.name
            )}
            </div>
            <div className="data-buttons">
            {editingVehicleTypeId === vehicleType.id ? (
                <button className="cancel-button" onClick={() => handleCancelEdit()}>
                Cancel
                </button>
            ) : (
                <>
                <button className="edit-button" onClick={() => handleEdit(vehicleType.id)}>
                    <FontAwesomeIcon icon={faPencilAlt} />
                </button>
                <button
                    className="delete-button"
                    onClick={() => handleDeleteVehicleType(vehicleType)}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </button>
                </>
            )}
            </div>
        </li>
        ))}
        </ul>
      </div>
    </div>
  );
}

export default VehicleTypes;
