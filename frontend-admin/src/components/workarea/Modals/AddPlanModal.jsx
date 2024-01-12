import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../CSS/Modal.css';
import { fetchData, createData } from '../../support/FetchService';
import AddPlan from '../HTML/AddPlan';

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

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <AddPlan
        newPlan={newPlan}
        setNewPlan={setNewPlan}
        frequencies={frequencies}
        handleAddPlan={handleAddPlan}
        onRequestClose={onRequestClose} 
      />
    </Modal>
  );
}

export default AddPlanModal;
