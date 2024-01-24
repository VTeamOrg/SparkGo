import { useState, useEffect } from 'react';
import './CSS/ApiTables.css';
import { fetchData } from '../support/FetchService';
import AddMemberModal from './Modals/AddMemberModal'; 
import MemberModal from './Modals/MemberModal'; 
import MembersTable from './HTML/Members'; 
import { SearchBar } from './HTML/General';

/**
 * Component for managing and displaying members.
 */
function Members() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isMemberModalOpen, setMemberModalOpen] = useState(false);

  useEffect(() => {
    refreshMembersData();
  }, []);

  const refreshMembersData = () => {
    fetchData('users', (data) => {
        // Remove duplicate members based on their IDs
        const uniqueMembers = data.filter((member, index, self) =>
          index === self.findIndex((m) => m.id === member.id)
        );
        setMembers(uniqueMembers);
      });
  };

  /**
   * Handle opening the "Add Member" modal.
   */
  const openAddMemberModal = () => {
    setAddMemberModalOpen(true);
  };

  /**
   * Handle closing the "Add Member" modal.
   */
  const closeAddMemberModal = () => {
    setAddMemberModalOpen(false);
  };

  /**
   * Handle opening the MemberModal.
   * @param {object} member - The member object to display.
   */
  const openMemberModal = (member) => {
    setSelectedMember(member);
    setMemberModalOpen(true);
  };

  /**
   * Handle closing the MemberModal.
   */
  const closeMemberModal = () => {
    setSelectedMember(null);
    setMemberModalOpen(false);
  };

  /**
   * Filter and display members based on the search term.
   * @type {array} filteredMembers - The filtered members to be displayed.
   */
  const filteredMembers = members
    ? searchTerm
      ? members.filter((member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : members
    : [];

/* JSX to render data */
return (
    <div className="api">
      <h2>Members</h2>
  
      {/* Add Member button */}
      <button className="add-member-button" onClick={openAddMemberModal}>
        Add Member
      </button>
  
      {/* Search bar */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
  
      {/* Member Table */ }
      <MembersTable
        filteredMembers={filteredMembers}
        openMemberModal={openMemberModal}
      />
  
      {/* Add Member Modal */}
      {isAddMemberModalOpen && (
        <AddMemberModal
          isOpen={isAddMemberModalOpen}
          onRequestClose={closeAddMemberModal}
          refreshMembers={refreshMembersData}
        />
      )}
  
      {/* Edit Member Modal */}
      {isMemberModalOpen && selectedMember && (
        <MemberModal
          isOpen={isMemberModalOpen}
          onRequestClose={closeMemberModal}
          member={selectedMember}
          refreshMembers={refreshMembersData}
        />
      )}
    </div>
  );
  
}

export default Members;