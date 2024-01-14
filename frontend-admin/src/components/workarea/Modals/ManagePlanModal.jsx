import { useState } from 'react';
import Modal from 'react-modal';
import '../CSS/Modal.css';
import { formatDateTime } from '../../support/Utils';
import { updateData } from '../../support/FetchService';
import PropTypes from 'prop-types';

/**
 * ManagePlanModal component for editing an active plan.
 *
 * @param {object} props - The component's props.
 * @param {boolean} props.isOpen - Indicates whether the modal is open.
 * @param {function} props.onRequestClose - Function to close the modal.
 * @param {object} props.activePlan - The active plan being edited.
 * @param {function} props.onSave - Function to save the edited active plan.
 * @returns {JSX.Element} The ManagePlanModal component JSX.
 */
function ManagePlanModal({ isOpen, onRequestClose, activePlan, onSave, fromMyAccount }) {
  const [editedActivePlan, setEditedActivePlan] = useState({ ...activePlan });

  const isEditable = !fromMyAccount;
  const fieldClassName = `read-only-field ${!isEditable ? 'disabled' : ''}`;

  /**
   * Handles the submission of the edited active plan.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const {
      active_plan_id,
      id,
      active_plan_creation,
      active_plan_minutes,
      active_plan_unlocks,
      active_plan_paused,
    } = editedActivePlan;
  
    let activation_date;
  
    if (editedActivePlan.active_plan_paused === "Y") {
      activation_date = null;
    } else {
      activation_date = new Date(); 
    }
  
    const updatedPlan = {
      plan_id: active_plan_id,
      member_id: id,
      creation_date: active_plan_creation,
      activation_date: activation_date,
      available_minutes: active_plan_minutes,
      available_unlocks: active_plan_unlocks,
      is_paused: active_plan_paused,
    };
  
    updateData("activePlan", active_plan_id, updatedPlan)
      .then(() => {
        onSave();
        onRequestClose();
      })
      .catch((error) => {
        console.error("Error updating active plan:", error);
      });
  };

  ManagePlanModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    activePlan: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    fromMyAccount: PropTypes.bool.isRequired,
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Active Plan Modal"
    >
      <div className="edit-active-plan-modal">
        <h3>Edit Active Plan</h3>
        <form onSubmit={handleSubmit}>
          {/* Fields for editing active plan properties */}
          <div className="form-group">
            <label>Active Plan ID</label>
            <input
              type="text"
              value={editedActivePlan.active_plan_id}
              readOnly
              className={fieldClassName}
            />
          </div>

          <div className="form-group">
            <label>Active Plan Name</label>
            <input
              type="text"
              value={editedActivePlan.active_plan_name}
              readOnly
              className={fieldClassName}
            />
          </div>

          <div className="form-group">
            <label>Active Plan Creation</label>
            <input
              type="text"
              value={formatDateTime(editedActivePlan.active_plan_creation)}
              readOnly
              className={fieldClassName}
            />
          </div>

          <div className="form-group">
            <label>Active Plan Activation</label>
            <input
              type="text"
              value={
                editedActivePlan.active_plan_paused === 'N'
                  ? formatDateTime(
                      editedActivePlan.active_plan_activation || new Date()
                    )
                  : ''
              }
              onChange={(e) =>
                isEditable &&
                setEditedActivePlan({
                  ...editedActivePlan,
                  active_plan_activation: e.target.value,
                })
              }
              required={editedActivePlan.active_plan_paused === 'N' && isEditable}
              className={fieldClassName}
            />
          </div>

          <div className="form-group">
            <label>Available Minutes</label>
            <input
              type="text"
              value={editedActivePlan.active_plan_minutes}
              onChange={(e) =>
                isEditable &&
                setEditedActivePlan({
                  ...editedActivePlan,
                  active_plan_minutes: e.target.value,
                })
              }
              required={isEditable}
              className={fieldClassName}
            />
          </div>

          <div className="form-group">
            <label>Available Unlocks</label>
            <input
              type="text"
              value={editedActivePlan.active_plan_unlocks}
              onChange={(e) =>
                isEditable &&
                setEditedActivePlan({
                  ...editedActivePlan,
                  active_plan_unlocks: e.target.value,
                })
              }
              required={isEditable}
              className={fieldClassName}
            />
          </div>

          <div className="form-group">
            <label>Plan Paused</label>
            <div className="checkbox-container">
              <input
                type="checkbox"
                checked={editedActivePlan.active_plan_paused === 'Y'}
                onClick={() => {
                  if (isEditable) {
                    const updatedPlan = {
                      ...editedActivePlan,
                      active_plan_paused:
                        editedActivePlan.active_plan_paused === 'Y' ? 'N' : 'Y',
                    };

                    if (editedActivePlan.active_plan_paused === 'Y') {
                      updatedPlan.active_plan_activation = new Date();
                    } else {
                      updatedPlan.active_plan_activation = null;
                    }

                    setEditedActivePlan(updatedPlan);
                  }
                }}
                disabled={!isEditable}
              />
            </div>
          </div>

          {/* Save and cancel buttons */}
          <div className="form-actions">
          {isEditable && (
              <button type="submit">
                Save
              </button>
          )}
            <button onClick={onRequestClose}>Cancel</button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default ManagePlanModal;
