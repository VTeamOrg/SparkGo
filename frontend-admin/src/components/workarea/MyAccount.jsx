import React, { useState, useEffect } from 'react';
import './CSS/WorkArea.css';
import { fetchById, updateData } from '../support/FetchService';
import MemberModal from './Modals/MemberModal'; // Import the MemberModal component

/**
 * MyAccount component for displaying and editing account information.
 */
function MyAccount({ userId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isMemberModalOpen, setMemberModalOpen] = useState(false); // Initialize modal as closed
  const [accountInfo, setAccountInfo] = useState({
    name: '',
    email: '',
    address: '',
    personal_number: '', // Updated field name
    active_plan_name: '',
    wallet: '',
  });

  const [editedAccountInfo, setEditedAccountInfo] = useState({
    name: '',
    address: '',
    personal_number: '', // Updated field name
    active_plan_name: '',
  });

  // Fetch account data when not in editing mode
  useEffect(() => {
    if (!isEditing) {
      const fetchData = async () => {
        try {
          console.log("Fetching data for userId: ", userId);
          const data = await fetchById('users', userId);
          console.log(data);
          setAccountInfo(data);
          setEditedAccountInfo(data);
          setMemberModalOpen(true); // Open the modal when data is loaded
        } catch (error) {
          console.error("Error fetching data: ", error);
        }
      };
  
      fetchData();
    }
  }, [userId, isEditing]);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  // Rest of your component code...

  return (
    <div className="my-account">
      <h2>My Account</h2>
      {/* Rest of your component code... */}
      
      {/* Render the MemberModal component */}
      {isMemberModalOpen && (
        <div className="custom-member-modal"> 
          <MemberModal
            isOpen={isMemberModalOpen}
            onRequestClose={() => setMemberModalOpen(false)}
            member={accountInfo} // Pass the accountInfo as the member
          />
        </div>
      )}
    </div>
  );
}

export default MyAccount;
