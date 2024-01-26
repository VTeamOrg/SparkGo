import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus,faCheck, faListAlt,faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { formatDateTime, translateUnlimited } from '../../support/Utils';

import PropTypes from 'prop-types';

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

PaymentMethodFields.propTypes = {
  paymentMethods: PropTypes.array.isRequired,
  isEditing: PropTypes.bool.isRequired,
  selectedPaymentMethodIndex: PropTypes.number.isRequired,
  handlePaymentMethodChange: PropTypes.func.isRequired,
  handleDeletePaymentMethod: PropTypes.func.isRequired,
  openAddPaymentModal: PropTypes.func.isRequired,
};

function MemberFields({
  editedMember,
  isEditing,
  handleFieldChange,
  emailError,
  isFromMyAccount,
}) {
  return (
    <>
      {/* MEMBER FIELDS */}
      <div className="member-fields">
        <table>
          <tbody>
            <tr>
              <td className="label-cell">
                <label>Member ID:</label>
              </td>
              <td className="value-cell">
                <span>{editedMember.id}</span>
              </td>
              <td className="label-cell">
                <label>Role:</label>
              </td>
              <td className="value-cell">
                {isEditing ? (
                  <select
                    value={editedMember.role}
                    onChange={(e) => handleFieldChange('role', e.target.value)}
                    required
                    disabled={!isEditing || isFromMyAccount}
                  >
                    <option value="user" disabled={isFromMyAccount}>User</option>
                    <option value="admin" disabled={isFromMyAccount}>Admin</option>
                  </select>
                ) : (
                  <span>{editedMember.role}</span>
                )}
              </td>
            </tr>
            <tr>
              <td className="label-cell">
                <label>Email:</label>
              </td>
              <td className="value-cell">
                {isEditing ? (
                  <>
                    <input
                      type="email"
                      value={editedMember.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      required
                      disabled={isFromMyAccount}
                    />
                    <span className="error">{emailError}</span>
                  </>
                ) : (
                  <span>{editedMember.email}</span>
                )}
              </td>
            </tr>
            <tr>
              <td className="label-cell">
                <label>Name:</label>
              </td>
              <td className="value-cell">
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
              </td>
            </tr>
            <tr>
              <td className="label-cell">
                <label>Personal Number:</label>
              </td>
              <td className="value-cell">
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
              </td>
            </tr>
            <tr>
              <td className="label-cell">
                <label>Wallet SEK:</label>
              </td>
              <td className="value-cell">
                {isEditing ? (
                  <input
                    type="number"
                    value={editedMember.wallet}
                    onChange={(e) => handleFieldChange('wallet', e.target.value)}
                    required
                    disabled={isFromMyAccount}
                  />
                ) : (
                  <span>{editedMember.wallet}</span>
                )}
              </td>
            </tr>
            <tr>
              <td className="label-cell">
                <label>Address:</label>
              </td>
              <td className="value-cell" colSpan="3">
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
              </td>
            </tr>
          </tbody>
        </table>
        <div className="divider"></div>

      </div>
    </>
  );
}

MemberFields.propTypes = {
  editedMember: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  emailError: PropTypes.string.isRequired,
  isFromMyAccount: PropTypes.bool.isRequired,
};


function PlanFields({
  editedMember,
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
          {editedMember.active_plan_creation ? (
                <span>{formatDateTime(editedMember.active_plan_creation)}</span>
              ) : (
                <span></span>
              )}
          </td>
          <td>
            <label>Last activation:</label>
          </td>
          <td>
          {editedMember.active_plan_paused === 'Y' ? (
                <span>Inactive</span>
              ) : (
                editedMember.active_plan_activation ? (
                  <span>{formatDateTime(editedMember.active_plan_activation)}</span>
                ) : (
                  <span></span>
                )
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
            {/*
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
              */}
            </tr>
        </tbody>
      </table>
      <div className="divider"></div>
    </>
  );
  
  
  
}

PlanFields.propTypes = {
  editedMember: PropTypes.object.isRequired,
  isEditing: PropTypes.bool,
  handleFieldChange: PropTypes.func,
  handleEdit: PropTypes.func,
//  handleDelete: PropTypes.func.isRequired,
//  onRequestClose: PropTypes.func.isRequired,
  openManagePlanModal: PropTypes.func.isRequired,
  openChangePlanModal: PropTypes.func.isRequired,
};

export { PaymentMethodFields, MemberFields, PlanFields };

