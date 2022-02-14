import {
  Text,
  Input,
  Button,
  Spacer,
  Tabs,
  Toggle,
  useToasts,
  Card,
} from "@geist-ui/core";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

const Login = () => {
  const router = useRouter();

  const [checked, setChecked] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { setToast } = useToasts();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    let response;
    // send user credentials to backend
    if (checked) {
      response = await axios.post("/api/authenticate/remember", { data });
    } else {
      response = await axios.post("/api/authenticate/forget", { data });
    }
    if (response.status === 200) {
      if (response.data === "user logged in") return router.push("/admin");
      if (response.data === "user not found") {
        setIsLoading(false);
        return setToast({
          text: "Email not found in our records.",
          type: "error",
        });
      }
      if (response.data === "incorrect password") {
        setIsLoading(false);
        return setToast({ text: "Incorrect Password", type: "error" });
      }
    } else {
      setIsLoading(false);
      setToast({
        text: "Something went wrong, please try again.",
        type: "error",
      });
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ maxWidth: 350, margin: "auto", marginTop: 30 }}>
        <Text h2 style={{ fontWeight: 700, textAlign: "center" }} mb="30px">
          Login
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email"
            htmlType="email"
            width="100%"
            {...register("email", { required: true })}
          />
          <Spacer />
          <Input
            label="Password"
            htmlType="password"
            width="100%"
            {...register("password", { required: true })}
          />
          <Spacer />
          <div style={{ display: "flex", alignItems: "center" }}>
            <Toggle
              padding={0}
              initialChecked
              onChange={() => (checked ? setChecked(false) : setChecked(true))}
            />
            <Text type="secondary" small ml="10px">
              Keep me logged in
            </Text>
          </div>
          <Spacer />
          <Button
            width="100%"
            htmlType="submit"
            loading={isLoading ? true : false}
          >
            Login
          </Button>
        </form>
        <Tabs
          value={router.pathname}
          onChange={(route) => router.push(route)}
          hideBorder
          hideDivider
          align="center"
          hoverWidthRatio={0}
          mt="10px"
        >
          <Tabs.Item
            label="Forgot Password?"
            value="/forgot-password"
          ></Tabs.Item>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
