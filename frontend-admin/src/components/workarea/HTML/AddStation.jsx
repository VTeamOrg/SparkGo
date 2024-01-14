import PropTypes from 'prop-types';

const AddStationFields = ({
  selectedCity,
  setSelectedCity,
  stationName,
  setStationName,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  cities,
}) => {
  return (
    <div>
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
    </div>
  );
};

AddStationFields.propTypes = {
    selectedCity: PropTypes.string.isRequired,
    setSelectedCity: PropTypes.func.isRequired,
    stationName: PropTypes.string.isRequired,
    setStationName: PropTypes.func.isRequired,
    latitude: PropTypes.string.isRequired,
    setLatitude: PropTypes.func.isRequired,
    longitude: PropTypes.string.isRequired,
    setLongitude: PropTypes.func.isRequired,
    cities: PropTypes.array.isRequired,
  };

export default AddStationFields;
