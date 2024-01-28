import React, { useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51OUVWKErt9JzUGzKmR1FZx2cItfOMFDPBIV80awYpRt19W8veNeIFrjiu2Nxistd3kdQ6Kg89lcARSXXpMe1jYEq00Y6MmZWAG');

const Checkout = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const navigate = useNavigate();

  const paymentType = queryParams.get('paymentType');
  const paymentValue = queryParams.get('paymentValue');

  if (!paymentType || !paymentValue) {
    navigate("/404");
    return;
  }

  const redirect = window.location.origin + "/wallet";
  useEffect(() => {
    const initialize = async () => {
      try {
        const response = await fetch(`http://localhost:3000/v1/subscription/session?paymentType=${paymentType}&paymentValue=${paymentValue}&redirect=${redirect}`, {
          method: "POST",
        });

        const session = await response.json();
        const stripe = await stripePromise;

        // Initialize Checkout
        const checkout = stripe.redirectToCheckout({
          sessionId: session.id,
        });

        // Handle any errors that occur during the redirect to Checkout
        if (checkout.error) {
          console.error('Error:', checkout.error.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    initialize();
  }, [paymentType, paymentValue, redirect]);

  return (
    <Elements stripe={stripePromise}>
      <form></form>
    </Elements>
  );
};

export default Checkout;
