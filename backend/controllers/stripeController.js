const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const stripeController = {
  createCheckoutSession: async (req, res) => {
    try {
      const { userId, amount, mode, success_url, cancel_url, priceId } = req.body;

      let sessionOptions;

      const prices = await stripe.prices.list();

      if (mode === 'subscription') {
        // Subscription mode
        sessionOptions = {
          mode: 'subscription',
          payment_method_types: ['card'],
          success_url,
          cancel_url,
          line_items: [
            {
              price: priceId, // Use the selected priceId for subscription
              quantity: 1,
            },
          ],
        };
      } else {
        // Payment mode (one-time payment)
        sessionOptions = {
          mode: 'payment',
          payment_method_types: ['card'],
          success_url,
          cancel_url,
          line_items: [
            {
              price: priceId, // Use the selected priceId for one-time payment
              quantity: 1,
            },
          ],
        };
      }

      console.log('Session Options:', sessionOptions);

      const session = await stripe.checkout.sessions.create(sessionOptions);

      console.log('Session:', session);
      return res.json(session);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  handlePaymentConfirmation: async (req, res) => {
    try {
      // Extract relevant data from the Stripe webhook event
      const { data } = req.body;
      const { id, amount } = data.object;

      // Log the received payment confirmation data to the console
      console.log('Received Payment Confirmation:');
      console.log('Payment ID:', id);
      console.log('Amount:', amount);

      // Respond with a success message
      res.status(200).json({ message: 'Payment confirmation received.' });
    } catch (error) {
      console.error('Error handling payment confirmation:', error);
      res.status(500).json({ error: 'An error occurred while processing the payment confirmation.' });
    }
  },
};


module.exports = stripeController;
