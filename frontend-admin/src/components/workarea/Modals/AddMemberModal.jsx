import React, { useState } from 'react';
import Modal from 'react-modal';
import './Modal.css';
import { createData } from '../../support/FetchService';
import { validateEmail } from '../../support/Utils';

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
      <h2>Add Member</h2>
      <div>
        <label>Role:</label>
        <select
          value={newMember.role}
          onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
          required
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={newMember.email}
          onChange={(e) => {
            setNewMember({ ...newMember, email: e.target.value });
            setEmailError('');
          }}
          required
        />
        {emailError && <div className="error-message">{emailError}</div>}
      </div>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={newMember.name}
          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Personal Number:</label>
        <input
          type="text"
          value={newMember.personal_number}
          onChange={(e) =>
            setNewMember({ ...newMember, personal_number: e.target.value })
          }
          required
        />
      </div>
      <div>
        <label>Address:</label>
        <textarea
            className="address-input" 
            rows="4" 
            value={newMember.address}
            onChange={(e) => setNewMember({ ...newMember, address: e.target.value })}
            required
        />
        </div>
      <div>
        <button onClick={handleAddMember}>Add Member</button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
    </Modal>
  );
}

export default AddMemberModal;
