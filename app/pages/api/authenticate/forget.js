import ClientPromise from "../../../lib/mongodb";
import { withIronSessionApiRoute } from "iron-session/next";
import clientPromise from "../../../lib/mongodb";
const bcrypt = require("bcryptjs");

const handler = withIronSessionApiRoute(
  async function loginRoute(req, res) {
    // get credentials sent from front end
    const { email, password } = req.body.data;

    try {
      // connect to mongodb
      const client = await clientPromise;
      const db = client.db();
      const collection = db.collection("users");

      // check if user is in db
      const user = await collection.findOne({ email: email });

      // if no user found, send response to front end
      if (!user) return res.status(200).send("user not found");

      // if user, check if passwords match
      bcrypt.compare(password, user.password, async (err, response) => {
        // if passwords match, set session and send successful login to front end
        if (response) {
          // set session
          req.session.user = {
            id: user._id,
            user: user,
          };
          await req.session.save();
          // send response
          res.status(200).send("user logged in");
        } else {
          // send response if incorrect password
          res.status(200).send("incorrect password");
        }
      });
    } catch {
      return res.status(500).send("something went wrong");
    }
  },
  {
    cookieName: "user",
    password: process.env.IRON_SESSION_PASSWORD,
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      maxAge: undefined,
      secure: process.env.NODE_ENV === "production",
    },
  }
);

export default handler;
