const stripe = require('stripe')(process.env.STIPE_SECRET_KEY);

const stripeController = {
  createCheckoutSession: async (req, res) => {
    try {
      const { userId, amount, mode, success_url, cancel_url } = req.body;

      let sessionOptions;

      if (mode === 'subscription') {
        // Subscription mode
        sessionOptions = {
          mode: 'subscription',
          payment_method_types: ['card'],
          success_url,
          cancel_url,
          line_items: [
            {
              price: process.env.YOUR_SUBSCRIPTION_PRICE_ID,
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
              price: 'YOUR_ONE_TIME_PRICE_ID',
              quantity: 1,
            },
          ],
        };
      }

      const session = await stripe.checkout.sessions.create(sessionOptions);

      return res.json(session);
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = stripeController;
