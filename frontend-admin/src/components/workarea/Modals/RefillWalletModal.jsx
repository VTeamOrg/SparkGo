import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import '../CSS/Modal.css';
import { createCheckoutSession } from '../../support/Stripe';

Modal.setAppElement('#root');

function RefillWalletModal({ isOpen, onRequestClose, userId }) {
  const refillAmountsToProductIDs = {
    10: 'price_1OXVv3HhAajfnOjWLOszy7rb',
    50: 'price_1OXVvTHhAajfnOjWKOLXRPPU',
    100: 'price_1OXVv3HhAajfnOjWLOszy7rb',
  };

  const refillOptions = [
    { amount: 10, description: '10 $' },
    { amount: 50, description: '50 $' },
    { amount: 100, description: '100 $' },
  ];

  const [selectedAmount, setSelectedAmount] = useState(refillOptions[0]);

  const handleAmountChange = (event) => {
    const selectedOption = refillOptions.find(
      (option) => option.amount === parseInt(event.target.value)
    );
    setSelectedAmount(selectedOption || refillOptions[0]);
  };

  const handleRefillWallet = async () => {
    try {
      // Get the selected amount and its associated Stripe Product ID
      const { amount } = selectedAmount;
      const productID = refillAmountsToProductIDs[amount];

      // Create a checkout session with the Stripe Product ID and currency
      const session = await createCheckoutSession({
        userId,
        amount,
        refilledAmount: amount,
        mode: 'payment',
        success_url: 'http://localhost:5173?stripe=success_wallet_refilled',
        cancel_url: 'http://localhost:5173?stripe=cancel_wallet_refill',
        priceId: productID,
      });

      // Open the Stripe checkout in a modal
      window.open(session.url, 'Stripe Checkout', 'width=600,height=600');
    } catch (error) {
      console.error('Error creating checkout session:', error);
      // Handle the error as needed
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="refill-wallet-modal"
      overlayClassName="modal-overlay"
    >
      <div className="modal-content">
        <h2>Refill Wallet</h2>
        <label>Select Amount:</label>
        <select value={selectedAmount.amount} onChange={handleAmountChange}>
          {refillOptions.map((option) => (
            <option key={option.amount} value={option.amount}>
              {option.description}
            </option>
          ))}
        </select>
        <button onClick={handleRefillWallet}>Refill</button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
    </Modal>
  );
}

RefillWalletModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
};

export default RefillWalletModal;
