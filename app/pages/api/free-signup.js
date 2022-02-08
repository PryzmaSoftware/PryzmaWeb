import clientPromise from '../../lib/mongodb';
const stripe = require('stripe')(process.env.STRIPE_KEY)
const bcrypt = require("bcryptjs");

const handler = async (req, res) => { 
  try {
    // get values from front end
    const { first, last, email, password } = req.body.data;

    // connect to database
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('users');

    // check if user already exists in mongodb
    const user = await collection.findOne({email: email});

    // if user exists return message to front end
    if (user) return res.status(200).json('user already exists');

    // If user doesn not exist, create new stripe customer and in mongodb
    const customer = await stripe.customers.create({
      name: `${ first.charAt(0).toUpperCase() + first.slice(1)} ${last.charAt(0).toUpperCase() + last.slice(1)}`,
      email: email,
    });

    // create customer for monogdb
    const newUser = {
      stripeCustomerId: customer.id,
      priceId: 'free',
      subscriptionId: 'free',
      subscriptionType: 'annual',
      paymentStatus: 'succeeded',
      defaultPaymentMethod: 'free',
      cancelAtPeriodEnd: false,
      cardDetails: 'free',
      trial: false,
      isCanceled: false,
      nextInvoice: null,
      watchlist: [],
      firstName: first.charAt(0).toUpperCase() + first.slice(1),
      lastName: last.charAt(0).toUpperCase() + last.slice(1),
      email: email,
      password: bcrypt.hashSync(password),
      dateJoined: new Date(),
      resetPasswordLink: null,
    };

    // put into mongodb
    await collection.insertOne(newUser);
    return res.status(200).json('customer created')

  } catch {
    res.status(200).json('something went wrong')
  }
}

export default handler;