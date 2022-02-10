import axios from "axios";
import { useState } from "react";
import {
  CreditCard,
  ArrowRepeat,
  XCircle,
  ArrowReturnLeft,
  DashLg,
} from "react-bootstrap-icons";
import { useRouter } from "next/router";
import ButtonSpinner from "../ButtonSpinner";
import PaymentElementProvider from "./PaymentMethodModal";
import ChangeSubscriptionModal from "./ChangeSubscriptionModal";
import SetupSubscription from "./SetupSubscription";
import { format } from "date-fns";

const SubscriptionInformation = ({ user, accountMessage, refreshData }) => {
  // router
  const router = useRouter();

  // if form is submitting
  const [isSubmitting, setIsSubmitting] = useState(false);
  // customers current plan to dislay...null, canceled, monthly, annual
  const [plan, setPlan] = useState(user.subscriptionType);
  // just shows customer was updates successfully
  const [success, setSuccess] = useState();
  // if some kind of error happens when trying to update subscription
  const [errorMessage, setErrorMessage] = useState(false);
  // this is the for the modal that pops up when canceling plan
  const [cancelModalActive, setCancelModalActive] = useState(false);
  // this is for the modal that pops up when renewing plan
  const [renewModalActive, setRenewModalActive] = useState(false);
  // payment element modal
  const [paymentElementActive, setPaymentElementActive] = useState(false);
  // change payment button loading
  const [paymentLoading, setPaymentLoading] = useState(false);
  // change subscription modal
  const [changeSubscriptionActive, setChangeSubscriptionActive] =
    useState(false);
  const [priceId, setPriceId] = useState();

  // function allows customer to cancel and renew their subscription
  const updateRenewal = async (e) => {
    setIsSubmitting(true);
    //check if payment is failed, if failed, we are canceling subscription right now
    if (user.paymentStatus === "failed") {
      const response = await axios
        .post("/api/cancel-subscription", {
          subscriptionId: user.subscriptionId,
        })
        .catch((e) => console.error(e));
      if (response?.data === "subscription deleted") {
        setIsSubmitting(false);
        setCancelModalActive(false);
        return router.push("/admin/subscription-deleted");
      } else {
        setIsSubmitting(false);
        setCancelModalActive(false);
        return setErrorMessage(true);
      }
    }

    // send info to backend to update plan info
    const response = await axios.post("/api/auto-renew-subscription", {
      email: user.email,
      subscriptionId: user.subscriptionId,
      status: e.target.value,
    });
    // if response comes back renewed show message
    if (response.data === "subscription renewed") {
      setIsSubmitting(false);
      setRenewModalActive(false);
      router.replace(router.asPath);
      return setSuccess("renewed");
      // if response comes back canceled show message
    } else if (response.data === "subscription canceled") {
      setIsSubmitting(false);
      setCancelModalActive(false);
      router.replace(router.asPath);
      return setSuccess("canceled");
      // if something goes wrong, show error message
    } else {
      setIsSubmitting(false);
      setCancelModalActive(false);
      return setErrorMessage(true);
    }
  };

  // handle payment method update
  const handlePaymentMethodClick = () => {
    setPaymentElementActive(true);
    setPaymentLoading(true);
  };

  // handle subscription change
  const handleSubscriptionChange = async (e) => {
    setChangeSubscriptionActive(true);
    setPriceId(e.target.value);
  };

  // if user has no plan, has canceled in the past, or has no payment method
  // make them choose a plan
  if (
    user.subscriptionType === null ||
    user.isCanceled ||
    !user.defaultPaymentMethod
  )
    return <SetupSubscription accountMessage={accountMessage} user={user} />;

  return (
    <div className="relative">
      {success && (
        <div className="absolute top-[-200px] left-[50%] translate-x-[-50%] w-full max-w-[340px] p-4 rounded-md bg-gradient-to-br from-green-400 to-green-600">
          {success === "canceled" && !errorMessage && (
            <p className="text-xs font-semibold text-center text-black leading-5">
              Your Subscription has been canceled.
              <br />
              You will have access until the next billing period.
            </p>
          )}
          {success === "renewed" && !errorMessage && (
            <p className="text-xs font-semibold text-center text-black leading-5">
              Your subscription has been renewed.
              <br />
              You will continue to be billed normally.
            </p>
          )}
          {success === "subscription updated" && !errorMessage && (
            <p className="text-xs font-semibold text-center text-black leading-5">
              Your subscription has been updated!
            </p>
          )}
        </div>
      )}
      {errorMessage && (
        <div className="absolute top-[-200px] left-[50%] translate-x-[-50%] w-fit p-4 rounded-md bg-gradient-to-br from-red-400 to-red-600">
          <p className="text-xs font-semibold text-center text-black leading-5">
            Something went wrong, please try again.
          </p>
        </div>
      )}
      {router.query.paymentMethodUpdated && !success && !errorMessage && (
        <div className="absolute top-[-200px] left-[50%] translate-x-[-50%] w-fit p-4 rounded-md bg-gradient-to-br from-green-400 to-green-600">
          <p className="text-xs font-semibold text-center text-black leading-5">
            Payment method updated!
          </p>
        </div>
      )}
      {accountMessage &&
        !success &&
        !errorMessage &&
        !router.query.paymentMethodUpdated && (
          <div className="absolute top-[-200px] left-[50%] translate-x-[-50%] w-fit p-4 rounded-md bg-gradient-to-br from-amber-400 to-amber-600">
            <p className="text-xs font-semibold text-center text-black leading-5">
              {accountMessage}
            </p>
          </div>
        )}
      {/* <p className="text-gray-700 font-bold text-2xl border-b border-gray-300 pb-3 mb-8 mt-12 animate-fadeInUp translate-y-12">
        Subscription Information
      </p> */}
      <div className="bg-black p-3 w-full rounded-md text-sm flex justify-between items-center mb-4 animate-fadeInUp translate-y-12">
        <p className="text-white">
          <span className="font-medium">Pryzma Monthly</span>{" "}
          <span>($79.99/mo)</span>
        </p>
        <button
          onClick={handleSubscriptionChange}
          value="price_1KRRO2IUx22VK4GNyRLlzRbO"
          disabled={
            plan === "monthly" || user.paymentStatus === "failed" ? true : false
          }
          className={`p-2 w-[116px] rounded-md font-medium transition-all bg-left duration-300 ${
            plan === "monthly"
              ? "bg-gradient-to-r from-indigo-600 to-rose-600 bg-[length:200%] animate-move text-white"
              : "border border-neutral-700 text-neutral-500 hover:border-white hover:text-white"
          } ${user.paymentStatus === "failed" ? "cursor-not-allowed" : ""}`}
        >
          {plan === "monthly" && "Current Plan"}
          {plan === "annual" && "Change Plan"}
          {plan === "canceled" || plan === null ? "Select Plan" : ""}
        </button>
      </div>
      <div className="bg-black p-3 w-full rounded-md text-sm flex justify-between items-center animate-fadeInUp translate-y-12">
        <p className="text-white">
          <span className="font-medium">Pryzma Annual</span>{" "}
          <span>($799.99/yr)</span>
        </p>
        <button
          onClick={handleSubscriptionChange}
          value="price_1KRROLIUx22VK4GNHslw9W1x"
          disabled={
            plan === "annual" || user.paymentStatus === "failed" ? true : false
          }
          className={`p-2 w-[116px] rounded-md font-medium transition-all bg-left bg-[length:200%] duration-300 ${
            plan === "annual"
              ? "bg-gradient-to-r from-indigo-600 to-rose-600 bg-[length:200%] animate-move text-white"
              : "border border-neutral-700 text-neutral-500 hover:border-white hover:text-white"
          } ${user.paymentStatus === "failed" ? "cursor-not-allowed" : ""}`}
        >
          {plan === "annual" && "Current Plan"}
          {plan === "monthly" && "Change Plan"}
          {plan === "canceled" || plan === null ? "Select Plan" : ""}
        </button>
      </div>
      <div className="flex mt-4 animate-fadeInUp translate-y-12">
        <div className="bg-black p-4 w-full mr-4 rounded-md">
          <p className="font-medium text-center mb-4 text-white">
            Payment Method
          </p>
          <div className="flex items-center justify-center">
            <p className="mr-4 flex items-center">
              <CreditCard className="mr-2 text-xl text-white" />
              <span className="uppercase text-xs text-white font-light">
                {user.cardDetails.brand}
              </span>
            </p>
            <p className="text-white text-xs font-light">
              ****{user.cardDetails.last4}
            </p>
          </div>
        </div>
        <div className="p-4 bg-black w-full rounded-md">
          <p className="font-medium text-center mb-4 text-white">
            Next Billing Period
          </p>
          {user.cancelAtPeriodEnd ? (
            <DashLg className="text-xl text-white mx-auto" />
          ) : user.nextInvoice ? (
            <p className="text-white font-light text-center text-sm">
              {format(new Date(user.nextInvoice * 1000), "MMMM dd, yyyy")}
            </p>
          ) : (
            <DashLg className="text-xl text-white mx-auto" />
          )}
        </div>
      </div>
      <div className="mt-8 flex animate-fadeInUp translate-y-12">
        {(user.cancelAtPeriodEnd === false &&
          user.subscriptionType &&
          !user.isCanceled) ||
        user.subscriptionType === null ? (
          <button
            disabled={paymentLoading ? true : false}
            onClick={handlePaymentMethodClick}
            className={`p-2.5 w-[229px] justify-center rounded-md border transition-all duration-300 text-sm font-medium flex items-center mr-4 ${
              paymentLoading
                ? "bg-neutral-700 border-neutral-700"
                : "border-white bg-white text-black hover:bg-transparent hover:text-white"
            }`}
          >
            {paymentLoading ? (
              <ButtonSpinner />
            ) : (
              <>
                <CreditCard className="mr-2 text-xl" />
                <span>Update Payment Method</span>
              </>
            )}
          </button>
        ) : (
          ""
        )}
        {user.cancelAtPeriodEnd && user.subscriptionId ? (
          <button
            onClick={() => setRenewModalActive(true)}
            className={`p-2.5 pl-4 pr-4 rounded-md font-medium border text-sm border-white bg-white text-black hover:bg-transparent hover:text-white transition-all duration-300 flex items-center`}
          >
            <ArrowRepeat className="mr-2 text-xl" />
            Renew Plan
          </button>
        ) : (
          ""
        )}
        {!user.cancelAtPeriodEnd && !user.isCanceled ? (
          <button
            onClick={() => setCancelModalActive(true)}
            className="p-2.5 pl-4 pr-4 rounded-md text-xs flex items-center border border-neutral-700 text-neutral-500 hover:border-white hover:text-white transition-all duration-300"
          >
            <XCircle className="mr-2 text-xl" />
            Cancel Plan
          </button>
        ) : (
          ""
        )}
      </div>
      <CancelModal
        updateRenewal={updateRenewal}
        isSubmitting={isSubmitting}
        cancelModalActive={cancelModalActive}
        setCancelModalActive={setCancelModalActive}
        user={user}
      />
      <RenewModal
        updateRenewal={updateRenewal}
        isSubmitting={isSubmitting}
        renewModalActive={renewModalActive}
        setRenewModalActive={setRenewModalActive}
      />
      {paymentElementActive && (
        <PaymentElementProvider
          paymentElementActive={paymentElementActive}
          setPaymentElementActive={setPaymentElementActive}
          user={user}
          paymentLoading={paymentLoading}
          setPaymentLoading={setPaymentLoading}
        />
      )}
      <ChangeSubscriptionModal
        plan={plan}
        changeSubscriptionActive={changeSubscriptionActive}
        setChangeSubscriptionActive={setChangeSubscriptionActive}
        priceId={priceId}
        setPlan={setPlan}
        user={user}
        setErrorMessage={setErrorMessage}
        setSuccess={setSuccess}
        refreshData={refreshData}
      />
      <p className="text-neutral-400 text-xs mt-10 leading-5 animate-fadeInUp translate-y-12">
        Please note that we do not provide refunds. If you downgrade from annual
        to monthly, we will keep a credit on your account (ex. if you downgrade
        from Annual to Monthly, we will apply the pro-rated credit to your next
        bill), but we do not issue refunds to your card.
      </p>
    </div>
  );
};

// cancel subscription modal
const CancelModal = ({
  updateRenewal,
  isSubmitting,
  cancelModalActive,
  setCancelModalActive,
  user,
}) => {
  return (
    <>
      <div
        onClick={() => setCancelModalActive(false)}
        className={`fixed h-screen w-screen top-0 left-0 bg-black/75 transition-all ${
          cancelModalActive ? "opacity-100 z-[10]" : "opacity-0 z-[-1]"
        }`}
      ></div>
      <div
        className={`w-[320px] bg-neutral-800 p-6 pt-8 pb-8 rounded-lg fixed transition-all top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%] ${
          cancelModalActive ? "opacity-100 z-[10]" : "opacity-0 z-[-1]"
        }`}
      >
        <p className="text-center font-medium text-2xl text-white mb-2">
          Cancel Plan
        </p>
        <p className="text-white font-light text-center leading-7 mb-10">
          {user.paymentStatus !== "failed" &&
            "Are you sure you want to cancel your subscription? You will still have access to your current services until the next billing period."}
          {user.paymentStatus === "failed" &&
            "Are you sure you want to cancel your subscription? You will lose all access to features immediately."}
        </p>
        <div className="flex justify-center">
          <button
            value={true}
            disabled={isSubmitting ? true : false}
            onClick={updateRenewal}
            className={`h-[40px] mr-2 p-2.5 w-full rounded-md border text-sm font-medium transition-all flex items-center justify-center duration-300 ${
              isSubmitting
                ? "bg-red-400 border-red-400"
                : "border-red-600 text-red-600 bg-transparent hover:text-white hover:bg-red-600"
            }`}
          >
            {isSubmitting ? (
              <ButtonSpinner />
            ) : (
              <>
                <XCircle className="mr-2 text-xl " />
                Cancel Plan
              </>
            )}
          </button>
          <button
            onClick={() => setCancelModalActive(false)}
            className="flex items-center p-2.5 w-full rounded-md justify-center text-sm font-medium transition-all duration-300 border border-neutral-700 text-neutral-500 hover:border-white hover:text-white"
          >
            Go Back
            <ArrowReturnLeft className="text-xl ml-2" />
          </button>
        </div>
      </div>
    </>
  );
};

// renew modal
const RenewModal = ({
  updateRenewal,
  isSubmitting,
  renewModalActive,
  setRenewModalActive,
}) => {
  return (
    <>
      <div
        onClick={() => setRenewModalActive(false)}
        className={`fixed h-screen w-screen top-0 left-0 bg-black/75 transition-all ${
          renewModalActive ? "opacity-100 z-[10]" : "opacity-0 z-[-1]"
        }`}
      ></div>
      <div
        className={`w-[320px] bg-neutral-800 p-6 pt-8 pb-8 rounded-lg fixed transition-all top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%] ${
          renewModalActive ? "opacity-100 z-[10]" : "opacity-0 z-[-1]"
        }`}
      >
        <p className="text-center font-medium text-2xl text-white mb-2">
          Renew Plan
        </p>
        <p className="text-white font-light text-center leading-7 mb-10">
          Are you sure you want to renew your current subscription? Doing so
          will allow you to keep your current services, while being billed
          normally.
        </p>
        <div className="flex justify-center">
          <button
            value={undefined}
            disabled={isSubmitting ? true : false}
            onClick={updateRenewal}
            className={`h-[40px] mr-2 p-2.5 w-full min-w-fit rounded-md border text-sm font-medium transition-all flex items-center justify-center duration-300 ${
              isSubmitting
                ? "border-neutral-700 bg-neutral-700"
                : "border-white bg-white text-black hover:bg-transparent hover:text-white"
            }`}
          >
            {isSubmitting ? (
              <ButtonSpinner />
            ) : (
              <>
                <ArrowRepeat className="mr-2 text-xl " />
                Renew Plan
              </>
            )}
          </button>
          <button
            onClick={() => setRenewModalActive(false)}
            className="flex items-center p-2.5 w-full rounded-md justify-center text-sm font-medium transition-all duration-300 border border-neutral-700 text-neutral-500 hover:border-white hover:text-white"
          >
            Go Back
            <ArrowReturnLeft className="text-xl ml-2" />
          </button>
        </div>
      </div>
    </>
  );
};

export default SubscriptionInformation;
