const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const handler = async (req, res) => {
  try {
    // get customer from frontend
    const customerId = req.body.stripeCustomerId;
  
    // create setup intent
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ['card']
    })
  
    // send client promise back to front end
    res.status(200).send(setupIntent.client_secret)
  } catch {
    res.status(500).send('something went wrong')
  }
}

export default handler;