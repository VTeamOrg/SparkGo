import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../CSS/Modal.css';
import PropTypes from 'prop-types';
import { fetchData, createData } from '../../support/FetchService';

function AddPaymentModal({ isOpen, onRequestClose, memberId, memberName, onSave }) {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [referenceInfo, setReferenceInfo] = useState('');

  useEffect(() => {
    fetchData('paymentMethods', (data) => {
      setPaymentMethods(data);
    });
  }, []);

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
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <h2>Add Payment Method for member: {memberId} - {memberName}</h2>
        <div>
          <label>Payment Method (e.g. VISA, KLARNA):</label>
          <input
            type="text"
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Reference Info:</label>
          <input
            type="text"
            value={referenceInfo}
            onChange={(e) => setReferenceInfo(e.target.value)}
            required
          />
        </div>
        <div>
          <button onClick={handleSave}>Save</button>
          <button onClick={onRequestClose}>Cancel</button>
        </div>
      </div>
    </div>
    </Modal>
  );
}

AddPaymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  memberId: PropTypes.number.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default AddPaymentModal;
