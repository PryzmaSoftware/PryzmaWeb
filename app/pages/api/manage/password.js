import clientPromise from '../../../lib/mongodb'
const bcrypt = require('bcryptjs');

const handler = async (req, res) => {
  try {
    // get new password and userId from frontend
    const password = req.body.password;
    const customerId = req.body.stripeCustomerId;

    // connect to mongodb
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('users');

    // update password object
    const newPassword = {
      $set: {
        password: bcrypt.hashSync(password)
      }
    }

    // update in password in mongodb
    await collection.updateOne({stripeCustomerId: customerId}, newPassword);

    // send response to front end
    res.status(200).send('password updated')

  } catch {
    res.status(500).send('something went wrong')
  }
}

export default handler;