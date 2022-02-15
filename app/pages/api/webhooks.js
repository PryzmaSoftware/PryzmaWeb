import clientPromise from '../../lib/mongodb';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const handler = async (req, res) => {

  // get event from stripe
  const event = req.body;

  // connect to mongodb
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('users');

  // handle event 
  if (event.type === '')

}