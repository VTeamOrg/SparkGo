import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './CSS/WorkArea.css';
import { fetchData, updateData, deleteData } from '../support/FetchService';
import { validateEmail, formatDateTime, translateUnlimited } from '../support/Utils';
import AddPaymentModal from './Modals/AddPaymentModal.jsx';
import { PaymentMethodFields, MemberFields, PlanFields } from './HTML/MemberModal.jsx';
import { SearchBar, ButtonRow } from './HTML/General';
import ManagePlanModal from './Modals/ManagePlanModal';
import ChangePlanModal from './Modals/ChangePlanModal';

function MyAccount({ userId }) { 

  const [isEditing, setIsEditing] = useState(false);
  const [editedMember, setEditedMember] = useState({});
  const [emailError, setEmailError] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(''); 
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [selectedPaymentMethodIndex, setSelectedPaymentMethodIndex] = useState(-1);
  const [isManagePlanModalOpen, setIsManagePlanModalOpen] = useState(false);
  const [isChangePlanModalOpen, setIsChangePlanModalOpen] = useState(false);
  const [isPaymentMethodChanged, setIsPaymentMethodChanged] = useState(false);


  const refreshMembers = () => {
    fetchData(`users/${userId}`, (userData) => {
      setEditedMember(userData);
    });
  
    fetchData(`paymentMethods/memberid/${userId}`, (paymentData) => {
  
      // Check if paymentData is an array
      if (Array.isArray(paymentData)) {
        const selectedMethodIndex = paymentData.findIndex((method) => method.is_selected === 'Y');
  
        setSelectedPaymentMethodIndex(selectedMethodIndex);
  
        setEditedMember((prevMember) => ({
          ...prevMember,
          payment_reference: selectedMethodIndex !== -1 ? paymentData[selectedMethodIndex].reference_info || '' : '',
        }));
  
        setPaymentMethods(paymentData);
      } else {
        console.error('Invalid payment data format: paymentData is not an array');
      }
    });
  };
  

  useEffect(() => {
    refreshMembers();
  }, [userId]);

  const openManagePlanModal = () => {
    setIsManagePlanModalOpen(true);
  };

  const closeManagePlanModal = () => {
    setIsManagePlanModalOpen(false);
  };  

  const editedActivePlan = (editedPlan) => {
    refreshMembers();
  };

  const editedChangedPlan = (editedPlan) => {
    refreshMembers();
    };

  const openChangePlanModal = () => {
    setIsChangePlanModalOpen(true);
  };

  const closeChangePlanModal = () => {
    setIsChangePlanModalOpen(false);
  };  

  const openAddPaymentModal = () => {
    setIsAddPaymentModalOpen(true);
  };

  const closeAddPaymentModal = () => {
    setIsAddPaymentModalOpen(false);
  };

  const handleAddPaymentSave = () => {
    refreshMembers();
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
    setIsPaymentMethodChanged(true); 
  };

  const handleEdit = () => {
    if (editedMember.email && !validateEmail(editedMember.email)) {
      setEmailError('Invalid email format');
      return;
    }
  
    updateData('users', editedMember.id, editedMember)
      .then(() => {

        if (isPaymentMethodChanged  === true) {

          const updatedPaymentMethodData = paymentMethods.map((method) => ({
            id: method.id,
            member_id: editedMember.id,
            method_name: method.method_name,
            reference_info: method.reference_info,
            is_selected: method.is_selected === 'Y' ? 'Y' : 'N',
          }));

          console.log("updated data", updatedPaymentMethodData);
  
          Promise.all(
            updatedPaymentMethodData.map((methodData) =>
              updateData('paymentMethods', methodData.id, methodData)
            )
          )
            .catch((error) => {
              console.error('Error updating paymentMethod:', error);
            });
        }

          refreshMembers();
      })
      .catch((error) => {
        console.error('Error updating member:', error);
      });
      setIsEditing(false);
      setIsPaymentMethodChanged(false); 
  };
  

  const handleDeletePaymentMethod = (paymentMethodId) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      deleteData('paymentMethods', paymentMethodId)
        .then(() => {
          refreshMembers();
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

  const onRequestClose = () => {
    setIsEditing(false);
  };

  return (
    <div className="member-view">
      <h2>{isEditing ? 'Edit my information' : 'My Account'}</h2>
  
      {/* Render MemberFields component */}
      <MemberFields
        editedMember={editedMember}
        isEditing={isEditing}
        handleFieldChange={handleFieldChange}
        emailError={emailError}
        isFromMyAccount={true}
      />
  
      {/* Render PaymentMethodFields component */}
      <PaymentMethodFields
        paymentMethods={paymentMethods}
        isEditing={isEditing}
        selectedPaymentMethodIndex={selectedPaymentMethodIndex}
        handlePaymentMethodChange={handlePaymentMethodChange}
        handleDeletePaymentMethod={handleDeletePaymentMethod}
        openAddPaymentModal={openAddPaymentModal}
      />
  
      {/* Render PlanFields component */}
      <PlanFields
        editedMember={editedMember}
        isEditing={isEditing}
        handleFieldChange={handleFieldChange}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        onRequestClose={() => closeManagePlanModal()}
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
          fromMyAccount={true}
        />
      )}
  
      {/* ChangePlanModal */}
      {isChangePlanModalOpen && (
        <ChangePlanModal
          isOpen={isChangePlanModalOpen}
          onRequestClose={() => closeChangePlanModal()}
          activePlan={editedMember}
          onSave={editedChangedPlan}
          fromMyAccount={true}
        />
      )}
    </div>
  );
  
}

MyAccount.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default MyAccount;
