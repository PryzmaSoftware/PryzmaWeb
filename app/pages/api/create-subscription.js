import clientPromise from "../../lib/mongodb";
const stripe = require("stripe")(process.env.STRIPE_KEY);

const handler = async (req, res) => {
  // get user email to find customerId in database
  const email = req.body.email;
  // get priceId
  const priceId = req.body.priceId;
  const plan = req.body.plan;
  const trial = req.body.trial;
  const canceled = req.body.isCanceled;

  try {
    // FETCH USER FROM MONGODB
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("users");
    const user = await collection.find({ email: email }).toArray();
    const customerId = user[0].stripeCustomerId;

    // checking is user already has an exisitng subscription to
    if (user[0].subscriptionId) {
      if (!user[0].trial || !user[0].isCanceled) {
        const subscription = await stripe.subscriptions.retrieve(
          user[0].subscriptionId
        );
        await stripe.subscriptions.update(user[0].subscriptionId, {
          cancel_at_period_end: false,
          proration_behavior: "always_invoice",
          items: [
            {
              id: subscription.items.data[0].id,
              price: priceId,
            },
          ],
        });
        return res.status(200).json("subscription updated");
      }
    }

    //CREATE SUBSCRIPTION FOR USER
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      trial_period_days: trial && canceled ? 0 : 7,
      expand: ["latest_invoice.payment_intent"],
    });

    const updateSubscription = {
      $set: {
        subscriptionId: subscription.id,
        subscriptionType: plan,
        priceId: priceId,
      },
    };

    // update user by adding subscription id in mongodb
    await collection.updateOne({ email: email }, updateSubscription);
    // SEND SUBSCRIPTION BACK TO FRONT END TO GET PAYMENT DETAILS

    res.status(200).json("subscription created");
  } catch (e) {
    return res.status(500).json(e);
  }
};

export default handler;
