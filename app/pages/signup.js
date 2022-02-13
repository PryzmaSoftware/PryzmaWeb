import { Input, Text, Spacer, Button, Select, useToasts } from "@geist-ui/core";
import { useState } from "react";
import { useForm } from "react-hook-form";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { setToast } = useToasts();

  const [plan, setPlan] = useState(null);
  const [planError, setPlanError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data) => {
    if (data.password !== data.confirmPassword)
      return setToast({
        text: "The passwords you entered do not match.",
        type: "error",
      });
    if (!plan) {
      setPlanError(true);
      return setToast({ text: "Please select a subscription.", type: "error" });
    }
    setIsLoading(true);
  };

  const changePlan = (value) => {
    setPlan(value);
    setPlanError(false);
  };

  const testInput = () => {
    if (!plan) setPlanError(true);
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ maxWidth: 400, margin: "auto", marginTop: 30 }}>
        <Text h2 style={{ fontWeight: 700, textAlign: "center" }} mb="0px">
          Create Account
        </Text>
        <Text
          type="secondary"
          style={{ textAlign: "center" }}
          mt="0px"
          mb="0px"
        >
          Sign up now for a 7 day free trial.
        </Text>
        <Text
          type="secondary"
          style={{ textAlign: "center" }}
          mb="30px"
          mt="0px"
        >
          No credit card required!
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="First Name"
            placeholder="First Name"
            width="100%"
            type={errors.first && "error"}
            htmlType="text"
            {...register("first", { required: true })}
          />
          <Spacer />
          <Input
            label="Last Name"
            placeholder="First Name"
            width="100%"
            htmlType="text"
            type={errors.last && "error"}
            {...register("last", { required: true })}
          />
          <Spacer />
          <Input
            label="Email"
            placeholder="Email"
            width="100%"
            type={errors.email && "error"}
            htmlType="email"
            {...register("email", { required: true })}
          />
          <Spacer />
          <Input.Password
            label="Password"
            placeholder="Password"
            width="100%"
            type={errors.password && "error"}
            htmlType="password"
            {...register("password", { required: true })}
          />
          <Spacer />
          <Input.Password
            label="Confirm Password"
            placeholder="Confirm Password"
            width="100%"
            type={errors.confirmPassword && "error"}
            htmlType="password"
            {...register("confirmPassword", { required: true })}
          />
          <Spacer />
          <Select
            placeholder="Select Plan"
            width="95.5%"
            onChange={(value) => changePlan(value)}
            type={planError && "error"}
          >
            <Select.Option value="monthly">Monthly ($79.99/mo)</Select.Option>
            <Select.Option value="annual">Annual ($799.99/yr)</Select.Option>
          </Select>
          <Spacer />
          <Button
            htmlType="submit"
            width="100%"
            onClick={testInput}
            loading={isLoading ? true : false}
          >
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
};
export default SignUp;
