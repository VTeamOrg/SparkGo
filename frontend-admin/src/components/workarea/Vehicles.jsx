import { useState, useEffect } from 'react';
import './CSS/ApiTables.css';
import { fetchData, createData, deleteData, updateData } from '../support/FetchService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash, faCheck, faTimes  } from '@fortawesome/free-solid-svg-icons';
import { SearchBar } from './HTML/General';
import AddVehicleModal from './Modals/AddVehicleModal';
import EditVehicleModal from './Modals/EditVehicleModal';

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditVehicleModal, setShowEditVehicleModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
    /* State to store station data */
    const [stations, setStations] = useState([]);

  useEffect(() => {
    fetchDataUpdateState();
  }, []);

  const fetchDataUpdateState = () => {
    fetchData('vehicles', (data) => {
      setVehicles(data);

      
    const formattedVehicleMarkers = data.map((vehicle) => ({
      lat: vehicle.position.lat,
      lng: vehicle.position.lon,
      infoText: vehicle.name,
      id: vehicle.id,
      cityName: vehicle.city_name,
      status: vehicle.status,
      battery: vehicle.battery,
      currentSpeed: vehicle.currentSpeed,
      maxSpeed: vehicle.maxSpeed,
      isStarted: vehicle.isStarted,
      rentedBy: vehicle.rentedBy,
    }));

    const event = new CustomEvent('vehiclesDataLoaded', { detail: formattedVehicleMarkers });
    window.dispatchEvent(event);
    });

    fetchData('stations',(stationsData) => {
      /* Update the component's state with station data */
      setStations(stationsData);

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
      console.log("trying to create");
      console.log(newVehicle);
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

    /**
 * Filter and display vehicle types based on the search term.
 * @type {array} filteredVehicleTypes - The filtered vehicle types to be displayed.
 */
    const filteredVehicles = vehicles
    ? searchTerm
      ? vehicles.filter((vehicle) =>
          vehicle.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : vehicles
    : [];

  return (
    <div className="api">
      <h2>Vehicles</h2>
      <button onClick={handleAddVehicle}>Add Vehicle</button>

      {/* Search bar */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <table className="api-table">

        <thead>
          <tr>
            <th>ID</th>
            <th>City</th>
            <th>Type</th>
            <th>Name</th>
            <th>Rented</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
        {filteredVehicles.map((vehicle) => (
          <tr key={vehicle.id} className="api-row">
            <td>{vehicle.id}</td>
            <td>{vehicle.city_name}</td>
            <td>{vehicle.type_name}</td>
            <td>{vehicle.name}</td>
            <td>
            {vehicle.rentedBy === -1 ? (
              <FontAwesomeIcon icon={faCheck} style={{ color: 'red' }} />
            ) : (
              <FontAwesomeIcon icon={faTimes} style={{ color: 'green' }} />
            )}
          </td>
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

      <AddVehicleModal
        isOpen={showAddVehicleModal}
        onRequestClose={() => setShowAddVehicleModal(false)}
        onSave={handleSaveVehicle}
      />
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
