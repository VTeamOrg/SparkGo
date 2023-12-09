import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

const AddVehicleModal = ({ isOpen, onRequestClose, onSave }) => {
  const [vehicleName, setVehicleName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);

  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState('');

  const mapRef = useRef(null);

  useEffect(() => {
    // Fetch vehicle types here if needed
  }, []);

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setLatitude(lat.toFixed(4));
    setLongitude(lng.toFixed(4));
    setSelectedCoordinates([lat, lng]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vehicleName || !latitude || !longitude || !selectedVehicleType) {
      alert('Please fill in all fields.');
      return;
    }

    const newVehicle = {
      name: vehicleName,
      coords_lat: parseFloat(latitude),
      coords_long: parseFloat(longitude),
      type_id: selectedVehicleType,
    };

    onSave(newVehicle);

    setVehicleName('');
    setLatitude('');
    setLongitude('');
    setSelectedCoordinates(null);
    setSelectedVehicleType('');

    onRequestClose();
  };

  const DoubleClickInput = () => {
    useMapEvents({
      dblclick: (e) => {
        e.originalEvent.preventDefault();
        const { lat, lng } = e.latlng;
        setLatitude(lat.toFixed(4));
        setLongitude(lng.toFixed(4));
        setSelectedCoordinates([lat, lng]);
      },
    });

    return null;
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Vehicle Modal"
    >
      <h2>Add Vehicle</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="vehicleType">Select a Vehicle Type:</label>
          <select
            id="vehicleType"
            value={selectedVehicleType}
            onChange={(e) => setSelectedVehicleType(e.target.value)}
          >
            <option value="">Select a vehicle type</option>
            {/* Map over your vehicle types and populate options */}
          </select>
        </div>

        <div>
          <label htmlFor="vehicleName">Vehicle Name:</label>
          <input
            type="text"
            id="vehicleName"
            value={vehicleName}
            onChange={(e) => setVehicleName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="latitude">Latitude:</label>
          <input
            type="text"
            id="latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="longitude">Longitude:</label>
          <input
            type="text"
            id="longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
        </div>
        <div>
          <label>Coordinates:</label>
          <MapContainer
            center={[56.1612, 15.5866]}
            zoom={13}
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
        <button type="submit">Save</button>
        <button onClick={onRequestClose}>Cancel</button>
      </form>
    </Modal>
  );
};

export default AddVehicleModal;
