import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, useToasts } from "@geist-ui/core";
import ThemeContext from "../../components/ThemeContext";
import { useRouter } from "next/router";

const stripePromise = loadStripe(
  "pk_test_51KPVUKIUx22VK4GNQIemEkMGTPxAUM1OamN7TQa6JAgBkaPyBus6WKE2AMMAuKUjF2CI1A0eNxSreCS0lLgsbOxJ00ISv4uVYQ"
);

const ElementsProvider = ({ user, setVisible }) => {
  const { themeType } = useContext(ThemeContext);

  const [clientSecret, setClientSecret] = useState();

  useEffect(() => {
    const getClientSecret = async () => {
      const response = await axios.post("/api/manage/setup-intent", {
        stripeCustomerId: user.stripeCustomerId,
      });
      if (response.status === 200) return setClientSecret(response.data);
    };
    getClientSecret();
  }, []);

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
    <Elements options={options} stripe={stripePromise}>
      <PaymentProvider setVisible={setVisible} />
    </Elements>
  );
};

const PaymentProvider = ({ setVisible }) => {
  const stripe = useStripe();
  const elements = useElements();

  const router = useRouter();

  const { setToast } = useToasts();
  const [isLoading, setIsLoading] = useState(false);

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
        return_url:
          "http://localhost:3000/admin/manage-account?paymentUpdated=true",
      },
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      setToast({ text: result.error.message, type: "error" });
      setIsLoading(false);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setVisible(false);
        setToast({
          text: "Your payment method has been updated.",
          type: "success",
        });
        router.replace(router.asPath);
      }, 5000);
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
        Confirm
      </Button>
    </form>
  );
};

export default ElementsProvider;