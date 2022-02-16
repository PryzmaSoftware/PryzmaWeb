import clientPromise from "../../lib/mongodb";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const handler = async (req, res) => {
  // get event from stripe
  const event = req.body;

  // connect to mongodb
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection("users");

  // handle event
  if (event.type === "payment_method.attached") {
    // get details from event
    const customerId = event.data.object.customer;
    const paymentMethod = event.data.object.id;
    const cardDetails = {
      last4: event.data.object.card.last4,
      brand: event.data.object.card.brand,
      expMonth: event.data.object.card.exp_month,
      expYear: event.data.object.card.exp_year,
    };

    // get user from mongodb to get subId
    const user = await collection.findOne({ stripeCustomerId: customerId });

    // update customer subscription
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethod,
      },
    });

    // update subscription to not cancel at period end
    // this is to update when the customer is trialing
    await stripe.subscriptions.update(user.subscriptionId, {
      cancel_at_period_end: false,
    });

    // creat document object to update in mongodb
    const updateUser = {
      $set: {
        cancelAtPeriodEnd: false,
        status: "active",
        paymentMethod: paymentMethod,
        cardDetails: cardDetails,
      },
    };

    // update in mongodb
    await collection.updateOne({ stripeCustomerId: customerId }, updateUser);
  }

  return res.status(200).send({ received: true });
};

export default handler;
