import clientPromise from "../../../lib/mongodb";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const handler = async (req, res) => {
  try {
    const email = req.body.email;
    const customerId = req.body.stripeCustomerId;
    const code = req.body.code;

    // connect to mongodb
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("users");

    // get user from mongodb using customer id
    const user = await collection.findOne({ stripeCustomerId: customerId });

    console.log(code, user.emailCode);

    // check if user code matched user submitted code
    if (user.emailCode !== Number(code))
      return res.status(200).send("invalid code");

    // if user code matched code in mongodb
    // update user in stripe
    await stripe.customers.update(customerId, {
      email: email,
    });

    // update email in mongodb
    const updatedEmail = {
      $set: {
        email: email,
      },
    };

    // update in mongodb
    await collection.updateOne({ stripeCustomerId: customerId }, updatedEmail);

    // send success message back to front end
    res.status(200).send("email updated");
  } catch {
    res.status(500).send("something went wrong");
  }
};

export default handler;
