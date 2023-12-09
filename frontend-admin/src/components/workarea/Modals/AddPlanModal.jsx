import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './Modal.css';
import { fetchData,createData } from '../../support/FetchService';

/**
 * AddPlanModal component for adding a new plan.
 * 
 * @param {Object} props - The component's props.
 * @param {boolean} props.isOpen - Indicates whether the modal is open or closed.
 * @param {Function} props.onRequestClose - Function to close the modal.
 * @param {Function} props.refreshPlans - Function to refresh plans data after adding a new plan.
 */
function AddPlanModal({ isOpen, onRequestClose, refreshPlans }) {
  const [newPlan, setNewPlan] = useState({
    title: '',
    description: '',
    price: 0,
    price_frequency_id: 1, 
    included_unlocks_frequency_id: 1, 
    included_minutes_frequency_id: 1, 
  });

  const [frequencies, setFrequencies] = useState([]);

  useEffect(() => {
    fetchData('frequencies', (freqData) => {
      setFrequencies(freqData);
    });
  }, []);

  /**
 * Handle the addition of a new plan, create data, and trigger a refresh.
 */
  const handleAddPlan = () => {
    /**
   * Make an API call to create a new plan.
   * @param {string} endpoint - The API endpoint for creating plans.
   * @param {Object} newPlan - The new plan data to be created.
   * @returns {Promise<Object>} A promise that resolves to the created plan data.
   */
    createData('plans', newPlan)
      .then((createdPlan) => {
        onRequestClose();

        if (refreshPlans) {
          refreshPlans();
        }
      })
      .catch((error) => {
        console.error('Error adding plan:', error);
      });
  };

    /* JSX to render data */
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}  >
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
    </Modal>
  );
}

export default AddPlanModal;
