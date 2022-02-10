import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import ButtonSpinner from "../ButtonSpinner";
import { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";

const stripeLoader = loadStripe(
  "pk_live_51KPVUKIUx22VK4GND2UgrqFocX2ESC1sH0gVucnDlPBFdAZGWesOUuPwspcBohLxfZAIj333jIcTrGWtUTzCUEJY00Paw2X5xG"
);

const AddPayment = ({ user, price }) => {
  // set state for the client secret
  const [clientSecret, setClientSecret] = useState();

  // get client secret for set up intent
  useEffect(() => {
    // check if user has had trial before
    // if they have not had trial before, set up trial
    if (!user.trial && !user.isCanceled) {
      const getClientSecret = async () => {
        const response = await axios.post("/api/setup-intent", {
          email: user.email,
        });
        setClientSecret(response.data.client_secret);
      };
      getClientSecret();
      // if user has already used trial, set up payment intent to be charged right away
    } else {
      // get client secret passed through from subscription page
      const getPaymentIntent = async () => {
        const response = await axios.post("/api/retrieve-payment-intent", {
          customerId: user.stripeCustomerId,
        });
        if (response.data === "something went wrong") return; // show an error message
        setClientSecret(response.data.data[0].client_secret);
      };
      getPaymentIntent();
    }
  }, []);

  const options = {
    clientSecret: clientSecret,
    appearance: {
      labels: "floating",
      variables: {
        colorPrimary: "#FFFFFF",
        colorBackground: "#000000",
        fontFamily: "Inter, sans-serif",
        colorText: "#FFFFFF",
      },
    },
  };

  if (!clientSecret) return "";

  return (
    <Elements options={options} stripe={stripeLoader}>
      <Payment user={user} price={price} />
    </Elements>
  );
};

const Payment = ({ user, price }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!stripe || !elements) {
      // DISABLE FORM SUBMISSION IF FORM HAS NOT LOADED
      return;
    }

    if (!user.trial || !user.isCanceled) {
      // if user hasnt used trial, we are only setting up card for future payments
      const result = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: "https://pryzma.io/admin/subscription-created",
        },
      });

      // if errors
      if (result.error) {
        setErrorMessage(result.error.message);
        setIsSubmitting(false);
      }
    } else {
      // if user has used trial, we are charging their card now
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "https://pryzma.io/admin/subscription-created",
        },
      });

      // if errors
      if (result.error) {
        setErrorMessage(result.error.message);
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form className="w-full">
      <p className="text-white font-semibold text-2xl pb-3">
        Add Payment Method
      </p>
      {!user.isCanceled && (
        <p className="mb-6 text-sm text-neutral-400">
          You will not be charged until your 7 day free trial period is over.
        </p>
      )}
      {user.isCanceled && (
        <p className="mb-6 text-sm text-neutral-400">
          You are now signing up for the{" "}
          {price === "monthly" ? "monthly" : "annual"} plan for{" "}
          {price === "monthly" ? "$79.99/mo" : "$799.99/yr"}
        </p>
      )}
      <PaymentElement />
      <button
        disabled={!stripe || isSubmitting ? true : false}
        onClick={handleSubmit}
        className={`h-[40px] mt-8 w-[100px] flex justify-center items-center border text-sm font-medium rounded-md transition-all duration-300 mr-2 ${
          isSubmitting
            ? "bg-neutral-700 border-neutral-700"
            : "border-white bg-white text-black hover:text-white hover:bg-transparent"
        }`}
      >
        {isSubmitting ? (
          <ButtonSpinner />
        ) : user.isCanceled ? (
          `Pay ${price === "monthly" ? "$79.99" : "$799.99"}`
        ) : (
          "Submit"
        )}
      </button>
      {errorMessage && (
        <div className="mt-6 mx-auto w-fit p-4 rounded-md bg-gradient-to-br from-red-400 to-red-600">
          <p className="text-xs font-semibold text-center text-black">
            {errorMessage}
          </p>
        </div>
      )}
    </form>
  );
};

export default AddPayment;
