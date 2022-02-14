import clientPromise from "../../../lib/mongodb";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const handler = async (req, res) => {
  try {
    const stripeId = req.body.stripeCustomerId;
    const first = req.body.first;
    const last = req.body.last;

    // update customer in stripe
    await stripe.customers.update(stripeId, {
      name: `${first.charAt(0).toUpperCase() + first.slice(1)} ${
        last.charAt(0).toUpperCase() + last.slice(1)
      }`,
    });

    // connect to mongodb
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("users");

    const newName = {
      $set: {
        firstName: first.charAt(0).toUpperCase() + first.slice(1),
        lastName: last.charAt(0).toUpperCase() + last.slice(1),
      },
    };

    // update in mongodb
    await collection.updateOne({ stripeCustomerId: stripeId }, newName);

    // send response back to front end
    res.status(200).send("user updated");
  } catch {
    res.status(500).send("something went wrong");
  }
};

export default handler;
