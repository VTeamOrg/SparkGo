import { useState } from 'react';
import Modal from 'react-modal';
import '../CSS/Modal.css';
import PropTypes from 'prop-types';
import { createData } from '../../support/FetchService';
import AddPaymentMethod from '../HTML/AddPaymentMethod';

/**
 * AddPaymentModal component displays a modal for adding payment methods for a member.
 *
 * @param {Object} props - The component's props.
 * @param {boolean} props.isOpen - Indicates whether the modal is open.
 * @param {Function} props.onRequestClose - Callback function to close the modal.
 * @param {number} props.memberId - The ID of the member for whom the payment method is being added.
 * @param {string} props.memberName - The name of the member for whom the payment method is being added.
 * @param {Function} props.onSave - Callback function to save the payment method.
 */
function AddPaymentModal({ isOpen, onRequestClose, memberId, memberName, onSave }) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [referenceInfo, setReferenceInfo] = useState('');

  /**
   * Handles saving the payment method for the member.
   */
  const handleSave = () => {
    if (selectedPaymentMethod === '' || referenceInfo === '') {
      alert('Please select a payment method and provide reference info.');
      return;
    }
  
    const newPayment = {
      member_id: memberId,
      method_name: selectedPaymentMethod,
      reference_info: referenceInfo,
      is_selected: 'N',
    };
  
    // Use the createData function to add a new payment method
    createData('paymentMethods', newPayment)
      .then(() => {
        onSave();
        onRequestClose();
      })
      .catch((error) => {
        console.error('Error adding payment method:', error);
      });
  };  

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="modal-overlay"
    >
      <AddPaymentMethod
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        memberId={memberId}
        memberName={memberName}
        selectedPaymentMethod={selectedPaymentMethod}
        referenceInfo={referenceInfo}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
        setReferenceInfo={setReferenceInfo}
        handleSave={handleSave}
      />
    </Modal>
  );
}

AddPaymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  memberId: PropTypes.number.isRequired,
  memberName: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default AddPaymentModal;
