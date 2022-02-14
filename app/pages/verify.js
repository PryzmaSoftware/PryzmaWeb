import { Text, Button, Input, Spacer, useToasts, Tag } from "@geist-ui/core";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

const Verify = ({ query }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const { setToast } = useToasts();
  const router = useRouter();

  const { handleSubmit, register } = useForm();

  const onSubmit = async (data) => {
    setCodeError(false);
    if (!query.email) {
      return setToast({ text: "No email to verify", type: "error" });
    }
    if (!data.code) {
      setToast({ text: "Please enter your verification code", type: "error" });
      return setCodeError(true);
    }

    setIsLoading(true);

    const response = await axios.post("/api/verify", {
      email: query.email,
      code: data.code,
    });

    if (response.status === 200) {
      if (response.data === "email verified") {
        return router.push("/login", { query: { verified: true } });
      }
      if (response.data === "invalid code") {
        setIsLoading(false);
        return setToast({ text: "Invalid Code", type: "error" });
      }
    } else {
      setIsLoading(false);
      setToast({
        text: "Something went wrong, please try again.",
        type: "error",
      });
    }
  };

  const resendEmail = async () => {
    if (!query.email) {
      return setToast({ text: "No email to verify", type: "error" });
    }
    const response = await axios.post("/api/resend-email", {
      email: query.email,
    });
    if (response.status === 200) {
      setToast({ text: "Verification code has been sent!", type: "success" });
    } else {
      setToast({
        text: "Something went wrong, please try again.",
        type: "error",
      });
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ maxWidth: 350, margin: "auto", marginTop: 30 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Tag type="success">Your account has been created.</Tag>
        </div>
        <Text
          h2
          style={{ fontWeight: 700, textAlign: "center" }}
          mb="10px"
          mt="10px"
        >
          Verify Email
        </Text>
        <Text
          type="secondary"
          style={{ textAlign: "center" }}
          mb="30px"
          mt="0px"
        >
          Check your email for the code we just sent you and then enter it below
          to verify your email.
        </Text>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Code"
            width="100%"
            type={codeError && "error"}
            {...register("code")}
          />
          <Spacer />
          <Button
            htmlType="submit"
            width="100%"
            loading={isLoading ? true : false}
          >
            Verify
          </Button>
        </form>
        <Text
          onClick={resendEmail}
          small
          p
          type="secondary"
          style={{
            cursor: "pointer",
            width: 100,
            margin: "auto",
            marginTop: 10,
            textAlign: "center",
          }}
        >
          Resend email
        </Text>
      </div>
    </div>
  );
};

Verify.getInitialProps = ({ query }) => {
  return { query };
};

export default Verify;
