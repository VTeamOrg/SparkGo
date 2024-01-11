import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../CSS/Modal.css';
import { fetchData, updateData, deleteData  } from '../../support/FetchService';

/**
 * PlanModal component for viewing and editing plan details.
 * 
 * @param {Object} props - The component's props.
 * @param {boolean} props.isOpen - Indicates whether the modal is open or closed.
 * @param {Function} props.onRequestClose - Function to close the modal.
 * @param {Object} props.plan - The plan data to be displayed and edited.
 * @param {Function} props.refreshPlans - Function to refresh plans data after editing a plan.
 */
function PlanModal({ isOpen, onRequestClose, plan, refreshPlans }) {
  const [editedPlan, setEditedPlan] = useState(plan || {});
  const [isEditing, setIsEditing] = useState(false);
  const [frequencies, setFrequencies] = useState([]);
  const [selectedPriceFrequency, setSelectedPriceFrequency] = useState(
    editedPlan.price_frequency_id || ''
  );
  const [selectedIncludedUnlocksFrequency, setSelectedIncludedUnlocksFrequency] =
    useState(editedPlan.included_unlocks_frequency_id || '');
  const [selectedIncludedMinutesFrequency, setSelectedIncludedMinutesFrequency] =
    useState(editedPlan.included_minutes_frequency_id || '');

  useEffect(() => {
    fetchData('frequencies', (freqData) => {
      setFrequencies(freqData);
    });
  }, []);

    /**
   * Handle changes in plan fields.
   * @param {string} field - The field name being changed.
   * @param {string|number} value - The new value for the field.
   */
  const handleFieldChange = (field, value) => {
    setEditedPlan({ ...editedPlan, [field]: value });
  };

  /**
   * Handle plan edits, update data, and trigger a refresh.
   */
  const handleEdit = () => {
    editedPlan.price_frequency_id = selectedPriceFrequency;
    editedPlan.included_unlocks_frequency_id = selectedIncludedUnlocksFrequency;
    editedPlan.included_minutes_frequency_id = selectedIncludedMinutesFrequency;
  
      /**
   * Make an API call to update plan data.
   * @param {string} endpoint - The API endpoint for updating plans.
   * @param {number} planId - The ID of the plan to be updated.
   * @param {Object} editedPlan - The edited plan data.
   * @returns {Promise<Object>} A promise that resolves to the updated plan data.
   */
    updateData('plans', editedPlan.id, editedPlan)
      .then((updatedPlan) => {
        setEditedPlan(updatedPlan);
        setIsEditing(false);
        onRequestClose();
  
        if (refreshPlans) {
          refreshPlans(); 
        }
      })
      .catch((error) => {
        console.error('Error updating plan:', error);
      });
  };

  /**
 * Handle plan deletion, confirm with the user, and trigger a refresh.
 */
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
    /**
     * Make an API call to delete a plan.
     * @param {string} endpoint - The API endpoint for deleting plans.
     * @param {number} planId - The ID of the plan to be deleted.
     * @returns {Promise} A promise that resolves after the plan is successfully deleted.
     */
      deleteData('plans', editedPlan.id)
        .then(() => {
          if (refreshPlans) {
            refreshPlans(); 
          }
  
          onRequestClose();
        })
        .catch((error) => {
          console.error('Error deleting plan:', error);
        });
    }
  };
  
      /* JSX to render data */
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
      >
        <h2>{isEditing ? 'Edit Plan' : 'View Plan'}</h2>
        <div>
          <label>Title:</label>
          {isEditing ? (
            <input
              type="text"
              value={editedPlan.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
            />
          ) : (
            <span>{editedPlan.title}</span>
          )}
        </div>
        <div>
          <label>Description:</label>
          {isEditing ? (
            <textarea
              value={editedPlan.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
            />
          ) : (
            <span>{editedPlan.description}</span>
          )}
        </div>
        <div>
          <label>Price:</label>
          {isEditing ? (
            <input
              type="number"
              value={editedPlan.price}
              onChange={(e) => handleFieldChange('price', e.target.value)}
            />
          ) : (
            <span>{editedPlan.price}</span>
          )}
        </div>
        <div>
          <label>Price Frequency:</label>
          {isEditing ? (
            <select
              value={selectedPriceFrequency}
              onChange={(e) => setSelectedPriceFrequency(e.target.value)}
            >
              <option value="">Select Frequency</option>
              {frequencies.map((frequency) => (
                <option key={frequency.id} value={frequency.id}>
                  {frequency.name}
                </option>
              ))}
            </select>
          ) : (
            <span>{editedPlan.price_frequency_name}</span>
          )}
        </div>
        <div>
          <label>Included Unlocks Frequency:</label>
          {isEditing ? (
            <select
              value={selectedIncludedUnlocksFrequency}
              onChange={(e) => setSelectedIncludedUnlocksFrequency(e.target.value)}
            >
              <option value="">Select Frequency</option>
              {frequencies.map((frequency) => (
                <option key={frequency.id} value={frequency.id}>
                  {frequency.name}
                </option>
              ))}
            </select>
          ) : (
            <span>{editedPlan.included_unlocks_frequency_name}</span>
          )}
        </div>
        <div>
          <label>Included Minutes Frequency:</label>
          {isEditing ? (
            <select
              value={selectedIncludedMinutesFrequency}
              onChange={(e) => setSelectedIncludedMinutesFrequency(e.target.value)}
            >
              <option value="">Select Frequency</option>
              {frequencies.map((frequency) => (
                <option key={frequency.id} value={frequency.id}>
                  {frequency.name}
                </option>
              ))}
            </select>
          ) : (
            <span>{editedPlan.included_minutes_frequency_name}</span>
          )}
        </div>
        <div>
        {isEditing ? (
            <>
            <button onClick={handleEdit}>Save</button>
            </>
        ) : (
            <>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
            </>
        )}
        <button onClick={onRequestClose}>Close</button>
        </div>
      </Modal>
    );
  }
  
  export default PlanModal;