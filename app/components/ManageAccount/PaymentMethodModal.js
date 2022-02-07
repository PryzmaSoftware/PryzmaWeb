import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import axios from "axios";
import ButtonSpinner from "../ButtonSpinner";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { ArrowReturnLeft } from "react-bootstrap-icons";

const stripeLoader = loadStripe(
  "pk_live_51KPVUKIUx22VK4GND2UgrqFocX2ESC1sH0gVucnDlPBFdAZGWesOUuPwspcBohLxfZAIj333jIcTrGWtUTzCUEJY00Paw2X5xG"
);

const PaymentElementProvider = ({
  paymentElementActive,
  user,
  setPaymentElementActive,
  paymentLoading,
  setPaymentLoading,
}) => {
  const [clientSecret, setClientSecret] = useState();

  useEffect(() => {
    const getClientSecret = async () => {
      const response = await axios.post("/api/setup-intent", {
        email: user.email,
      });
      setClientSecret(response.data.client_secret);
    };
    getClientSecret();
  }, []);

  const options = {
    clientSecret: clientSecret,
    appearance: {
      labels: "floating",
      variables: {
        colorPrimary: "#FFFFFF",
        colorBackground: "#000000",
        fontFamily: "Montserrat, sans-serif",
        colorText: "#FFFFFF",
      },
    },
  };

  if (!clientSecret) return "";

  return (
    <Elements stripe={stripeLoader} options={options}>
      <PaymentModal
        paymentElementActive={paymentElementActive}
        setPaymentElementActive={setPaymentElementActive}
        setPaymentLoading={setPaymentLoading}
      />
    </Elements>
  );
};

const PaymentModal = ({
  paymentElementActive,
  setPaymentElementActive,
  setPaymentLoading,
}) => {
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

    const result = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url:
          "https://pryzma.io/admin/manage-account?paymentMethodUpdated=true",
      },
    });
    // if errors
    if (result.error) {
      setErrorMessage(result.error.message);
      setIsSubmitting(false);
    }
  };

  const handleOutsideClick = () => {
    setPaymentElementActive(false);
    setPaymentLoading(false);
  };

  return (
    <div
      className={`fixed px-4 h-screen w-screen top-0 left-0 ${
        paymentElementActive ? "opacity-100 z-[10]" : "opacity-0 z-[-1]"
      }`}
    >
      <div
        onClick={handleOutsideClick}
        className={`absolute px-4 h-screen w-screen top-0 left-0 bg-black/75 ${
          paymentElementActive ? "opacity-100 z-[10]" : "opacity-0 z-[-1]"
        }`}
      ></div>
      <div className="relative z-[9999] top-1/2 translate-y-[-50%]">
        <form
          className={`bg-neutral-800 flex flex-col justify-between mx-auto min-h-[500px] w-full max-w-screen-sm p-8 rounded-lg ${
            paymentElementActive ? "opacity-100 z-[9999]" : "opacity-0 z-[-1]"
          }`}
        >
          {errorMessage && (
            <div className="mb-4 mx-auto w-fit p-4 rounded-md bg-gradient-to-br from-red-400 to-red-600">
              <p className="text-xs font-semibold text-center text-black">
                {errorMessage}
              </p>
            </div>
          )}
          <p className="text-white font-medium text-2xl mb-2">
            Update Payment Method
          </p>
          {/* <p className="mb-6 text-sm text-gray-500">You will not be charged until your 7 day free trial period is over.</p> */}
          <PaymentElement />
          <div className="w-full flex mt-8">
            <button
              disabled={!stripe || isSubmitting ? true : false}
              onClick={handleSubmit}
              className={`h-[40px] w-[100px] flex justify-center items-center text-sm font-medium border rounded-md transition-all duration-300 mr-2 ${
                isSubmitting
                  ? "bg-neutral-700 border-neutral-700"
                  : "bg-white text-black border-white hover:bg-transparent hover:text-white"
              }`}
            >
              {isSubmitting ? <ButtonSpinner /> : "Submit"}
            </button>
            <button
              onClick={handleOutsideClick}
              className="flex items-center p-2.5 w-fit rounded-md justify-center text-sm font-medium transition-all duration-300 border border-neutral-700 text-neutral-500 hover:border-white hover:text-white"
            >
              Go Back
              <ArrowReturnLeft className="text-xl ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentElementProvider;
