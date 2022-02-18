import { withIronSessionSsr } from "iron-session/next";
import clientPromise from "../../lib/mongodb";
import {
  Text,
  Card,
  Button,
  Divider,
  Grid,
  Toggle,
  Modal,
  useModal,
  useToasts,
} from "@geist-ui/core";
import { Check, ArrowRight } from "@geist-ui/icons";
import { useContext, useState } from "react";
import axios from "axios";
import ThemeContext from "../../components/ThemeContext";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";

const stripePromise = loadStripe(
  "pk_test_51KPVUKIUx22VK4GNQIemEkMGTPxAUM1OamN7TQa6JAgBkaPyBus6WKE2AMMAuKUjF2CI1A0eNxSreCS0lLgsbOxJ00ISv4uVYQ"
);

const SelectPlan = ({ customerId }) => {
  const [plan, setPlan] = useState("monthly");
  const { setVisible, bindings } = useModal();
  const [clientSecret, setClientSecret] = useState();

  const handlePlanClick = async () => {
    setVisible(true);
    // setup intent on backend
    const response = await axios.post("/api/manage/setup-intent", {
      stripeCustomerId: customerId,
    });
    // if response ok set client secret so user can enter
    // their card information
    if (response.status === 200) return setClientSecret(response.data);
    setClientSecret(response.data);
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ maxWidth: 1000, margin: "auto" }}>
        <Text h2 style={{ fontWeight: 700 }}>
          Select a Subscription
        </Text>
        <Card>
          <Card.Content>
            <Text h5 margin={0} type="secondary" style={{ letterSpacing: 2 }}>
              PRYZMA SUBSCRIPTION
            </Text>
          </Card.Content>
          <Divider margin={0} />
          <Card.Content>
            <Grid.Container justify="space-between">
              <Grid>
                <Text h3>Everything you need</Text>
                <Text type="secondary" style={{ fontWeight: 500 }}>
                  Included Package:
                </Text>
                <Grid.Container>
                  <Grid alignItems="center">
                    <Check color="#0070F3" size="16" />
                  </Grid>
                  <Grid>
                    <Text
                      margin={0}
                      ml="10px"
                      style={{
                        position: "relative",
                        bottom: 4,
                        fontWeight: 500,
                      }}
                      small
                    >
                      AI Stock Signals
                    </Text>
                  </Grid>
                </Grid.Container>
              </Grid>
              <Grid>
                <Grid.Container justify="center" direction="column">
                  <Text h3 margin={0} style={{ textAlign: "center" }}>
                    {plan === "monthly" ? "$79.99/mo" : "$799.99/yr"}
                  </Text>
                  <Text
                    small
                    style={{ textAlign: "center" }}
                    type="secondary"
                    mt="-2px"
                  >
                    {plan === "monthly" ? "Billed Monthly" : "Billed Annually"}
                  </Text>
                </Grid.Container>
                <Grid.Container
                  alignItems="center"
                  justify="center"
                  mt="20px"
                  mb="30px"
                >
                  <Grid mr="5px" mb="-9px">
                    Monthly
                  </Grid>
                  <Grid>
                    <Toggle
                      scale={1.7}
                      onChange={() =>
                        plan === "monthly"
                          ? setPlan("annually")
                          : setPlan("monthly")
                      }
                    />
                  </Grid>
                  <Grid ml="5px" mb="-9px">
                    Annual
                  </Grid>
                </Grid.Container>
                <Button type="secondary" scale={1.2} onClick={handlePlanClick}>
                  Select Plan
                </Button>
              </Grid>
            </Grid.Container>
          </Card.Content>
        </Card>
      </div>
      <Modal {...bindings}>
        <Modal.Title>{`Billed ${plan}`}</Modal.Title>
        <Modal.Content>
          <ElementsProvider
            clientSecret={clientSecret}
            plan={plan}
            customerId={customerId}
          />
        </Modal.Content>
      </Modal>
    </div>
  );
};

const ElementsProvider = ({ clientSecret, plan, customerId }) => {
  const { themeType } = useContext(ThemeContext);

  const options = {
    clientSecret: clientSecret,
    appearance: {
      variables: {
        colorPrimary: themeType === "light" ? "black" : "white",
        colorText: themeType === "light" ? "black" : "white",
        colorBackground: themeType === "light" ? "#fff" : "#000",
      },
    },
  };

  if (!clientSecret) return "";

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentProvider plan={plan} customerId={customerId} />
    </Elements>
  );
};

const PaymentProvider = ({ plan, customerId }) => {
  const [isLoading, setIsLoading] = useState();
  const { setToast } = useToasts();
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const handleSubmit = async (event) => {
    setIsLoading(true);
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmSetup({
      //`Elements` instance that was used to create the Payment Element
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: "http://localhost:3000/admin/manage-account",
      },
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      setToast({ text: result.error.message, type: "error" });
      setIsLoading(false);
    } else {
      console.log(result);
      // create the subscription using the payment methd provided
      const response = await axios.post("/api/manage/create-subscription", {
        customerId,
        plan,
        paymentMethod: result.setupIntent.payment_method,
      });

      if (response.status === 200) {
        setTimeout(() => {
          setToast({
            text: "Your subscription has been created",
            type: "success",
          });
  
          return router.push("/admin/manage-account");
        }, 5000)
      } else {
        setToast({
          text: "Something went wrong, please try again later.",
          type: "error",
        });
      }
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button
        mt="15px"
        disabled={!stripe}
        width="100%"
        htmlType="submit"
        loading={isLoading ? true : false}
      >
        {plan === "monthly" ? "Pay $79.99" : "Pay $799.99"}
      </Button>
    </form>
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
      stripeCustomerId: user.user,
    });

    updatedUser = JSON.parse(JSON.stringify(updatedUser));

    return {
      props: { customerId: updatedUser.stripeCustomerId },
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

export default SelectPlan;
