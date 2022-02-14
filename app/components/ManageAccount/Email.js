import {
  Input,
  Text,
  Button,
  Card,
  Spacer,
  useToasts,
  Modal,
  Grid
} from "@geist-ui/core";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

const Email = ({ user }) => {
  const [email, setEmail] = useState(user.email);
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState(null);
  const [modal, setModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const router = useRouter();

  const { setToast } = useToasts();

  const handleSubmit = async () => {
    if (!email)
      return setToast({ text: "Please enter a valid email", type: "error" });

    setIsLoading(true);
    // send email and customer id to backend to
    // send verification code to new email
    const response = await axios.post("/api/manage/verify-email-change", {
      email,
      stripeCustomerId: user.stripeCustomerId,
    });
    // check response
    if (response.status === 200) {
      if (response.data === "email already in use") {
        setIsLoading(false);
        return setToast({ text: "Email is already in use.", type: "error" });
      }
      setIsLoading(false);
      setModal(true);
    } else {
      setIsLoading(false);
      setToast({
        text: "Something went wrong, please try again.",
        type: "error",
      });
    }
  };

  const handleVerifyEmail = async () => {
    if (!code) return;
    setIsVerifying(true);
    // send code and test it to mongodb
    const response = await axios.post("/api/manage/verify-code", {
      code,
      email,
      stripeCustomerId: user.stripeCustomerId,
    });

    if (response.status === 200) {
      if (response.data === "invalid code") {
        setIsVerifying(false);
        return setToast({ text: "Invalid code", type: "error" });
      }
      if (response.data === "email updated") {
        setIsVerifying(false);
        setModal(false);
        setToast({ text: "Email updated successfully", type: "success" });
        router.replace(router.asPath);
      }
    } else {
      setIsVerifying(false);
      setModal(false);
      setToast({
        text: "Something went wrong, please try again.",
        type: "error",
      });
    }
  };

  return (
    <>
      <Spacer h={1.5} />
      <Card>
        <Text h3>Your Email</Text>
        <Input
          label="Email"
          mb="20px"
          width="75%"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ minWidth: 220 }}
        />
        <Card.Footer disableAutoMargin pt="5px" pb="5px">
        <Grid.Container justify="space-between" alignItems="center">
          <Grid><Text type="secondary" mr="10px">
            After clicking save, we will send you an email to verify the change.
          </Text></Grid>
          <Grid>
          <Button
            auto
            scale={0.8}
            type={isLoading ? "default" : "secondary"}
            disabled={user.email === email ? true : false}
            onClick={handleSubmit}
            loading={isLoading ? true : false}
          >
            Save
          </Button></Grid>
        </Grid.Container>
        </Card.Footer>
      </Card>
      <Modal visible={modal} onClose={() => setModal(false)}>
        <Modal.Title>Verify Email</Modal.Title>
        <Modal.Content>
          <Text p type="secondary" style={{ textAlign: "center" }} mb="20px">
            Check your email for the code we just sent you and then enter it
            below to verify your email.
          </Text>
          <Input
            label="Code"
            width="100%"
            onChange={(e) => setCode(e.target.value)}
          />
        </Modal.Content>
        <Modal.Action passive onClick={() => setModal(false)}>
          Cancel
        </Modal.Action>
        <Modal.Action
          onClick={handleVerifyEmail}
          loading={isVerifying ? true : false}
        >
          Confirm
        </Modal.Action>
      </Modal>
      <Spacer h={1.5}/>
    </>
  );
};

export default Email;
