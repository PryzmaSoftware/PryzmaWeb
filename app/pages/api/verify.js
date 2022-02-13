import clientPromise from "../../lib/mongodb";

const handler = async (req, res) => {
  try {
    // get code from frontend
    const code = req.body.code;
    const email = req.body.email;

    if (!email) return res.status(200).send("no email to verify");

    // connect to mongodb
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("users");

    // get user from database
    const user = await collection.findOne({ email: email });

    if (user.emailCode === Number(code)) {
      const updateVerified = {
        $set: {
          isVerified: true,
        },
      };

      // update customer to verified
      await collection.updateOne({ email: email }, updateVerified);

      // send response to frontend
      res.status(200).send("email verified");
    } else {
      res.status(200).send("invalid code");
    }
  } catch {
    res.status(500).send("something went wrong");
  }
};

export default handler;
