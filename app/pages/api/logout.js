import { withIronSessionApiRoute } from "iron-session/next";

const handler = withIronSessionApiRoute(
  function logoutRoute(req, res, session) {
    req.session.destroy();
    res.status(200).send("logged out");
  },
  {
    cookieName: "user",
    password: process.env.IRON_SESSION_PASSWORD,
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);

export default handler;
