import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import ButtonSpinner from "../ButtonSpinner";

const Payment = () => {
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
        return_url: "https://pryzma.io/login?newAccount=true",
      },
    });
    // if errors
    if (result.error) {
      setErrorMessage(result.error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form className="w-full animate-fadeIn opacity-0">
      {errorMessage && (
        <div className="mt-6 mx-auto w-full max-w-[300px] absolute top-[100px] left-1/2 translate-x-[-50%] p-4 bg-gradient-to-br from-red-400 to-red-600 rounded-md">
          <p className="text-xs font-semibold text-center text-black">
            {errorMessage}
          </p>
        </div>
      )}
      <p className="font-semibold text-white text-2xl">Payment Information</p>
      <p className="mb-6 text-sm text-neutral-400 mt-2">
        You will not be charged until your 7 day free trial period is over.
      </p>
      <PaymentElement />
      <div className="w-full flex mt-8">
        <button
          disabled={!stripe || isSubmitting ? true : false}
          onClick={handleSubmit}
          className={`h-[40px] w-[100px] flex justify-center items-center border text-sm font-medium rounded-md transition-all duration-300 ${
            isSubmitting
              ? "bg-neutral-700 border-neutral-700"
              : "bg-white border-white text-black hover:text-white hover:bg-transparent"
          }`}
        >
          {isSubmitting ? <ButtonSpinner /> : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default Payment;
