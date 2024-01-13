const stripe = require('stripe')(process.env.STIPE_SECRET_KEY);
const plansModel = require('../models/plansModel');
const subscriptionModel = require("../models/subscriptionModel");

const stripeController = {
    session:async (req, res)=> {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [
              {
                price: 'price_1OXUiAErt9JzUGzKCljYsth4',
                quantity: 1,
              },
            ],
            ui_mode: 'embedded',
            return_url: 'http://localhost:3000/v1/subscription/process?session_id={CHECKOUT_SESSION_ID}',
          }); 
        return res.json(session);
    },
    process:async (req, res) => {
      const {session_id} = req.query
      const checkout_session = await stripe.checkout.sessions.retrieve(session_id)
      const subscriptionId = checkout_session.subscription;

      stripe.subscriptions.retrieve(subscriptionId, async (err, subscription) => {
        if (err) {
            console.error(`Error retrieving subscription: ${err.message}`);
            // Handle the error appropriately
            return;
          }
          const planId = await plansModel.getPlanIdByStripeId(subscription.plan.id);
          
          // when auth is implemnted, the user id will be retrived from the user auth data.
          await subscriptionModel.createActivePlan(planId, subscriptionId, 1);
    });
      res.writeHead(302, {
          'Location': process.env.WEBAPP_URL
        });
        res.end();
    },
    
}

module.exports = stripeController;