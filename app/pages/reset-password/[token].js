import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ButtonSpinner from "../../components/ButtonSpinner";
import Head from "next/head";

const ResetPassword = ({ query }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { password, confirmPassword } = data;
    if (password !== confirmPassword)
      return setErrorMessage("Passwords don't match");
    setIsSubmitting(true);
    const response = await axios
      .post("/api/reset-password", { password: password, token: query?.token })
      .catch(() => setErrorMessage("Something went wrong"));
    if (response) {
      if (response.data === "password updated") {
        return router.push("/login?passwordUpdated=true");
      }
      if (response.data === "token not found") {
        setIsSubmitting(false);
        return setErrorMessage("Invalid Token");
      }
      if (response.data === "something went wrong") {
        setIsSubmitting(false);
        return setErrorMessage("Something went wrong");
      }
    } else {
      setIsSubmitting(false);
      setErrorMessage("Something went wrong");
    }
  };

  return (
    <div className="h-[calc(100vh-84px)] bg-black flex min-h-[600px] p-4">
      <Head>
        <title>Pryzma - Reset Password</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Reset Password" />
        <meta name="keywords" content="pryzma, reset password" />
      </Head>
      {errorMessage && (
        <div className="absolute top-[100px] left-[50%] translate-x-[-50%] w-fit p-4 rounded-md bg-gradient-to-br from-red-400 to-red-600">
          <p className="text-xs font-semibold text-center text-black leading-5">
            {errorMessage}
          </p>
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-sm mt-20 animate-fadeIn opacity-0"
      >
        <p className="text-white font-bold text-2xl text-center">
          Reset Password
        </p>
        <p className="text-sm text-neutral-400 mt-2 text-center leading-6">
          You can now create a new password below.
        </p>
        <div>
          <p className="mt-8 text-sm text-white pb-1">
            New Password (8 characters min)
          </p>
          <input
            placeholder="New Password"
            type="password"
            className={`w-full p-2.5 rounded-md text-white font-normal border outline-none placeholder:text-neutral-500  bg-transparent focus:border-white transition-all duration-300 border-neutral-700`}
            {...register("password", { required: true, minLength: 8 })}
          />
          {errors.password?.type === "required" && (
            <p className="text-xs font-medium text-rose-600 mt-0.5 absolute">
              *required field
            </p>
          )}
          {errors.password?.type === "minLength" && (
            <p className="text-xs font-medium text-red-600 mt-0.5 absolute">
              *password must be 8 characters
            </p>
          )}
        </div>
        <div>
          <p className="mt-8 text-sm text-white pb-1">Confirm Password</p>
          <input
            placeholder="Confirm Password"
            type="password"
            className={`w-full p-2.5 rounded-md text-white font-normal border outline-none placeholder:text-neutral-500  bg-transparent focus:border-white transition-all duration-300 border-neutral-700`}
            {...register("confirmPassword", { required: true, minLength: 8 })}
          />
          {errors.confirmPassword?.type === "required" && (
            <p className="text-xs font-medium text-rose-600 mt-0.5 absolute">
              *required field
            </p>
          )}
          {errors.confirmPassword?.type === "minLength" && (
            <p className="text-xs font-medium text-red-600 mt-0.5 absolute">
              *password must be 8 characters
            </p>
          )}
        </div>
        <button
          disabled={isSubmitting ? true : false}
          type="submit"
          className={`mx-auto font-medium text-sm border h-[40px] flex items-center justify-center w-full mt-8 rounded-md transition-all duration-300 ${
            isSubmitting
              ? "bg-neutral-700 border-neutral-700"
              : "text-black bg-white border-white hover:text-white hover:bg-transparent"
          }`}
        >
          {isSubmitting ? <ButtonSpinner /> : "Submit"}
        </button>
      </form>
    </div>
  );
};

ResetPassword.getInitialProps = ({ query }) => {
  return { query };
};

export default ResetPassword;
