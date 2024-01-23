import PropTypes from 'prop-types';

const AddVehicle = ({
  newVehicle,
  setNewVehicle,
  vehicleTypes,
  cities,
  handleAddVehicle,
  onRequestClose,
}) => {
  return (
    <div>
      <h2>Add Vehicle</h2>
      <div>
        <label>City:</label>
        <select
          value={newVehicle.city_id}
          onChange={(e) =>
            setNewVehicle({ ...newVehicle, city_id: e.target.value })
          }
          required
        >
          <option value="" disabled>
            Select City
          </option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Vehicle Type:</label>
        <select
          value={newVehicle.type_id}
          onChange={(e) =>
            setNewVehicle({ ...newVehicle, type_id: e.target.value })
          }
          required
        >
          <option value="" disabled>
            Select Vehicle Type
          </option>
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
          value={newVehicle.name}
          onChange={(e) =>
            setNewVehicle({ ...newVehicle, name: e.target.value })
          }
          required
        />
      </div>
      <div>
        <button onClick={handleAddVehicle}>Add Vehicle</button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
    </div>
  );
};

AddVehicle.propTypes = {
  newVehicle: PropTypes.object.isRequired,
  setNewVehicle: PropTypes.func.isRequired,
  vehicleTypes: PropTypes.array.isRequired,
  cities: PropTypes.array.isRequired,
  handleAddVehicle: PropTypes.func.isRequired,
  onRequestClose: PropTypes.func.isRequired,
};

export default AddVehicle;
