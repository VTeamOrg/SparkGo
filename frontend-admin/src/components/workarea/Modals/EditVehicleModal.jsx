import { useState, useEffect, useRef  } from 'react';
import Modal from 'react-modal';
import '../CSS/Modal.css';
import { updateData, fetchData } from '../../support/FetchService';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import React, { useCallback } from "react";
//import useWebSocket from 'react-use-websocket'; 

function EditVehicleModal({ isOpen, onRequestClose, onSave, vehicle }) {

  const [editedVehicle, setEditedVehicle] = useState({
      city_id: '',
      type_id: '',
      name: '',
      status: '',
      station_id: '',
      position: { lat: 0, lon: 0 },
    });

/*    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
      `ws://localhost:3000?type=vehicle&id=${vehicle.id}`,
      {
        share: false,
        shouldReconnect: () => true,
      }
    ); */

  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [stations, setStations] = useState([]);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);

  const mapRef = useRef(null);

  useEffect(() => {
    console.log("useeffect");
    fetchData('stations',(stationsData) => {
      setStations(stationsData);
    });

    fetchData('vehicleTypes',(typesData) => {
      setVehicleTypes(typesData);
    });

    if (isOpen && vehicle) {
      setEditedVehicle({
        city_id: vehicle.city_id,
        type_id: vehicle.type_id,
        name: vehicle.name,
        status: vehicle.status,
        position: {
          lat: vehicle.position.lat,
          lon: vehicle.position.lon,
        },
        station_id: vehicle.station_id || '',
      });
      setLatitude(vehicle.position.lat.toFixed(6));
      setLongitude(vehicle.position.lon.toFixed(6));
      setSelectedCoordinates([vehicle.position.lat, vehicle.position.lon]);
    }

    if (!isOpen) {
      setEditedVehicle({
        city_id: '',
        type_id: '',
        name: '',
        status: '',
        station_id: '',
        position: { lat: 0, lon: 0 },
      });
    }
  }, [isOpen, vehicle]);


//  const moveVehicle = useCallback(() => {
//    const moveData = {
//      action: 'moveVehicle',
//      vehicleId: vehicle.id,
//      lat: editedVehicle.position.lat,
//      lon: editedVehicle.position.lon,
//      rentedBy: -1,
//    };

    // Send the move vehicle request to the server
//    sendJsonMessage(moveData);
//  }, [sendJsonMessage, vehicle.id, editedVehicle]);
//}, [vehicle.id, editedVehicle]);


const handleEditVehicle = () => {
  console.log("handle edit");
  const updatedVehicle = { ...editedVehicle };

  if (!isNaN(updatedVehicle.position.lat) && !isNaN(updatedVehicle.position.lon)) {
    // Send the updated vehicle data to the server
    console.log("id", vehicle.id);
    console.log("updatedVehicle", updatedVehicle);

    updateData('vehicles', vehicle.id, updatedVehicle)
      .then(() => {
        onSave(updatedVehicle);
        onRequestClose();
      })
      .catch((error) => {
        console.error('Error updating vehicle:', error);
      });
  } else {
    console.error('Invalid latitude or longitude input');
  }
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
      status: PropTypes.string.isRequired,
      position: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lon: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
  };


  const DoubleClickInput = () => {
/*    useMapEvents({
      dblclick: (e) => {
        e.originalEvent.preventDefault();
        const { lat, lng } = e.latlng;
        setLatitude(lat.toFixed(6));
        setLongitude(lng.toFixed(6));
        setSelectedCoordinates([lat, lng]);
        setEditedVehicle({
          ...editedVehicle,
          position: {
            lat: lat,
            lon: lng,
          },
        });
      },
    }); */
    console.log("double clicked");

    return null;
  };

  const handleMapClick = (e) => {
    // Update the position object in the state when the map is clicked
    setEditedVehicle({
      ...editedVehicle,
      position: {
        lat: e.latlng.lat,
        lon: e.latlng.lng,
      },
    });
    setLatitude(e.latlng.lat.toFixed(6));
    setLongitude(e.latlng.lng.toFixed(6));
    setSelectedCoordinates([e.latlng.lat, e.latlng.lng]);
  };

  const handleStationSelection = (stationId) => {
    // Find the selected station using stationId
    const selectedStation = stations.find((station) => station.id === parseInt(stationId));
  
    if (selectedStation) {

      // Update latitude and longitude fields with the selected station's coordinates
      setLatitude(selectedStation.coords_lat.toFixed(6));
      setLongitude(selectedStation.coords_long.toFixed(6));
  
      // Update selectedCoordinates state with the selected station's coordinates
      setSelectedCoordinates([selectedStation.coords_lat, selectedStation.coords_long]);
  
      // Update the editedVehicle state with the new coordinates
      setEditedVehicle({
        ...editedVehicle,
        position: {
          lat: selectedStation.coords_lat,
          lon: selectedStation.coords_long,
        },
        station_id: selectedStation.id.toString(), 
      });
    }

  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="edit-vehicle-modal">
      <h2>Edit Vehicle</h2>

      <div>
      <label>Station:</label>
      <select
        value={editedVehicle.station_id}
        onChange={(e) => {
          setEditedVehicle({ ...editedVehicle, station_id: e.target.value });
          handleStationSelection(e.target.value); 
        }}
        required
      >
        <option value="">Select a station</option>
        {stations.map((station) => (
          <option key={station.id} value={station.id}>
            {station.name}
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
          value={editedVehicle.status}
          onChange={(e) => setEditedVehicle({ ...editedVehicle, status: e.target.value })}
        />
      </div>

            {/* Display latitude and longitude fields */}
            <div>
        <label>Latitude:</label>
        <input type="text" value={latitude} readOnly />
      </div>
      <div>
        <label>Longitude:</label>
        <input type="text" value={longitude} readOnly />
      </div>

      {/* Map to display and edit the vehicle's location */}
      <div>
        <label>Location:</label>
        <MapContainer
          center={
            selectedCoordinates
              ? selectedCoordinates
              : [56.1612, 15.5866] 
          }
          zoom={13}
          zoomSnap={0}
          zoomDelta={0.25}
          style={{ height: '200px', width: '100%' }}
          onClick={handleMapClick}
          doubleClickZoom={false}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <DoubleClickInput />
          {selectedCoordinates && (
            <Marker position={selectedCoordinates} />
          )}
        </MapContainer>

      </div>


      <div>
        <button onClick={handleEditVehicle}>Save Changes</button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
    </Modal>
  );
}

export default EditVehicleModal;
