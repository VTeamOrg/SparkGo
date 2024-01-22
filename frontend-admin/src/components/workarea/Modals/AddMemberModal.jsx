import { useState } from 'react';
import Modal from 'react-modal';
import '../CSS/Modal.css';
import { createData } from '../../support/FetchService';
import { validateEmail } from '../../support/Utils';
import AddMemberModalContent from '../HTML/AddMember';
import PropTypes from 'prop-types';

/**
 * AddMemberModal component displays a modal for adding new members.
 *
 * @param {Object} props - The component's props.
 * @param {boolean} props.isOpen - Indicates whether the modal is open.
 * @param {Function} props.onRequestClose - Callback function to close the modal.
 * @param {Function} props.refreshMembers - Callback function to refresh the list of members.
 */
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

  /**
   * Handles the addition of a new member.
   */
  const handleAddMember = () => {
    if (!validateEmail(newMember.email)) {
      setEmailError('Invalid email format');
      return;
    }

    /* Clear the email error if it was previously set */
    setEmailError('');

    createData('users', newMember)
      .then(() => {
        onRequestClose();

        if (refreshMembers) {
          refreshMembers();
        }
      })
      .catch((error) => {
        console.error('Error adding member:', error);
      });
  };

  AddMemberModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    refreshMembers: PropTypes.func.isRequired,
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
