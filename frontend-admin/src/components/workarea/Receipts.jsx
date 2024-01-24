import { useState, useEffect } from 'react';
import './CSS/ApiTables.css';
import { fetchData } from '../support/FetchService';

/**
 * Format a date to "yyyy-MM-dd hh:mm" format.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
function formatDate(date) {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleString('en-US', options);
}

/**
 * Receipts component for displaying a list of receipts.
 * @returns {JSX.Element} JSX representing the receipts component.
 */
function Receipts({ userId }) {
  const [receipts, setReceipts] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [memberOptions, setMemberOptions] = useState([]);

  useEffect(() => {
    fetchData(`users/${userId}`, (userData) => {
      setUserRole(userData[0].role);
    });

    fetchData('receipts', (data) => {
      data.sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date));

      if (userRole === 'admin' && selectedMember === '') {
        /* Admin should see no receipts until a user is selected */
        setReceipts([]);
      } else {
        setReceipts(data);
      }

      /* Extract unique member IDs and names from receipts */
      const uniqueMembersMap = new Map();
      data.forEach((receipt) => {
        uniqueMembersMap.set(receipt.member_id, receipt.member_name);
      });
      const uniqueMembers = Array.from(uniqueMembersMap).map(([id, name]) => ({ id, name }));

      setMemberOptions(uniqueMembers);
    });
  }, [userId, userRole, selectedMember]);

  const handleMemberSelect = (event) => {
    const memberId = event.target.value;
    setSelectedMember(memberId);
  };

  return (
    <div className="misc-history">
      <h2>Receipts</h2>

      {userRole === 'admin' && (
        /* Search bar with dropdown list of members for admin */
        <div className="search-bar">
          <select value={selectedMember} onChange={handleMemberSelect}>
            <option value="">Select Member</option>
            {memberOptions.map((member) => (
              <option key={member.id} value={member.id}>
                {`${member.id} - ${member.name}`}
              </option>
            ))}
          </select>
        </div>
      )}

      <ul>
        {receipts
          .filter((receipt) => {
            if (userRole === 'admin') {
              return selectedMember === '' || receipt.member_id.toString() === selectedMember;
            } else {
              return receipt.member_id.toString() === userId.toString();
            }
          })
          .map((receipt) => (
            <li key={receipt.id} className="history-entry">
              <h3 className="history-heading">{formatDate(new Date(receipt.payment_date))}</h3>
              <p><strong>Amount:</strong> {receipt.sum} SEK</p>
              <p><strong>payment_type:</strong> {receipt.payment_type}</p>
              <p><strong>payment_details:</strong> {receipt.payment_details}</p>
              <p><strong>receipt_details:</strong> {receipt.receipt_details}</p>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Receipts;
