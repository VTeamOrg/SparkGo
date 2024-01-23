const stripe = require('stripe')(process.env.STIPE_SECRET_KEY);
const plansModel = require('../models/plansModel');
const subscriptionModel = require("../models/subscriptionModel");
const userModel = require("../models/userModel");
const receiptModel = require("../models/receiptModel");


const stripeController = {
    session:async (req, res)=> {
      try {
      // when auth implemented, replace this by real user
      const { paymentType, paymentValue, redirect } = req.query;

      let lineItems = [];

      const allPlans = await plansModel.getAllPlans();
      const oneTime = allPlans.filter(plan => plan.id === 4);
      const oneTimePlanId = oneTime[0].stripe_plan_id;
      console.log(oneTimePlanId);
      const stripeSubscriptionIds = allPlans.map(plan => {
        return { id: plan.id,  planId: plan.stripe_plan_id };
      });

      let planId;
      let mode;

      if (paymentType === "payment") {
        planId = oneTimePlanId;
        mode = "payment";
      } else if(paymentType === "subscription") {
        // selectedSubscription = stripeSubscriptionIds.filter(sub => sub.id === parseInt(paymentValue));
        // if (selectedSubscription.length < 1) return;
        const selectedSubscription = stripeSubscriptionIds.find(sub => sub.id === parseInt(paymentValue));
        if (!selectedSubscription) {
            throw new Error("Invalid subscription selection");
        }
       
        planId = selectedSubscription.planId
        mode="subscription";
      }
      lineItems.push({
        price: planId,
        quantity: 1,
      });
      console.log();
      const session = await stripe.checkout.sessions.create({
        mode,
        payment_method_types: ['card'],
        line_items: lineItems,
        ui_mode: 'embedded',
        return_url: `http://localhost:3000/v1/subscription/process?session_id={CHECKOUT_SESSION_ID}&redirect=${redirect}`,
      });
      // console.log(session);
        res.json(session);
      } catch (error) {
        console.error("Error in session:", error);
        return res.status(500).json({ error: "Something went wrong, please try again" });
      }
    },
    process: async (req, res) => {
      try {
          let userMsg = "";
          const userId = 2;
          const { session_id, redirect } = req.query;
  
          if (!session_id) {
              throw new Error("Missing session_id parameter");
          }
  
          let checkout_session;
          try {
              checkout_session = await stripe.checkout.sessions.retrieve(session_id);
          } catch (error) {
              console.error("Error retrieving checkout session:", error.message);
              userMsg = "?error=Something went wrong, please try again";
              res.writeHead(302, {
                  'Location': `${redirect}${userMsg}`
              });
              res.end();
              return; // Ensure to return here to stop further execution
          }
  
          console.log(session_id, session_id === checkout_session.id);
          console.log(checkout_session);
  
          if (checkout_session.payment_status === "unpaid") {
              userMsg = "?error=Payment was not successful";
              res.writeHead(302, {
                  'Location': `${redirect}${userMsg}`
              });
              res.end();
              return; // Ensure to return here to stop further execution
          }
  
          const subscriptionId = checkout_session.subscription;
  
          if (subscriptionId !== null) {
              const subscription = await stripe.subscriptions.retrieve(subscriptionId);
              const planId = await plansModel.getPlanIdByStripeId(subscription.plan.id);
              await subscriptionModel.createActivePlan(planId, subscriptionId, userId);
          } else if (checkout_session.mode === "payment") {
              await userModel.fillWallet(userId, checkout_session.amount_total / 100);
          }
          userMsg = "?success=true";
          console.log("Success");

          console.log(checkout_session);
          const receiptData = {
            member_id: userId,
            payment_details: subscriptionId !== null ?checkout_session.invoice: checkout_session.payment_intent,
            payment_type: "Card",
            receipt_details: checkout_session.mode,
            sum: checkout_session.amount_total / 100,
            payment_date: new Date(),
          };
          // Anropa createReceiptInDatabase med receiptData
         await stripeController.createReceiptInDatabase(receiptData);
          res.writeHead(302, {
              'Location': `${redirect}${userMsg}`
          });
          res.end();
        } catch (error) {
            console.error("Error in process:", error.message);
            res.status(500).json({ error: "Something went wrong, please try again" });
        }
      },

      createReceiptInDatabase: async (receiptData) => {
      try {
          // Assuming you have a receiptModel with a method createReceipt
          await receiptModel.insertReceipt(receiptData);
          console.log("Receipt created successfully");
      } catch (error) {
          console.error("Error creating receipt:", error.message);
          // Handle the error appropriately
      }
    },

};



module.exports = stripeController;
