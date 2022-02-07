import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import ButtonSpinner from "../ButtonSpinner";
import { CheckLg } from "react-bootstrap-icons";

const Password = ({ user }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    watch,
    reset,
  } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState("n/a");
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const onSubmit = async (data) => {
    // something here
    if (data.password !== data.confirmPassword) return;
    setIsSubmitting(true);
    const response = await axios
      .post("/api/update-password", {
        password: data.password,
        email: user.email,
      })
      .catch((e) => console.error(e));
    if (response.data === "password updated") {
      setIsSubmitting(false);
      setSuccess(true);
      setErrorMessage(false);
      reset();
    } else {
      setErrorMessage(true);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const password = watch("password");
    const confirmPassword = watch("confirmPassword");

    if (confirmPassword.length >= 8 && password.length >= 8) {
      password === confirmPassword && setPasswordMatch(true);
      password !== confirmPassword && setPasswordMatch("do not match");
    } else {
      setPasswordMatch("n/a");
    }
  }, [watch("password"), watch("confirmPassword")]);

  return (
    <div className="animate-fadeInUp translate-y-12 relative">
      {success && (
        <div className="absolute top-[-200px] left-[50%] translate-x-[-50%] w-fit p-4 rounded-md bg-gradient-to-br from-green-400 to-green-600">
          <p className="text-xs font-semibold text-center text-black leading-5">
            Your password has been updated.
          </p>
        </div>
      )}
      {errorMessage && (
        <div className="absolute top-[-200px] left-[50%] translate-x-[-50%] w-fit p-4 rounded-md bg-gradient-to-br from-red-400 to-red-600">
          <p className="text-xs font-semibold text-center text-black leading-5">
            Something went wrong, please try again.
          </p>
        </div>
      )}
      {/* <p className="text-gray-700 font-bold text-2xl border-b border-gray-300 pb-3 mb-6 mt-12">
        Change Password
      </p> */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex w-full">
          <div className="w-full mr-4">
            <p className="text-sm text-white font-light pb-1">
              New Password (min 8 characters)
            </p>
            <input
              type="password"
              className={`w-full p-2.5 rounded-md text-white font-normal border outline-none placeholder:text-neutral-500 bg-black focus:border-white transition-all duration-300 border-neutral-800`}
              placeholder="New Password"
              {...register("password", { required: true, minLength: 8 })}
            />
            {errors.password?.type === "required" &&
              passwordMatch === "n/a" && (
                <p className="text-xs font-medium text-red-500 mt-0.5 absolute">
                  *required field
                </p>
              )}
            {errors.password?.type === "minLength" &&
              passwordMatch === "n/a" && (
                <p className="text-xs font-medium text-red-500 mt-0.5 absolute">
                  *password must be 8 characters
                </p>
              )}
            {passwordMatch === "do not match" && (
              <p className="text-xs font-medium text-red-500 mt-0.5 absolute">
                *passwords do not match
              </p>
            )}
            {passwordMatch === true && (
              <p className="text-xs font-medium text-green-600 mt-0.5 absolute flex items-center">
                <CheckLg className="mr-2" />
                Passwords Match
              </p>
            )}
          </div>
          <div className="w-full">
            <p className="text-sm text-white pb-1 font-light">
              Confirm Password
            </p>
            <input
              type="password"
              className={`w-full p-2.5 rounded-md text-white font-normal border outline-none placeholder:text-neutral-500 bg-black focus:border-white transition-all duration-300 border-neutral-800`}
              placeholder="Confirm Password"
              {...register("confirmPassword", { required: true, minLength: 8 })}
            />
            {errors.confirmPassword?.type === "required" &&
              passwordMatch === "n/a" && (
                <p className="text-xs font-medium text-red-500 mt-0.5 absolute">
                  *required field
                </p>
              )}
            {errors.confirmPassword?.type === "minLength" &&
              passwordMatch === "n/a" && (
                <p className="text-xs font-medium text-red-500 mt-0.5 absolute">
                  *password must be 8 characters
                </p>
              )}
            {passwordMatch === "do not match" && (
              <p className="text-xs font-medium text-red-500 mt-0.5 absolute">
                *passwords do not match
              </p>
            )}
            {passwordMatch === true && (
              <p className="text-xs font-medium text-green-600 mt-0.5 absolute flex items-center">
                <CheckLg className="mr-2" /> Passwords Match
              </p>
            )}
          </div>
        </div>
        <button
          disabled={isSubmitting ? true : false}
          type="submit"
          className={`text-sm mt-8 font-medium rounded-md h-[40px] border w-[166px] flex items-center justify-center transition-all duration-300 ${
            isSubmitting
              ? "border-neutral-700 bg-neutral-700"
              : "border-white bg-white text-black hover:bg-transparent hover:text-white"
          }`}
        >
          {isSubmitting ? <ButtonSpinner /> : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default Password;
