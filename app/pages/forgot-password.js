import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import ButtonSpinner from "../components/ButtonSpinner";
import { useRouter } from "next/router";
import Head from "next/head";

const ForgotPassword = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [message, setMessage] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const response = await axios
      .post("/api/forgot-password", { email: data.email })
      .catch(() => {
        setErrorMessage("Something went wrong, please try again.");
        setIsSubmitting(false);
      });
    if (response) {
      if (response.data === "email sent") {
        setIsSubmitting(false);
        return setMessage(
          "An email has been sent to you with instructions on how to reset your password."
        );
      }
      if (response.data === "user not found") {
        setIsSubmitting(false);
        return setErrorMessage(
          "The email you entered was not found in our records."
        );
      }
      if (response.data === "something went wrong") {
        setIsSubmitting(false);
        return setErrorMessage("Something went wrong, please try again.");
      }
    } else {
      setIsSubmitting(false);
      setErrorMessage("Something went wrong, please try again.");
    }
  };

  return (
    <div className="max-w-sm w-full mx-auto h-[calc(100vh-84px)] min-h-[600px] flex flex-col opacity-0 animate-fadeIn">
      <Head>
        <title>Pryzma - Forgot Password</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Forgot Password" />
        <meta name="keywords" content="forgot password" />
      </Head>
      {errorMessage && (
        <div className="absolute top-[100px] max-w-[300px] left-[50%] translate-x-[-50%] p-4 rounded-md bg-gradient-to-br from-red-400 to-red-600">
          <p className="text-xs font-semibold text-center text-black leading-5">
            {errorMessage}
          </p>
        </div>
      )}
      {message && (
        <div className="absolute top-[100px] max-w-[320px] left-[50%] translate-x-[-50%] p-4 rounded-md bg-gradient-to-br from-green-400 to-green-600">
          <p className="text-xs font-semibold text-center text-black leading-5">
            {message}
          </p>
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-20">
        <p className="font-semibold text-white text-2xl text-center">
          Forgot Password
        </p>
        <p className="text-sm text-neutral-400 mt-2 text-center leading-6">
          Enter the email associated with your account. If there is an existing
          account with the provided email, we will send you an email with a
          special link to reset your password.
        </p>
        <input
          type="email"
          placeholder="Email"
          className={`w-full p-2.5 rounded-md text-white font-normal border outline-none placeholder:text-neutral-500  bg-transparent focus:border-white transition-all duration-300 border-neutral-700 mt-8`}
          {...register("email", { required: true })}
        />
        {errors.email && (
          <p className="text-xs font-medium text-red-600 mt-0.5 absolute">
            *required field
          </p>
        )}
        <button
          disabled={isSubmitting ? true : false}
          type="submit"
          className={`mx-auto border font-medium text-sm h-[40px] flex items-center justify-center w-full mt-8 rounded-md transition-all duration-300 ${
            isSubmitting
              ? "bg-neutral-700 border-neutral-700"
              : "border-white bg-white text-black hover:bg-transparent hover:text-white"
          }`}
        >
          {isSubmitting ? <ButtonSpinner /> : "Submit"}
        </button>
      </form>
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => router.back()}
          className="transition-all text-xs font-medium text-neutral-500 hover:text-white"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
