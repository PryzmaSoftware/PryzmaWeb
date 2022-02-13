const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import clientPromise from "../../lib/mongodb";
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const handler = async (req, res) => {
  try {
    // get data sent from front end
    const { first, last, email, password } = req.body.data;
    const plan = req.body.plan;

    // connect to mongodb
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("users");

    // check is user is already in db
    const user = await collection.findOne({ email: email });

    // if user found, send response back to front end
    if (user) return res.status(200).send("email already exists");

    //if user does not exist, create stripe customer;
    const customer = await stripe.customers.create({
      name: `${first.charAt(0).toUpperCase() + first.slice(1)} ${
        last.charAt(0).toUpperCase() + last.slice(1)
      }`,
      email: email,
    });

    // create stripe subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items:
        plan === "monthly"
          ? [{ price: "price_1KSXLQIUx22VK4GNO5RDPvWO" }]
          : [{ price: "price_1KSXLQIUx22VK4GNHQpuSSs7" }],
      payment_behavior: "default_incomplete",
      trial_period_days: 7,
      expand: ["latest_invoice.payment_intent"],
    });

    // generate email verification code
    const code = Math.floor(Math.random() * 10000 + 50000);

    // create mongodb user document
    const newUser = {
      stripeCustomerId: customer.id,
      plan: plan,
      status: "active",
      paymentMethod: null,
      cancelAtPeriodEnd: false,
      cardDetails: null,
      nextInvoice: null,
      firstName: first.charAt(0).toUpperCase() + first.slice(1),
      lastName: last.charAt(0).toUpperCase() + last.slice(1),
      email: email,
      password: bcrypt.hashSync(password),
      magicLink: null,
      isVerified: false,
      emailCode: code,
    };

    // set up verification email
    const transporter = nodemailer.createTransport({
      host: "smtppro.zoho.com",
      port: 587,
      secure: false,
      auth: {
        user: "rmthomas@pryzma.io",
        pass: process.env.ZOHO_PASSWORD,
      },
    });

    // create the message
    const msg = {
      from: '"Pryzma" <noreply@pryzma.io>',
      to: email,
      subject: "Verify Email",
      text: `Your verification code is ${code}`,
    };

    // attempt to send email
    try {
      await transporter.sendMail(msg);
    } catch {
      return res.status(500).send("something went wrong");
    }

    // insert customer into mongodb
    await collection.insertOne(newUser);

    // send response back to front end
    res.status(200).send("customer created");
  } catch {
    res.status(500).send("something went wrong");
  }
};

export default handler;
