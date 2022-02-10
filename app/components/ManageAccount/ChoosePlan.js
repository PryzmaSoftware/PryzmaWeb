import axios from "axios";
import { useState } from "react";
import { Check } from "react-bootstrap-icons";
import ButtonSpinner from "../ButtonSpinner";

const ChoosePlan = ({ increment, user, setPrice }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [monthlyLoader, setMonthlyLoader] = useState(false);
  const [annualLoader, setAnnualLoader] = useState(false);

  const handleButtonClick = async (e) => {
    setIsSubmitting(true);
    const plan =
      e.target.value === "price_1KRRO2IUx22VK4GNyRLlzRbO"
        ? "monthly"
        : "annual";
    setPrice(plan);
    plan === "monthly" ? setMonthlyLoader(true) : setAnnualLoader(true);
    const response = await axios
      .post("/api/create-subscription", {
        email: user.email,
        priceId: e.target.value,
        plan: plan,
        trial: user.trial,
        isCanceled: user.isCanceled,
      })
      .catch((e) => console.error(e));

    if (response) {
      if (
        response.data === "subscription created" ||
        response.data === "subscription updated"
      ) {
        setIsSubmitting(false);
        setMonthlyLoader(false);
        setAnnualLoader(false);
        increment();
      } else {
        setIsSubmitting(false);
        setMonthlyLoader(false);
        setAnnualLoader(false);
        setErrorMessage("Something went wrong, please try again later.");
      }
    }
  };

  return (
    <div>
      {errorMessage && (
        <div className="mx-auto w-full max-w-[300px] absolute top-[100px] left-1/2 translate-x-[-50%] p-4 rounded-md bg-gradient-to-br from-red-400 to-red-600">
          <p className="text-xs font-semibold text-center text-black">
            {errorMessage}
          </p>
        </div>
      )}
      {/* <p className="text-white font-semibold text-2xl">
        Select Pricing Plan
      </p> */}
      {/* <p className="mt-2 text-sm text-zinc-400 font-medium">
        You will have a 7 day free trial come with your subscription. You can
        cancel anytime before the seven days are over and not get charged.
      </p> */}
      <div className="flex-col sm:flex-row flex mt-6 opacity-0 animate-fadeInUp translate-y-12">
        <div className="w-full border border-neutral-700 sm:mr-6 rounded-md p-6 min-w-[280px] max-w-[300px] mx-auto mb-6 sm:mb-0">
          <p className="uppercase text-xs text-center text-neutral-400 font-medium tracking-wider">
            Monthly
          </p>
          <p className="text-center mt-2 mb-4">
            <span className="text-3xl font-medium text-white">$79.99</span>
            <span className="text-neutral-400 text-sm"> /mo</span>
          </p>
          <p className="flex items-center mt-6">
            <Check className="text-blue-500 text-lg mr-2 mb-2" />
            <span className="text-white text-sm">Top Movers</span>
          </p>
          <p className="flex items-center">
            <Check className="text-blue-500 text-lg mr-2 mb-2" />
            <span className="text-white text-sm">AI Trade Signals</span>
          </p>
          <p className="flex items-center">
            <Check className="text-blue-500 text-lg mr-2 mb-2" />
            <span className="text-white text-sm">Watchlist</span>
          </p>
          <p className="flex items-center">
            <Check className="text-blue-500 text-lg mr-2 mb-2" />
            <span className="text-white text-sm">Latest News</span>
          </p>
          <p className="flex items-center">
            <Check className="text-blue-500 text-lg mr-2 mb-2" />
            <span className="text-white text-sm">Key Statistics</span>
          </p>
          <p className="flex items-center">
            <Check className="text-blue-500 text-lg mr-2 mb-2" />
            <span className="text-white text-sm">Financials</span>
          </p>
          <p className="flex items-center">
            <Check className="text-blue-500 text-lg mr-2 mb-2" />
            <span className="text-white text-sm">Offerings</span>
          </p>
          <p className="flex items-center">
            <Check className="text-blue-500 text-lg mr-2 mb-2" />
            <span className="text-white text-sm">Insider Roster</span>
          </p>
          <p className="flex items-center mb-10">
            <Check className="text-blue-500 text-lg mr-2" />
            <span className="text-white text-sm">Top Institutional Owners</span>
          </p>
          <button
            disabled={isSubmitting ? true : false}
            onClick={handleButtonClick}
            value="price_1KRRO2IUx22VK4GNyRLlzRbO"
            className={`w-full flex justify-center items-center h-[42px] font-medium text-sm border rounded-md transition-all duration-300 ${
              monthlyLoader
                ? "bg-neutral-700 border-neutral-700"
                : "bg-neutral-900 text-neutral-500 border border-neutral-700 hover:text-white hover:border-white"
            }`}
          >
            {monthlyLoader ? <ButtonSpinner /> : "Select Plan"}
          </button>
        </div>
        <div className="w-full border border-neutral-700 rounded-md p-6 relative overflow-hidden min-w-[280px] max-w-[300px] mx-auto sm:mx-0">
          <p className="absolute tracking-wide rotate-45 bg-gradient-to-r from-rose-600 to-indigo-600 text-xs right-[-75px] pr-20 pl-20 pt-0.5 pb-0.5 text-white font-semibold uppercase">
            Best Deal
          </p>
          <p className="uppercase text-xs text-center text-neutral-400 font-medium tracking-wider">
            Annual
          </p>
          <p className="text-center mt-2 mb-4">
            <span className="text-3xl font-medium text-white">$799.99</span>
            <span className="text-zinc-400 text-sm"> /yr</span>
          </p>
          <p className="flex items-center mt-6">
            <Check className="text-blue-500 text-lg mr-2 mb-2" />
            <span className="text-white text-sm">Top Movers</span>
          </p>
          <p className="flex items-center">
            <Check className="text-blue-500 text-lg mr-2 mb-2" />
            <span className="text-white text-sm">AI Trade Signals</span>
          </p>
          <p className="flex items-center">
            <Check className="text-blue-500 text-lg mr-2 mb-2" />
            <span className="text-white text-sm">Watchlist</span>
          </p>
          <p className="flex items-center">
            <Check className="text-blue-500 text-lg mr-2 mb-2" />
            <span className="text-white text-sm">Latest News</span>
          </p>
          <p className="flex items-center">
            <Check className="text-blue-500 text-lg mr-2 mb-2" />
            <span className="text-white text-sm">Key Statistics</span>
          </p>
          <p className="flex items-center">
            <Check className="text-blue-500 text-lg mr-2 mb-2" />
            <span className="text-white text-sm">Financials</span>
          </p>
          <p className="flex items-center">
            <Check className="text-blue-500 text-lg mr-2 mb-2" />
            <span className="text-white text-sm">Offerings</span>
          </p>
          <p className="flex items-center">
            <Check className="text-blue-500 text-lg mr-2 mb-2" />
            <span className="text-white text-sm">Insider Roster</span>
          </p>
          <p className="flex items-center mb-10">
            <Check className="text-blue-500 text-lg mr-2" />
            <span className="text-white text-sm">Top Institutional Owners</span>
          </p>
          <button
            disabled={isSubmitting ? true : false}
            onClick={handleButtonClick}
            value="price_1KRROLIUx22VK4GNHslw9W1x"
            className={`w-full h-[42px] flex text-sm justify-center bg-[length:200%] bg-left hover:bg-right items-center text-white font-medium rounded-md transition-all duration-500 ${
              annualLoader
                ? "bg-gradient-to-r from-indigo-400 to-rose-400 hover:bg-left"
                : "bg-gradient-to-r from-indigo-600 to-rose-600"
            }`}
          >
            {annualLoader ? <ButtonSpinner /> : "Select Plan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChoosePlan;
