import clientPromise from "../../../lib/mongodb";
const nodemailer = require("nodemailer");

const handler = async (req, res) => {
  try {
    // get email from frontend
    const email = req.body.email;
    const customerId = req.body.stripeCustomerId;

    // generate email verification code
    const code = Math.floor(Math.random() * 10000 + 50000);

    // connect to mongodb
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("users");

    // check if email change is already in db
    const checkUser = await collection.findOne({ email: email });

    // if user found with email, send response back to front end
    if (checkUser) return res.status(200).send("email already in use");

    // update user code in mongodb
    const newCode = {
      $set: {
        emailCode: code,
      },
    };

    // update user code in mongodb
    await collection.updateOne({ stripeCustomerId: customerId }, newCode);

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
      res.status(200).send("email sent");
    } catch {
      res.status(500).send("something went wrong");
    }
  } catch {
    res.status(500).send("something went wrong");
  }
};

export default handler;
