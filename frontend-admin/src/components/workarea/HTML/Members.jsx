import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

function MembersTable({
  filteredMembers,
  openMemberModal,
}) {
  return (
    <div className="api-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredMembers.map((member, index) => (
            <tr
              key={index}
              className="api-row"
              onClick={() => openMemberModal(member)} 
            >
              <td>{member.id}</td>
              <td>{member.name}</td>
              <td>{member.role}</td>
              <td>{member.email}</td>
              <td>
                <button
                  className="edit-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openMemberModal(member);
                  }}
                >
                  <FontAwesomeIcon icon={faPencilAlt} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MembersTable;
