import {useState} from 'react';
import {appendErrors, useForm} from 'react-hook-form';
import axios from 'axios';
import {useRouter} from 'next/router';
import ButtonSpinner from '../components/ButtonSpinner'

const SignupPromotion = () => {

  const router = useRouter();
  const { handleSubmit, register, formState: {errors} } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState()

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) return setErrorMessage('Passwords do not match.')
    if (data.password.length < 8) return setErrorMessage('Password must be at least 8 characters long')
    setIsSubmitting(true)
    // send data to backend
    const response = await axios.post('/api/free-signup', {data});
    if (response) {
      if (response.data === 'customer created') {
        return router.push('/login?newAccount=true')
      }
      if (response.data === 'user already exists') {
        setIsSubmitting(false);
        return setErrorMessage('Email already exists')
      }
      if (response.data === 'something went wrong') {
        setIsSubmitting(false);
        return setErrorMessage('Something went wrong, please try again.')
      }
    }
  }

  return (
    <div className="bg-black px-4 h-[calc(100vh-84px)] min-h-[800px] flex flex-col">
      <form className="max-w-md mx-auto mt-24 w-full opacity-0 animate-fadeIn" onSubmit={handleSubmit(onSubmit)}>
        <p className="text-white font-semibold text-2xl text-center">Sign Up</p>
        <div classNamew="w-full mt-6">
            <p className="mt-6 text-sm text-white font-light pb-1">First Name</p>
            <input
              disabled={isSubmitting ? true : false}
              type="text"
              placeholder="First Name"
              autoComplete="off"
              className={`w-full p-2.5 rounded-md text-white font-normal border outline-none placeholder:text-neutral-500  bg-transparent focus:border-white transition-all duration-300 border-neutral-700`}
              {...register("first", { required: true })}
            />
            {errors.first && (
              <p className="text-xs font-semibold text-red-600 mt-0.5 absolute">
                *required field
              </p>
            )}
          </div>
          <div>
          <p className="mt-6 text-sm font-light text-white pb-1">Last Name</p>
          <input
            type="text"
            placeholder="Last Name"
            autoComplete="off"
            className={`w-full p-2.5 rounded-md text-white font-normal border outline-none placeholder:text-neutral-500  bg-transparent focus:border-white transition-all duration-300 border-neutral-700`}
            {...register("last", { required: true })}
          />
          {errors.last && (
            <p className="text-xs font-medium text-red-500 mt-0.5 absolute">
              *required field
            </p>
          )}
        </div>
        <div>
          <p className="mt-6 text-sm text-white font-light pb-1">Email</p>
          <input
            type="email"
            placeholder="Email"
            autoComplete="off"
            className={`w-full p-2.5 rounded-md text-white font-normal border outline-none placeholder:text-neutral-500  bg-transparent focus:border-white transition-all duration-300 border-neutral-700`}
            {...register("email", { required: true })}
          />
          {errors.email && (
            <p className="text-xs font-medium text-red-500 mt-0.5 absolute">
              *required field
            </p>
          )}
        </div>
        <div>
          <p className="mt-6 text-sm text-white font-light pb-1">Password (8 char. min)</p>
          <input
            type="password"
            placeholder="Password"
            className={`w-full p-2.5 rounded-md text-white font-normal border outline-none placeholder:text-neutral-500 bg-transparent focus:border-white transition-all duration-300 border-neutral-700`}
            {...register("password", { required: true })}
          />
          {errors.password && (
            <p className="text-xs font-medium text-red-500 mt-0.5 absolute">
              *required field
            </p>
          )}
        </div>
        <div>
          <p className="mt-6 text-sm text-white font-light pb-1">Confirm Password</p>
          <input
            type="password"
            placeholder="Password"
            className={`w-full p-2.5 rounded-md text-white font-normal border outline-none placeholder:text-neutral-500  bg-transparent focus:border-white transition-all duration-300 border-neutral-700`}
            {...register("confirmPassword", { required: true })}
          />
          {errors.confirmPassword && (
            <p className="text-xs font-medium text-red-500 mt-0.5 absolute">
              *required field
            </p>
          )}
        </div>
        <div className="mt-8">
          <button type="submit" className={`h-[42px] flex items-center justify-center w-full rounded-md text-sm font-medium border transition-all duration-300 ${isSubmitting ? 'bg-neutral-700 border-neutral-700' : 'border-white bg-white text-black hover:bg-transparent hover:text-white'}`}>{isSubmitting ? <ButtonSpinner /> : 'Create Account'}</button>
        </div>
      </form>
      {errorMessage && (
        <div className="p-4 max-w-[300px] bg-gradient-to-br from-red-400 to-red-600 rounded-md w-full mx-auto mt-8 opacity-0 animate-fadeIn">
          <p className="text-xs font-semibold text-center text-black">
            {errorMessage}
          </p>
        </div>
      )}
    </div>
  )
}

export default SignupPromotion;