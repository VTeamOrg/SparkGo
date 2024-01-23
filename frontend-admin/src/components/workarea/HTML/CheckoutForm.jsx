import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import PropTypes from 'prop-types'; 

function CheckoutForm({ session, closeModal }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Use stripe to confirm the payment and handle the result
    const result = await stripe.confirmCardPayment(session.client_secret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      console.error(result.error);
      // Handle payment failure
    } else {
      // Payment succeeded, close the modal or perform any necessary actions
      closeModal();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit">Pay</button>
    </form>
  );
}

CheckoutForm.propTypes = {
    session: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
  };

export default CheckoutForm;
