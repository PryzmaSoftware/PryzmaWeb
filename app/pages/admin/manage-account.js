import { withIronSessionSsr } from "iron-session/next";
import clientPromise from "../../lib/mongodb";
import { Text } from "@geist-ui/core";
import Name from "../../components/ManageAccount/Name";
import Email from "../../components/ManageAccount/email";

const ManageAccount = ({ user }) => {
  console.log(user);
  return (
    <div style={{ padding: 16 }}>
      <div style={{ maxWidth: 1000, margin: "auto" }}>
        <Text h2 style={{ fontWeight: 700 }}>
          Account Information
        </Text>
        <Name user={user} />
        <Email user={user} />
      </div>
    </div>
  );
};

export const getServerSideProps = withIronSessionSsr(
  async ({ req }) => {
    // get user from session
    const user = req.session.user;

    // if no user redirect to login
    if (!user) {
      return {
        redirect: {
          permanant: false,
          destination: "/login",
        },
      };
    }

    // if user connect to mongodb
    // and pull the user from there
    // to get the most up to date info
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("users");

    // get user from db
    let updatedUser = await collection.findOne({
      stripeCustomerId: user.user.stripeCustomerId,
    });

    updatedUser = JSON.parse(JSON.stringify(updatedUser));

    return {
      props: {
        user: {
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          stripeCustomerId: updatedUser.stripeCustomerId,
          isVerified: updatedUser.isVerified,
          nextInvoice: updatedUser.nextInvoice,
          cardDetails: updatedUser.cardDetails,
          cancelAtPeriodEnd: updatedUser.cancelAtPeriodEnd,
          plan: updatedUser.plan,
          status: updatedUser.status,
        },
      },
    };
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

export default ManageAccount;
