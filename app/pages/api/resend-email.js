import clientPromise from "../../lib/mongodb";

const nodemailer = require("nodemailer");

const handler = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) return res.status(200).send("no email to verify");

    // connect to mongodb
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("users");

    //get user from db
    const user = await collection.findOne({ email: email });

    // get user code
    const code = user.emailCode;

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
      return res.status(500).send("something went wrong");
    }
  } catch {
    res.status(500).send("something went wrong");
  }
};

export default handler;
