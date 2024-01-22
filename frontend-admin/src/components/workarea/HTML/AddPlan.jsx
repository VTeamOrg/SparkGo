import PropTypes from 'prop-types';

function AddPlan({
  newPlan,
  setNewPlan,
  frequencies,
  handleAddPlan,
  onRequestClose
}) {
  return (
    <>
      <h2>Add New Plan</h2>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={newPlan.title}
          onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          value={newPlan.description}
          onChange={(e) =>
            setNewPlan({ ...newPlan, description: e.target.value })
          }
        />
      </div>
      <div>
        <label>Price:</label>
        <input
          type="number"
          value={newPlan.price}
          onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Price Frequency:</label>
        <select
          value={newPlan.price_frequency_id}
          onChange={(e) =>
            setNewPlan({ ...newPlan, price_frequency_id: e.target.value })
          }
          required
        >
          <option value="">Select Frequency</option>
          {frequencies.map((frequency) => (
            <option key={frequency.id} value={frequency.id}>
              {frequency.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Included Unlocks Frequency:</label>
        <select
          value={newPlan.included_unlocks_frequency_id}
          onChange={(e) =>
            setNewPlan({
              ...newPlan,
              included_unlocks_frequency_id: e.target.value,
            })
          }
          required
        >
          <option value="">Select Frequency</option>
          {frequencies.map((frequency) => (
            <option key={frequency.id} value={frequency.id}>
              {frequency.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Included Minutes Frequency:</label>
        <select
          value={newPlan.included_minutes_frequency_id}
          onChange={(e) =>
            setNewPlan({
              ...newPlan,
              included_minutes_frequency_id: e.target.value,
            })
          }
          required
        >
          <option value="">Select Frequency</option>
          {frequencies.map((frequency) => (
            <option key={frequency.id} value={frequency.id}>
              {frequency.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button onClick={handleAddPlan}>Add Plan</button>
        <button onClick={onRequestClose}>Close</button>
      </div>
    </>
  );
}

AddPlan.propTypes = {
    newPlan: PropTypes.object.isRequired,
    setNewPlan: PropTypes.func.isRequired,
    frequencies: PropTypes.array.isRequired,
    handleAddPlan: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired,
  };

export default AddPlan;
