import React from 'react';
import { translateUnlimited } from '../../support/Utils';

function ChangePlan({ selectedPlan, availablePlans, activePlan, handlePlanClick, handleSubmit, onRequestClose }) {
  return (
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
  );
}

export default ChangePlan;
