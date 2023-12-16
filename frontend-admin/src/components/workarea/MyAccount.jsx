import React, { useState } from 'react';
import './WorkArea.css';

/**
 * MyAccount component for displaying and editing account information.
 */
function MyAccount() {
    /**
     * State to track whether the form is in edit mode or not.
     * @type {boolean}
     */    
    const [isEditing, setIsEditing] = useState(false);
  
    /**
     * Initial account information (dummy data).
     * @type {Object}
     */
    const initialAccountInfo = {
      name: 'John Doe',
      address: '123 Main St, City',
      personalNumber: '123-45-6789',
      activePlan: 'Premium Plan',
      wallet: '500.00 SEK',
      email: 'anna.blixt@gmail.com'
    };
  
    /**
     * State to store the current account information.
     * @type {Object}
     */
    const [accountInfo, setAccountInfo] = useState(initialAccountInfo);
  
    /**
     * Function to handle the "Edit" button click, toggling edit mode.
     */
    const handleEditClick = () => {
      setIsEditing(!isEditing);
    };

    /**
     * Function to handle input field changes and update the information state.
     * @param {Object} e - The event object.
     */
    const handleInputChange = (e) => {
      const { name, value } = e.target;
  
      setAccountInfo({
        ...accountInfo,
        [name]: value,
      });
    };

    /* RETURN */
  return (
    <div className="my-account">
      <h2>My Account</h2>
      <form>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={accountInfo.name}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={accountInfo.email}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={accountInfo.address}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="personalNumber">Personal Number</label>
          <input
            type="text"
            id="personalNumber"
            name="personalNumber"
            value={accountInfo.personalNumber}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="activePlan">Active Plan</label>
          <input
            type="text"
            id="activePlan"
            name="activePlan"
            value={accountInfo.activePlan}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="wallet">Wallet</label>
          <input
            type="text"
            id="wallet"
            name="wallet"
            value={accountInfo.wallet}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
        </div>
      </form>
      <button onClick={handleEditClick}>
        {isEditing ? 'Save' : 'Edit'} 
      </button>      
    </div>
  );
}

export default MyAccount;
