import clientPromise from "../../../lib/mongodb";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const handler = async (req, res) => {
  try {
    const { customerId, plan, paymentMethod } = req.body;

    console.log(customerId, plan, paymentMethod);

    // create the subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items:
        plan === "monthly"
          ? [{ price: "price_1KSXLQIUx22VK4GNO5RDPvWO" }]
          : [{ price: "price_1KSXLQIUx22VK4GNHQpuSSs7" }],
      default_payment_method: paymentMethod,
      payment_behavior: "error_if_incomplete",
    });

    // send response back to front end
    res.status(200).send("subscription created");
  } catch {
    res.status(500).send("something went wrong");
  }
};

export default handler;
