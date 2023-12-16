import React, { useState } from 'react';
import Modal from 'react-modal';
import './Modal.css';
import PropTypes from 'prop-types';
import { fetchData, updateData, deleteData } from '../../support/FetchService';
import { validateEmail } from '../../support/Utils';

function MemberModal({ isOpen, onRequestClose, member, onEditMember, refreshMembers }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMember, setEditedMember] = useState({ ...member });
  const [emailError, setEmailError] = useState('');

  const handleFieldChange = (field, value) => {
    setEditedMember({ ...editedMember, [field]: value });

    // Validate email when email field changes
    if (field === 'email') {
      const isValidEmail = validateEmail(value);
      setEmailError(isValidEmail ? '' : 'Invalid email format');
    }
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
        console.error('Error updating member:', error);
      });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      deleteData('users', member.id)
        .then(() => {
          onRequestClose(); // Close the modal
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
            className="full-width four-lines"
            value={editedMember.address}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            required
          />
        ) : (
          <span>{editedMember.address}</span>
        )}
      </div>
      <div>
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
