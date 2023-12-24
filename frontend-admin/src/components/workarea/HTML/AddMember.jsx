import React from 'react';
import '../CSS/Modal.css';

function AddMemberModalContent({ newMember, setNewMember, emailError, setEmailError, onRequestClose, handleAddMember }) {
  return (
    <>
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
    </>
  );
}

export default AddMemberModalContent;
