import { withIronSessionSsr } from "iron-session/next";
import clientPromise from "../../lib/mongodb";
import {
  Text,
  Note,
  Spacer,
  useToasts,
  Card,
  Grid,
  Button,
} from "@geist-ui/core";
import Name from "../../components/ManageAccount/Name";
import Email from "../../components/ManageAccount/Email";
import Password from "../../components/ManageAccount/Password";
import Subscription from "../../components/ManageAccount/Subscription";
import PaymentMethod from "../../components/ManageAccount/PaymentMethod";
import RecentInvoices from "../../components/ManageAccount/RecentInvoices";
import UpcomingInvoices from "../../components/ManageAccount/UpcomingInvoices";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ManageAccount = ({ user }) => {
  const router = useRouter();

  const { setToast } = useToasts();

  useEffect(() => {
    if (!router.query.paymentUpdated) return;
    router.replace(router.asPath);
    setToast({
      text: "Your payment method has been updated.",
      type: "success",
    });
  }, [router.query.paymentUpdated]);

  console.log(user);
  return (
    <div style={{ padding: 16, marginBottom: 50 }}>
      <div style={{ maxWidth: 1000, margin: "auto" }}>
        <Text h2 style={{ fontWeight: 700 }}>
          Account Information
        </Text>
        {user.failedPaymentInvoice && (
          <>
            <Card>
              <Grid.Container justify="space-between" alignItems="center">
                <Text type="error" margin={0}>
                  Your payment has failed. Please click the "Pay Now" button to
                  pay your invoice.
                </Text>
                <Button
                  type="error"
                  ghost
                  onClick={() => window.open(user.failedPaymentInvoice)}
                >
                  Pay Now
                </Button>
              </Grid.Container>
            </Card>
            <Spacer h={1} />
          </>
        )}
        {user.status === "trialing" && !user.paymentMethod && (
          <>
            <Note type="warning">
              You trial ends on{" "}
              {format(new Date(user.nextInvoice * 1000), "MMM dd, yyyy")}. You
              must add a payment method if wish to use our services after your
              trial is over.
            </Note>
            <Spacer h={1} />
          </>
        )}
        {user.status === "active" &&
          user.paymentMethod &&
          user.cancelAtPeriodEnd && (
            <>
              <Note type="error">
                Your subscription ends on{" "}
                {format(new Date(user.nextInvoice * 1000), "MMMM dd, yyyy")}
              </Note>
              <Spacer h={1} />
            </>
          )}
        <Name user={user} />
        <Email user={user} />
        <Password user={user} />
        <Subscription user={user} />
        {user.subscriptionId && <PaymentMethod user={user} />}
        {user.subscriptionId && <UpcomingInvoices user={user} />}
        {user.subscriptionId && <RecentInvoices user={user} />}
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

    console.log(user);

    // get user from db
    let updatedUser = await collection.findOne({
      stripeCustomerId: user.user,
    });

    updatedUser = JSON.parse(JSON.stringify(updatedUser));

    return {
      props: {
        user: {
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          stripeCustomerId: updatedUser.stripeCustomerId,
          subscriptionId: updatedUser.subscriptionId,
          isVerified: updatedUser.isVerified,
          cardDetails: updatedUser.cardDetails,
          cancelAtPeriodEnd: updatedUser.cancelAtPeriodEnd,
          plan: updatedUser.plan,
          status: updatedUser.status,
          recentInvoices: updatedUser.recentInvoices,
          upcomingInvoices: updatedUser.upcomingInvoices,
          paymentMethod: updatedUser.paymentMethod,
          nextInvoice: updatedUser.nextInvoice,
          failedPaymentInvoice: updatedUser.failedPaymentInvoice,
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
