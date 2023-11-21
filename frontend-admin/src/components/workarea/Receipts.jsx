import React, { useState, useEffect } from 'react';

/**
 * Receipts component for displaying a list of receipts.
 * @returns {JSX.Element} JSX representing the receipts component.
 */
function Receipts() {
  /**
   * State to store the receipt data.
   * @type {Array}
   */
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    /**
     * Simulated receipt data.
     * @type {Array}
     */
    const fetchedReceipts = [
      {
        id: 1,
        date: '2023-11-01',
        amount: '25.00 SEK',
        startTime: '10:00 AM',
        endTime: '11:00 AM',
        location: '123 Main St, City A',
        paymentMethod: 'Credit Card',
      },
      {
        id: 2,
        date: '2023-10-25',
        amount: '30.00 SEK',
        startTime: '2:30 PM',
        endTime: '4:30 PM',
        location: '456 Elm St, City B',
        paymentMethod: 'PayPal',
      },
    ];

    /**
     * Sort receipts by date (most recent first).
     */
    fetchedReceipts.sort((a, b) => new Date(b.date) - new Date(a.date));

    /**
     * Set the receipt data in state.
     */
    setReceipts(fetchedReceipts);
  }, []);

  /* JSX to render data */
  return (
    <div className="misc-history">
      <h2>Receipts</h2>
      <ul>
        {receipts.map((receipt) => (
          <li key={receipt.id} className="history-entry">
            <h3 className="history-heading">{receipt.date}</h3>
            <p><strong>Amount:</strong> {receipt.amount}</p>
            <p><strong>Starting Time:</strong> {receipt.startTime}</p>
            <p><strong>Ending Time:</strong> {receipt.endTime}</p>
            <p><strong>Location:</strong> {receipt.location}</p>
            <p><strong>Payment Method:</strong> {receipt.paymentMethod}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Receipts;
