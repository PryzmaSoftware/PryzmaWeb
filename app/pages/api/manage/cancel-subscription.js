const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import clientPromise from '../../../lib/mongodb';

const handler = async (req, res) => {
  try {
    const subscriptionId = req.body.subscriptionId;

    // connect to mongodb
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('users');

    // update subscription in stripe
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    })

    // update in mongodb
    const updateCancel = {
      $set: {
        cancelAtPeriodEnd: true
      }
    }

    // update in mongodb
    await collection.updateOne({subscriptionId: subscriptionId}, updateCancel)

    // send response back to front end
    res.status(200).send('subscription canceled')
  } catch {
    res.status(500).send('something went wrong')
  }
}

export default handler;