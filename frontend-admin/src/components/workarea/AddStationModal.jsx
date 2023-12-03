import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import './Modal.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { fetchCitiesData } from './FetchService';

/**
 * AddStationModal component for adding a new station.
 * @param {Object} props - Component props.
 * @param {boolean} props.isOpen - Flag indicating whether the modal is open.
 * @param {function} props.onRequestClose - Function to close the modal.
 * @param {function} props.onSave - Function to save the new station.
 * @returns {JSX.Element} AddStationModal component.
 */
const AddStationModal = ({ isOpen, onRequestClose, onSave }) => {
  const [stationName, setStationName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);

  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');

  const mapRef = useRef(null);

  useEffect(() => {
    fetchCitiesData((data) => {
      setCities(data);
      console.log(data);
    });
  }, []);

    /**
   * Event handler for map click.
   * @param {Object} e - Leaflet click event.
   */
  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setLatitude(lat.toFixed(4));
    setLongitude(lng.toFixed(4));
    setSelectedCoordinates([lat, lng]);
  };

    /**
   * Event handler for form submission.
   * @param {Object} e - Form submit event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    /* Validate the input fields */
    if (!stationName || !latitude || !longitude || !selectedCity) {
      alert('Please fill in all fields.');
      return;
    }

    /* Create a new station object with the input values */
    const newStation = {
      name: stationName,
      coords_lat: parseFloat(latitude),
      coords_long: parseFloat(longitude),
      city_id: selectedCity,
    };

    /* Call the onSave function with the new station data */
    onSave(newStation);

    /* Clear the input fields */
    setStationName('');
    setLatitude('');
    setLongitude('');
    setSelectedCoordinates(null);
    setSelectedCity('');

    /* Close the modal */
    onRequestClose();
  };

  /**
   * Custom input field to capture double-click action.
   * @returns {null} Null component.
   */
  const DoubleClickInput = () => {
    useMapEvents({
      dblclick: (e) => {
        e.originalEvent.preventDefault(); 
        const { lat, lng } = e.latlng;
        setLatitude(lat.toFixed(6));
        setLongitude(lng.toFixed(6));
        setSelectedCoordinates([lat, lng]);
      },
    });

    return null;
  };

    /* JSX to render modal */
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Station Modal"
    >
      <h2>Add Station</h2>
      <form onSubmit={handleSubmit}>

      <div>
        <label htmlFor="city">Select a City:</label>
        <select
            id="city"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
        >
            <option value="">Select a city</option>
            {cities.map((city) => (
            <option key={city.id} value={city.id}>
                {city.name}
            </option>
            ))}
        </select>
        </div>

        <div>
          <label htmlFor="stationName">Station Name:</label>
          <input
            type="text"
            id="stationName"
            value={stationName}
            onChange={(e) => setStationName(e.target.value)}
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
        <button type="submit">Save</button>
        <button onClick={onRequestClose}>Cancel</button>
      </form>
    </Modal>
  );
};

export default AddStationModal;
