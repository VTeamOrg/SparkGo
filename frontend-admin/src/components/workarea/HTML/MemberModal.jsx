import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus,faCheck, faListAlt,faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { formatDateTime, translateUnlimited } from '../../support/Utils';

function PaymentMethodFields({
  paymentMethods,
  isEditing,
  selectedPaymentMethodIndex,
  handlePaymentMethodChange,
  handleDeletePaymentMethod,
  openAddPaymentModal,
}) {
  return (
    <>
      {/* PAYMENT METHOD TABLE */}
      <div className="divider"></div>
      {paymentMethods.length > 0 && (
        <table className="payment-table">
          <thead>
            <tr>
              <th></th>
              <th>Payment Method</th>
              <th>Payment Reference</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paymentMethods.map((method, index) => (
              <tr key={method.id}>
                <td>
                  {isEditing ? (
                    <input
                      type="radio"
                      name="selectedPayment"
                      value={method.method_name}
                      checked={index === selectedPaymentMethodIndex}
                      onChange={() =>
                        handlePaymentMethodChange(method.method_name, index)
                      }
                    />
                  ) : (
                    index === selectedPaymentMethodIndex && (
                      <FontAwesomeIcon icon={faCheck} />
                    )
                  )}
                </td>
                <td>{method.method_name}</td>
                <td>{method.reference_info}</td>
                <td>
                  {isEditing && (
                    <button
                      className="delete-button"
                      onClick={() => handleDeletePaymentMethod(method.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
  
      <button onClick={openAddPaymentModal}>
        <FontAwesomeIcon icon={faPlus} /> Add Payment Method
      </button>
    </>
  );
  
}

function MemberFields({
  editedMember,
  isEditing,
  handleFieldChange,
  emailError,
}) {
  return (
    <>
{/* MEMBER FIELDS */}
<div className="row">
      <div>
        <label>Member ID:</label>
        <span>{editedMember.id}</span>
      </div>
      <div>
        <label>Role:</label>
        {isEditing ? (
          <select
            value={editedMember.role}
            onChange={(e) => handleFieldChange('role', e.target.value)}
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        ) : (
          <span>{editedMember.role}</span>
        )}
      </div>

      </div>
      <div>
        <label>Email:</label>
        {isEditing ? (
          <>
            <input
              type="email"
              value={editedMember.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              required
            />
            <span className="error">{emailError}</span>
          </>
        ) : (
          <span>{editedMember.email}</span>
        )}
      </div>
      <div>
        <label>Name:</label>
        {isEditing ? (
          <input
            type="text"
            value={editedMember.name}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            required
          />
        ) : (
          <span>{editedMember.name}</span>
        )}
      </div>
      <div>
        <label>Personal Number:</label>
        {isEditing ? (
          <input
            type="text"
            value={editedMember.personal_number}
            onChange={(e) => handleFieldChange('personal_number', e.target.value)}
            required
          />
        ) : (
          <span>{editedMember.personal_number}</span>
        )}
      </div>
      <div>
        <label>Wallet SEK:</label>
        {isEditing ? (
            <input
            type="number"
            value={editedMember.wallet}
            onChange={(e) => handleFieldChange('wallet', e.target.value)}
            required
            />
        ) : (
            <span>{editedMember.wallet}</span>
        )}
        </div>
      <div>
        <label>Address:</label>
        {isEditing ? (
          <textarea
            className="full-width-address"
            value={editedMember.address}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            required
          />
        ) : (
          <span>{editedMember.address}</span>
        )}
      </div>
    </>
  );
}

function PlanFields({
  editedMember,
  isEditing,
  handleFieldChange,
  handleEdit,
  handleDelete,
  onRequestClose,
  openManagePlanModal,
  openChangePlanModal
}) {
  return (
    <>
      {/* PLAN FIELDS */}
      <div className="divider"></div>
      <table className="custom-table">
        <tbody>
          <tr>
            <td>
              <label>Active Plan:</label>
            </td>
            <td>
              <span>{editedMember.active_plan_id} </span>
              <span>{editedMember.active_plan_name}</span>
            </td>
          </tr>
          <tr>
            <td>
              <label>Price:</label>
            </td>
            <td>
              <span>{editedMember.active_plan_price}</span>
            </td>
            <td>
              <label>Billing Frequency:</label>
            </td>
            <td>
              <span>{editedMember.active_plan_frequency_name}</span>
            </td>
          </tr>
          <tr>
          <td>
            <label>Creation:</label>
          </td>
          <td>
            <span>{formatDateTime(editedMember.active_plan_creation)}</span>
          </td>
          <td>
            <label>Last activation:</label>
          </td>
          <td>
            {editedMember.active_plan_paused === 'Y' ? (
              <span>Inactive</span>
            ) : (
              <span>{formatDateTime(editedMember.active_plan_activation)}</span>
            )}
          </td>
        </tr>
          <tr>
            <td>
              <label>Available Minutes:</label>
            </td>
            <td>
              <span>{translateUnlimited(editedMember.active_plan_minutes)}</span>
            </td>
          </tr>
          <tr>
            <td>
              <label>Available Unlocks:</label>
            </td>
            <td>
              <span>{translateUnlimited(editedMember.active_plan_unlocks)}</span>
              
            </td>
            <td>
              <label>Plan Paused:</label>
            </td>
            <td>
              <span>{editedMember.active_plan_paused === 'Y' ? 'Yes' : 'No'}</span>
            </td>
          </tr>
          <tr>
            <td>
              <button onClick={openManagePlanModal}>
                <FontAwesomeIcon icon={faListAlt} /> Manage plan
              </button>
            </td>
            <td>
              <button onClick={openChangePlanModal}>
                <FontAwesomeIcon icon={faPencilAlt} /> Change plan
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="divider"></div>
    </>
  );
  
  
  
}


export { PaymentMethodFields, MemberFields, PlanFields };

