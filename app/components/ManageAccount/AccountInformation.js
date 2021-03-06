import axios from "axios";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import ButtonSpinner from "../ButtonSpinner";

const AccountInformation = ({ user }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const response = await axios
      .post("/api/update-customer", {
        newEmail: data.email,
        oldEmail: user.email,
        firstName: data.firstName,
        lastName: data.lastName,
      })
      .catch((e) => console.error(e));
    if (response.data !== "email is already in use") {
      setIsSubmitting(false);
      setSuccess(true);
      return router.replace(router.asPath, {
        query: {
          updatedAccount: `${data.firstName},${data.lastName},${data.email}`,
        },
      });
    }
    if (response.data === "email is already in use") {
      setIsSubmitting(false);
      return setEmailError("*email already in use");
    }
    setErrorMessage("something went wrong, please try again");
    setIsSubmitting(false);
  };

  return (
    <div className="relative">
      {errorMessage && (
        <div className="absolute top-[-200px] left-[50%] translate-x-[-50%] w-fit p-4 rounded-md bg-gradient-to-br from-red-400 to-red-600">
          <p className="text-xs font-semibold text-center text-black leading-5">
            {errorMessage}
          </p>
        </div>
      )}
      {success && (
        <div className="absolute top-[-200px] left-[50%] translate-x-[-50%] w-fit p-4 rounded-md bg-gradient-to-br from-green-400 to-green-600">
          <p className="text-xs font-semibold text-center text-black leading-5">
            Your account has been updated.
          </p>
        </div>
      )}
      {/* <p className="text-gray-700 font-bold text-2xl pb-3 mb-6 mt-12 animate-fadeInUp translate-y-12">
        Account Information
      </p> */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="animate-fadeInUp translate-y-12"
      >
        <div className="flex w-full">
          <div className="w-full mr-4 mb-6">
            <p className="text-sm text-white font-light pb-1">First Name</p>
            <input
              onChange={(e) => setFirstName(e.target.value)}
              type="text"
              className={`w-full p-2.5 rounded-md text-white font-normal border outline-none placeholder:text-neutral-500 bg-black focus:border-white transition-all duration-300 border-neutral-800`}
              {...register("firstName", { required: true, value: firstName })}
            />
            {errors.firstName && (
              <p className="text-xs font-medium text-red-500 mt-0.5 absolute">
                *required field
              </p>
            )}
          </div>
          <div className="w-full">
            <p className="text-sm text-white font-light pb-1">Last Name</p>
            <input
              onChange={(e) => setLastName(e.target.value)}
              type="text"
              className={`w-full p-2.5 rounded-md text-white font-normal border outline-none placeholder:text-neutral-500 bg-black focus:border-white transition-all duration-300 border-neutral-800`}
              {...register("lastName", { required: true, value: lastName })}
            />
            {errors.lastName && (
              <p className="text-xs font-medium text-red-500 mt-0.5 absolute">
                *required field
              </p>
            )}
          </div>
        </div>
        <div className="flex w-full">
          <div className="w-full mr-4">
            <p className="text-sm text-white pb-1 font-light">Email</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className={`w-full p-2.5 rounded-md text-white font-normal border outline-none placeholder:text-neutral-500 bg-black focus:border-white transition-all duration-300 border-neutral-800`}
              {...register("email", { required: true, value: email })}
            />
            {errors.email && !emailError && (
              <p className="text-xs font-medium text-red-500 mt-0.5 absolute">
                *required field
              </p>
            )}
            {emailError && (
              <p className="text-xs font-medium text-red-500 mt-0.5 absolute">
                *email is already in use
              </p>
            )}
          </div>
          <div className="w-full">
            <p className="text-sm text-white font-light pb-1">Date Joined</p>
            <p className="mt-2 text-white">
              {format(new Date(user.dateJoined), "MMMM dd, yyyy")}
            </p>
          </div>
        </div>
        <button
          disabled={isSubmitting ? true : false}
          type="submit"
          className={`text-sm mt-8 font-medium rounded-md h-[40px] w-[180px] flex border items-center justify-center transition-all duration-300 ${
            isSubmitting
              ? "border-neutral-700 bg-neutral-700"
              : "border-white bg-white text-black hover:bg-transparent hover:text-white"
          }`}
        >
          {isSubmitting ? <ButtonSpinner /> : "Update Account Info"}
        </button>
      </form>
    </div>
  );
};

export default AccountInformation;
