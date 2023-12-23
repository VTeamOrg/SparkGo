import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './Modal.css';
import PropTypes from 'prop-types';
import { fetchData, updateData, deleteData } from '../../support/FetchService';
import { validateEmail, formatDateTime } from '../../support/Utils';
import AddPaymentModal from './AddPaymentModal.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';
import { PaymentMethodFields, MemberFields, PlanFields } from '../Fields/Fields.jsx';

function MemberModal({ isOpen, onRequestClose, member, onEditMember, refreshMembers }) { 

  const [isEditing, setIsEditing] = useState(false);
  const [editedMember, setEditedMember] = useState({ ...member });
  const [emailError, setEmailError] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(''); 
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [selectedPaymentMethodIndex, setSelectedPaymentMethodIndex] = useState(-1);

  const refreshMembersModalData = () => {
    const memberId = editedMember.id;
    
    if (memberId) {
      fetchData(`paymentMethods/memberid/${memberId}`, (data) => {
        // Find the selected payment method (is_selected === 'Y')
        const selectedMethod = data.find((method) => method.is_selected === 'Y');
  

  
        // Find the selected payment method index (is_selected === 'Y')
        const selectedIndex = data.findIndex((method) => method.is_selected === 'Y');
        setSelectedPaymentMethodIndex(selectedIndex);
  
        // Update the payment reference for the entire row
        setEditedMember((prevMember) => ({
          ...prevMember,
          payment_reference: selectedMethod ? selectedMethod.reference_info : '',
        }));
  
        // Update paymentMethods state
        setPaymentMethods(data);
      });
    }
  };
  
  useEffect(() => {
    fetchData('plans', (data) => {
      setPlans(data);
      console.log(data);
    });
  
    const memberId = editedMember.id;
  
    if (memberId) {
      refreshMembersModalData();
    }
  }, [editedMember.id]);
  
  
  // Function to open the "AddPaymentModal"
  const openAddPaymentModal = () => {
    setIsAddPaymentModalOpen(true);
  };

  // Function to close the "AddPaymentModal"
  const closeAddPaymentModal = () => {
    setIsAddPaymentModalOpen(false);
  };

  const handleAddPaymentSave = () => {
    refreshMembersModalData();
    closeAddPaymentModal();
  };

  const handleFieldChange = (field, value) => {
    setEditedMember({ ...editedMember, [field]: value });

    // Validate email when email field changes
    if (field === 'email') {
      const isValidEmail = validateEmail(value);
      setEmailError(isValidEmail ? '' : 'Invalid email format');
    }
  };

  const handlePaymentMethodChange = (selectedMethod, index) => {
    setSelectedPaymentMethod(selectedMethod);
    setSelectedPaymentMethodIndex(index);
  
    const updatedPaymentMethods = [...paymentMethods];
    updatedPaymentMethods.forEach((method, i) => {
      method.is_selected = i === index ? 'Y' : 'N';
    });
  
    setPaymentMethods(updatedPaymentMethods);
  
    // Update the editedMember with selected payment method info
    setEditedMember((prevEditedMember) => ({
      ...prevEditedMember,
      payment_method: selectedMethod,
      payment_reference: updatedPaymentMethods[index].reference_info || '',
      payment_selected: 'Y', // Always set to 'Y' for the selected method
    }));
  };
  
  const handleEdit = () => {
    // Check if email is valid before editing
    if (editedMember.email && !validateEmail(editedMember.email)) {
      setEmailError('Invalid email format');
      return;
    }
  
    // Update the member data
    updateData('users', editedMember.id, editedMember)
      .then(() => {
        // Update all payment method data for the member
        const updatedPaymentMethodData = paymentMethods.map((method) => ({
          id: method.id,
          member_id: editedMember.id, 
          method_name: method.method_name,
          reference_info: method.reference_info,
          is_selected: method.is_selected === 'Y' ? 'Y' : 'N', 
        }));
  
        // Update paymentMethod data
        Promise.all(
          updatedPaymentMethodData.map((methodData) =>
            updateData('paymentMethods', methodData.id, methodData)
          )
        )
          .then(() => {
            if (onEditMember) {
              onEditMember(editedMember);
            }
            setIsEditing(false);
            onRequestClose();
  
            if (refreshMembers) {
              refreshMembers();
            }
          })
          .catch((error) => {
            console.error('Error updating paymentMethod:', error);
          });
      })
      .catch((error) => {
        console.error('Error updating member:', error);
      });
  };
  
  const handleDeletePaymentMethod = (paymentMethodId) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      deleteData('paymentMethods', paymentMethodId)
        .then(() => {
          refreshMembersModalData();
        })
        .catch((error) => {
          console.error('Error deleting payment method:', error);
        });
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      deleteData('users', member.id)
        .then(() => {
          onRequestClose();
          if (refreshMembers) {
            refreshMembers();
          }
        })
        .catch((error) => {
          console.error('Error deleting member:', error);
        });
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="member-modal">
      <h2>{isEditing ? 'Edit Member' : 'View Member'}</h2>

      <MemberFields
        editedMember={editedMember}
        isEditing={isEditing}
        handleFieldChange={handleFieldChange}
        emailError={emailError}
        />

      <PaymentMethodFields
        paymentMethods={paymentMethods}
        isEditing={isEditing}
        selectedPaymentMethodIndex={selectedPaymentMethodIndex}
        handlePaymentMethodChange={handlePaymentMethodChange}
        handleDeletePaymentMethod={handleDeletePaymentMethod}
        openAddPaymentModal={openAddPaymentModal}
        />

        <PlanFields
        editedMember={editedMember}
        isEditing={isEditing}
        handleFieldChange={handleFieldChange}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        onRequestClose={onRequestClose}
        />

      <div className="divider"></div>
      <div className="row">
        {isEditing ? (
          <>
            <button onClick={handleEdit}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
          </>
        )}
        <button onClick={onRequestClose}>Close</button>
      </div>
    
    {/* AddPaymentModal */}
    {isAddPaymentModalOpen && (
        <AddPaymentModal
          isOpen={isAddPaymentModalOpen}
          onRequestClose={closeAddPaymentModal}
          memberId={editedMember.id}
          memberName={editedMember.name}
          onSave={handleAddPaymentSave}
        />
      )}

    </Modal>
  );
}

MemberModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  member: PropTypes.object.isRequired,
  onEditMember: PropTypes.func,
  onDeleteMember: PropTypes.func,
  refreshMembers: PropTypes.func,
};

export default MemberModal;
