import React, { useState } from 'react';
import Modal from 'react-modal';
import '../CSS/Modal.css';
import { createData } from '../../support/FetchService';
import { validateEmail } from '../../support/Utils';
import AddMemberModalContent from '../HTML/AddMember';

function AddMemberModal({ isOpen, onRequestClose, refreshMembers }) {
  const [newMember, setNewMember] = useState({
    role: 'User',
    email: '',
    name: '',
    personal_number: '',
    address: '',
    wallet: 0,
  });

  const [emailError, setEmailError] = useState('');

  const handleAddMember = () => {
    if (!validateEmail(newMember.email)) {
      setEmailError('Invalid email format');
      return;
    }

    // Clear the email error if it was previously set
    setEmailError('');

    // Assuming you have a createData function for adding members
    createData('users', newMember)
      .then((createdMember) => {
        onRequestClose();

        if (refreshMembers) {
          refreshMembers();
        }
      })
      .catch((error) => {
        console.error('Error adding member:', error);
      });
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="add-member-modal">
      <AddMemberModalContent
        newMember={newMember}
        setNewMember={setNewMember}
        emailError={emailError}
        setEmailError={setEmailError}
        onRequestClose={onRequestClose}
        handleAddMember={handleAddMember}
      />
    </Modal>
  );
}

export default AddMemberModal;
