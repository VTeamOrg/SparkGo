import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { fetchData, createData, updateData } from '../../support/FetchService';
import '../CSS/Modal.css';
import ChangePlan from '../HTML/ChangePlan'; 

/**
 * ChangePlanModal component for changing a member's active plan.
 *
 * @param {object} props - The component's props.
 * @param {boolean} props.isOpen - Indicates whether the modal is open.
 * @param {function} props.onRequestClose - Function to close the modal.
 * @param {object} props.activePlan - The active plan object.
 * @param {function} props.onSave - Function to handle plan change.
 * @returns {JSX.Element} The ChangePlanModal component JSX.
 */
function ChangePlanModal({ isOpen, onRequestClose, activePlan, onSave }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchData('plans', (data) => {
        data.sort((a, b) => a.id - b.id);
        setAvailablePlans(data);

        const currentActivePlan = data.find((plan) => plan.id === activePlan.active_plan_id);
        if (currentActivePlan) {
          setSelectedPlan(currentActivePlan);
        }
      });
    }
  }, [isOpen, activePlan]);

  /**
   * Handle the click event on a plan.
   * @param {object} plan - The selected plan object.
   */
  const handlePlanClick = (plan) => {
    setSelectedPlan(plan);
  };

  /**
   * Handle the form submission to change the plan.
   * @param {object} e - The form submission event.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const today = new Date().toISOString().slice(0, 10);

    const updatedPlan = {
      plan_id: selectedPlan.id,
      member_id: activePlan.id,
      creation_date: today,
      activation_date: null,
      available_minutes: selectedPlan.included_minutes,
      available_unlocks: selectedPlan.included_unlocks,
      is_paused: 'Y',
    };

    if (activePlan.active_plan_id) {
      // User has an active plan, perform an update
      updateData('activePlan', activePlan.active_plan_id, updatedPlan)
        .then(() => {
          onSave(selectedPlan.id);
          onRequestClose();
        })
        .catch((error) => {
          console.error('Error changing plan:', error);
        });
    } else {
      // User has no active plan, perform an insert (create)
      createData('activePlan', updatedPlan)
        .then(() => {
          onSave(selectedPlan.id);
          onRequestClose();
        })
        .catch((error) => {
          console.error('Error creating plan:', error);
        });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Change Plan Modal"
    >
      <ChangePlan
        selectedPlan={selectedPlan}
        availablePlans={availablePlans}
        activePlan={activePlan}
        handlePlanClick={handlePlanClick}
        handleSubmit={handleSubmit}
        onRequestClose={onRequestClose}
      />
    </Modal>
  );
}

export default ChangePlanModal;
