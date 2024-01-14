import { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import '../CSS/Modal.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { fetchData } from '../../support/FetchService';
import PropTypes from 'prop-types';

const EditStationModal = ({ isOpen, onRequestClose, onSave, station }) => {
  const [stationName, setStationName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);

  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');

  const mapRef = useRef(null);

  useEffect(() => {
    fetchData('cities',(data) => {
      setCities(data);
    });
  }, []);

  useEffect(() => {
    /* Populate form fields with station data when modal opens */
    if (isOpen && station) {
      setStationName(station.name);
      setLatitude(station.coords_lat);
      setLongitude(station.coords_long);
      setSelectedCity(station.city_id);
      setSelectedCoordinates([station.coords_lat, station.coords_long]);
    }
  }, [isOpen, station]);

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setLatitude(lat.toFixed(6));
    setLongitude(lng.toFixed(6));
    setSelectedCoordinates([lat, lng]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stationName || !latitude || !longitude || !selectedCity) {
      alert('Please fill in all fields.');
      return;
    }

    const editedStation = {
      id: station.id,
      name: stationName,
      coords_lat: parseFloat(latitude),
      coords_long: parseFloat(longitude),
      city_id: selectedCity,
    };

    onSave(editedStation);

    setStationName('');
    setLatitude('');
    setLongitude('');
    setSelectedCoordinates(null);
    setSelectedCity('');

    onRequestClose();
  };

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

  EditStationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    station: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      coords_lat: PropTypes.number.isRequired,
      coords_long: PropTypes.number.isRequired,
      city_id: PropTypes.number.isRequired,
    }),
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Station Modal"
      className="edit-station-modal"
    >
      <h2>Edit Station</h2>
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
            center={selectedCoordinates || [56.1612, 15.5866]}
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

export default EditStationModal;
