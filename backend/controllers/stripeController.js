const stripe = require('stripe')(process.env.STIPE_SECRET_KEY);
const subscriptionModule = require("../models/subscription");

const stripeController = {
    session:async (req, res)=> {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [
              {
                price: priceId,
                quantity: 1,
              },
            ],
            ui_mode: 'embedded',
            return_url: 'http://localhost:3000/subscription/process?session_id={CHECKOUT_SESSION_ID}',
          }); 
        return res.json(session);
    },
    process:async (req, res) => {
      const {session_id} = req.query
      const checkout_session = await stripe.checkout.sessions.retrieve(session_id)
      console.log(checkout_session)
      // res.json({status:'success'})
      await subscriptionModule.createActivePlan(checkout_session);
      res.writeHead(302, {
          'Location': process.env.WEBAPP_URL
        });
        res.end();
    },
    
}

module.exports = stripeController;