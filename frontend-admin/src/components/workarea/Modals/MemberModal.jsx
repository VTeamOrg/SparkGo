import { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import '../CSS/Modal.css';
import PropTypes from 'prop-types';
import { fetchData, updateData, deleteData } from '../../support/FetchService';
import { validateEmail } from '../../support/Utils';
import AddPaymentModal from './AddPaymentModal.jsx';
import { PaymentMethodFields, MemberFields, PlanFields } from '../HTML/MemberModal.jsx';
import { ButtonRow } from '../HTML/General';
import ManagePlanModal from './ManagePlanModal';
import ChangePlanModal from './ChangePlanModal';

function MemberModal({ isOpen, onRequestClose, member, onEditMember, refreshMembers, isFromMyAccount }) { 

  const [isEditing, setIsEditing] = useState(false);
//  const [editedMember, setEditedMember] = useState({ ...member });
  const [editedMember, setEditedMember] = useState({});
  const [emailError, setEmailError] = useState('');
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [selectedPaymentMethodIndex, setSelectedPaymentMethodIndex] = useState(-1);
  const [isManagePlanModalOpen, setIsManagePlanModalOpen] = useState(false);
  const [isChangePlanModalOpen, setIsChangePlanModalOpen] = useState(false);
  const [isPaymentMethodChanged, setIsPaymentMethodChanged] = useState(false);

  const refreshMembersModalData = useCallback(() => {
    const memberId = member.id;
    
    if (memberId) {
      fetchData(`users/${memberId}`, (data) => {
        setEditedMember(data[0]);
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
  }, [editedMember.id, setEditedMember, setSelectedPaymentMethodIndex, setPaymentMethods]);

  
  useEffect(() => {
    const memberId = member.id;

    if (memberId) {
      refreshMembersModalData();
    }
  }, [editedMember.id, refreshMembersModalData]);

  const openManagePlanModal = () => {
    setIsManagePlanModalOpen(true);
  };

  const closeManagePlanModal = () => {
    setIsManagePlanModalOpen(false);
  };  

  const editedActivePlan = () => {
    refreshMembersModalData();
    };

    const openChangePlanModal = () => {
      setIsChangePlanModalOpen(true);
    };
  
    const closeChangePlanModal = () => {
      setIsChangePlanModalOpen(false);
    };  
  
    const editedChangedPlan = () => {
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
        if (isPaymentMethodChanged === true) {

          const updatedPaymentMethodData = paymentMethods.map((method) => ({
            paymentMethodId: method.id,
            member_id: editedMember.id,
            method_name: method.method_name,
            reference_info: method.reference_info,
            is_selected: method.is_selected === 'Y' ? 'Y' : 'N',
          }));

          Promise.all(
            updatedPaymentMethodData.map((methodData) =>
              updateData('paymentMethods', methodData.paymentMethodId, methodData)
                .then(() => {
                  console.log(`Payment method ${methodData.paymentMethodId} updated successfully`);
                })
                .catch((error) => {
                  console.error(`Error updating payment method ${methodData.paymentMethodId}:`, error);
                })
            )
          )
            .then(() => {
              console.log("All payment methods updated successfully");
              refreshMembers();
            })
            .catch((error) => {
              console.error('Error updating payment methods:', error);
            });
        } else {
          refreshMembers();
        }
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
        isFromMyAccount={isFromMyAccount}
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
  isFromMyAccount: PropTypes.bool,
};

export default MemberModal;
