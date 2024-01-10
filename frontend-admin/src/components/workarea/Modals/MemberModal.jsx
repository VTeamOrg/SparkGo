import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../CSS/Modal.css';
import PropTypes from 'prop-types';
import { fetchData, updateData, deleteData } from '../../support/FetchService';
import { validateEmail, formatDateTime, translateUnlimited } from '../../support/Utils';
import AddPaymentModal from './AddPaymentModal.jsx';
import { PaymentMethodFields, MemberFields, PlanFields } from '../HTML/MemberModal.jsx';
import { SearchBar, ButtonRow } from '../HTML/General';
import ManagePlanModal from './ManagePlanModal';
import ChangePlanModal from './ChangePlanModal';

function MemberModal({ isOpen, onRequestClose, member, onEditMember, refreshMembers }) { 

  const [isEditing, setIsEditing] = useState(false);
  const [editedMember, setEditedMember] = useState({ ...member });
  const [emailError, setEmailError] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(''); 
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [selectedPaymentMethodIndex, setSelectedPaymentMethodIndex] = useState(-1);
  const [isManagePlanModalOpen, setIsManagePlanModalOpen] = useState(false);
  const [isChangePlanModalOpen, setIsChangePlanModalOpen] = useState(false);

  const refreshMembersModalData = () => {
    const memberId = editedMember.id;
    
    if (memberId) {
      fetchData(`users/${memberId}`, (data) => {
        setEditedMember(data);
      });

      fetchData(`paymentMethods/memberid/${memberId}`, (data) => {
        const selectedMethod = data.find((method) => method.is_selected === 'Y');
        const selectedIndex = data.findIndex((method) => method.is_selected === 'Y');
        
        setSelectedPaymentMethodIndex(selectedIndex);
  
        setEditedMember((prevMember) => ({
          ...prevMember,
          payment_reference: selectedMethod ? selectedMethod.reference_info : '',
        }));
  
        setPaymentMethods(data);
      });
    }
  };
  
  useEffect(() => {
  
    const memberId = editedMember.id;
  
    if (memberId) {
      refreshMembersModalData();
    }
  }, [editedMember.id]);

  const openManagePlanModal = () => {
    setIsManagePlanModalOpen(true);
  };

  const closeManagePlanModal = () => {
    setIsManagePlanModalOpen(false);
  };  

  const editedActivePlan = (editedPlan) => {
    refreshMembersModalData();
    };

    const openChangePlanModal = () => {
      setIsChangePlanModalOpen(true);
    };
  
    const closeChangePlanModal = () => {
      setIsChangePlanModalOpen(false);
    };  
  
    const editedChangedPlan = (editedPlan) => {
      refreshMembersModalData();
      };

  const openAddPaymentModal = () => {
    setIsAddPaymentModalOpen(true);
  };

  const closeAddPaymentModal = () => {
    setIsAddPaymentModalOpen(false);
  };

  const handleAddPaymentSave = () => {
    refreshMembersModalData();
    closeAddPaymentModal();
  };

  const handleFieldChange = (field, value) => {
    setEditedMember({ ...editedMember, [field]: value });

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
  
    setEditedMember((prevEditedMember) => ({
      ...prevEditedMember,
      payment_method: selectedMethod,
      payment_reference: updatedPaymentMethods[index].reference_info || '',
      payment_selected: 'Y',
    }));
  };
  
  const handleEdit = () => {
    if (editedMember.email && !validateEmail(editedMember.email)) {
      setEmailError('Invalid email format');
      return;
    }
  
    updateData('users', editedMember.id, editedMember)
      .then(() => {

        const updatedPaymentMethodData = paymentMethods.map((method) => ({
          id: method.id,
          member_id: editedMember.id, 
          method_name: method.method_name,
          reference_info: method.reference_info,
          is_selected: method.is_selected === 'Y' ? 'Y' : 'N', 
        }));
  
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

  // NOTE: NEEDS THE DELETE MEMBER PROCEDURE!!!! 
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

    {/* MemberFields */}
      <MemberFields
        editedMember={editedMember}
        isEditing={isEditing}
        handleFieldChange={handleFieldChange}
        emailError={emailError}
        />

    {/* PaymentMethodFields */}
      <PaymentMethodFields
        paymentMethods={paymentMethods}
        isEditing={isEditing}
        selectedPaymentMethodIndex={selectedPaymentMethodIndex}
        handlePaymentMethodChange={handlePaymentMethodChange}
        handleDeletePaymentMethod={handleDeletePaymentMethod}
        openAddPaymentModal={openAddPaymentModal}
        />

    {/* PlanFields */}
    <PlanFields
      editedMember={editedMember}
      isEditing={isEditing}
      handleFieldChange={handleFieldChange}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      onRequestClose={() => closeManagePlanModal} 
      openManagePlanModal={openManagePlanModal} 
      openChangePlanModal={openChangePlanModal} 
    />

    {/* General Buttons */}
      <ButtonRow
        isEditing={isEditing}
        handleEdit={handleEdit}
        setIsEditing={setIsEditing}
        handleDelete={handleDelete} 
        onRequestClose={onRequestClose} 
        />
    
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

    {/* ManagePlanModal */}
    {isManagePlanModalOpen && (
      <ManagePlanModal
        isOpen={isManagePlanModalOpen}
        onRequestClose={() => closeManagePlanModal()} 
        activePlan={editedMember}
        onSave={editedActivePlan}
      />
    )}

    {/* ChangePlanModal */}
    {isChangePlanModalOpen && (
      <ChangePlanModal
        isOpen={isChangePlanModalOpen}
        onRequestClose={() => closeChangePlanModal()} 
        activePlan={editedMember}
        onSave={editedChangedPlan}
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
