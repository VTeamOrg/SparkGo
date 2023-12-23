import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { fetchData, updateData } from '../../support/FetchService';
import './Modal.css';
import { translateUnlimited } from '../../support/Utils';

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
        console.log(data);
        data.sort((a, b) => a.id - b.id);
        setAvailablePlans(data);
  
        const currentActivePlan = data.find((plan) => plan.id === activePlan.active_plan_id);
        if (currentActivePlan) {
          setSelectedPlan(currentActivePlan);
        }
      });
    }
  }, [isOpen, activePlan]);

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan);
  };

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
  
    updateData('activePlan', activePlan.active_plan_id, updatedPlan)
      .then(() => {
        onSave(selectedPlan.id);
        onRequestClose();
      })
      .catch((error) => {
        console.error('Error changing plan:', error);
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Change Plan Modal"
    >
      <div className="change-plan-modal">
        <h2>Change Plan</h2>

        {/* Display current plan */}
        <div className="current-plan">
          <p>
            <strong>Active Plan Name:</strong> {activePlan.active_plan_name}
          </p>
          <p>
            <strong>Active Plan Price:</strong> ${activePlan.active_plan_price}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="plan-container">
              {availablePlans.map((plan) => (
                <button
                  key={plan.id}
                  className={`plan-box ${selectedPlan && selectedPlan.id === plan.id ? 'selected' : ''}`}
                  onClick={() => handlePlanClick(plan)}
                  type="button" 
                >
                  <strong></strong> {plan.id}
                  <br />
                  <strong></strong> {plan.title}
                  <br />
                  Frequency: {plan.price_frequency_name}
                  <br />
                  Minutes: {translateUnlimited(plan.included_minutes)} 
                  <br />
                  Unlocks: {translateUnlimited(plan.included_unlocks)} 
                  <br />
                  ${plan.price}
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit">Change Plan</button>
            <button onClick={onRequestClose}>Cancel</button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default ChangePlanModal;
