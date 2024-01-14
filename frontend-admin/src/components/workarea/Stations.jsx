import { useState, useEffect } from 'react';
import './CSS/ApiTables.css';
import AddStationModal from './Modals/AddStationModal'; 
import EditStationModal from './Modals/EditStationModal'; 
import { fetchData, createData, deleteData, updateData } from '../support/FetchService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

/**
 * PriceList component for managing stations
 *
 * @returns {JSX.Element} The stations component JSX.
 */
function Stations() {
  /* State to store station data */
  const [stations, setStations] = useState([]);
  /* State to show add station modal */
  const [showAddStationModal, setShowAddStationModal] = useState(false);
  /* State to show edit station modal and store the editing station */
  const [showEditStationModal, setShowEditStationModal] = useState(false);
  const [editingStation, setEditingStation] = useState(null);

  /* Effect to fetch station data when the component mounts */
  useEffect(() => {
    fetchDataUpdateState();
  }, []);

  /* Function to fetch station data and update state */
  const fetchDataUpdateState = () => {
    fetchData('stations',(data) => {
      /* Update the component's state with station data */
      setStations(data);

      /* Format the data into markers */
      const formattedMarkers = data.map((station) => ({
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

  const handleEditStation = (station) => {
    setEditingStation(station);
    setShowEditStationModal(true);
  };

  const handleAddStation = () => {
    setShowAddStationModal(true);
  };

  const handleUpdateStation = async (editedStation) => {
    try {
      await updateData('stations',editedStation.id, editedStation);

      /* Refetch the station data to get the updated list */
      fetchDataUpdateState();
    } catch (error) {
      console.error('Error updating station:', error.message);
    }

    /* Close the modal */
    setShowEditStationModal(false);
  };

  const handleSaveStation = async (newStation) => {
    try {
      await createData('stations', newStation);

      /* Refetch the station data to get the updated list */
      fetchDataUpdateState();
    } catch (error) {
      console.error('Error creating station:', error.message);
    }

    /* Close the modal */
    setShowAddStationModal(false);
  };

  const handleDeleteStation = async (stationId) => {
    try {
      await deleteData('stations', stationId);

      /* Refetch the station data to get the updated list */
      fetchDataUpdateState();      
    } catch (error) {
      console.error('Error deleting station:', error.message);
    }
  };

  /* JSX to render station data */
  return (
    <div className="api">
      <h2>Stations</h2>
      <button onClick={handleAddStation}>Add Station</button>

      <table className="api-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Coordinates</th>
            <th>City</th>
            <th></th> 
            <th></th> 
          </tr>
        </thead>
        <tbody>
          {stations.map((station) => (
            <tr key={station.id} className="api-row">
              <td >{station.name}</td>
              <td >
                ({station.coords_lat}, {station.coords_long})
              </td>
              <td >{station.city_name}</td>
              <td className="api-edit">
                <button onClick={() => handleEditStation(station)}>
                  <FontAwesomeIcon icon={faPencilAlt} />
                </button>
              </td>
              <td className="api-delete">
                <button onClick={() => handleDeleteStation(station.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* AddStationModal component */}
      <AddStationModal
        isOpen={showAddStationModal}
        onRequestClose={() => setShowAddStationModal(false)}
        onSave={handleSaveStation}
      />

      {/* EditStationModal component */}
      {editingStation && (
        <EditStationModal
          isOpen={showEditStationModal}
          onRequestClose={() => setShowEditStationModal(false)}
          onSave={handleUpdateStation} 
          station={editingStation} 
        />
      )}
    </div>
  );
}

export default Stations;
