import {
  Card,
  Text,
  Button,
  Modal,
  useToasts,
  Grid,
  useModal,
  Spacer,
  Fieldset,
} from "@geist-ui/core";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const Subscription = ({ user }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const { setVisible, bindings } = useModal();
  const { setToast } = useToasts();

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    // send info to backend to update plan
    const response = await axios.post("/api/manage/cancel-subscription", {
      subscriptionId: user.subscriptionId,
    });

    // check response
    if (response.status === 200) {
      setTimeout(() => {
        setIsLoading(false);
        setVisible(false);
        setToast({ text: "Subscription canceled", type: "success" });
        router.replace(router.asPath);
      }, 3000);
    } else {
      setIsLoading(false);
      setToast({
        text: "Something went wrong, please try again.",
        type: "error",
      });
    }
  };

  const handleRenewSubscription = async () => {
    setIsLoading(true);
    // send sub id to backend
    const response = await axios.post("/api/manage/renew-subscription", {
      subscriptionId: user.subscriptionId,
    });

    // check response
    if (response.status === 200) {
      setTimeout(() => {
        setIsLoading(false);
        setVisible(false);
        setToast({ text: "Subscription renewed", type: "success" });
        router.replace(router.asPath);
      }, 3000);
    } else {
      setIsLoading(false);
      setToast({
        text: "Something went wrong, please try again.",
        type: "error",
      });
    }
  };

  return (
    <>
      <Fieldset>
        <Text h3>Your Subscription</Text>
        <Grid.Container mb="20px">
          <Grid mr="20px">
            <Card>
              <Text h5 style={{ textTransform: "capitalize" }}>
                {user.plan
                  ? user.plan === "monthly"
                    ? `Pryzma Monthly`
                    : "Pryzma Annual"
                  : "No Current Plan"}
              </Text>
              <Text small type="secondary" mt="5px">
                {user.plan
                  ? user.plan === "monthly"
                    ? "$79.99 billed monthly"
                    : "$799.99 billed annualy"
                  : "You don't have a subscription at this time, please select a plan by clicking the button below."}
              </Text>
            </Card>
          </Grid>
        </Grid.Container>
        <Fieldset.Footer disableAutoMargin pt="5px" pb="5px">
          <Grid.Container justify="space-between" alignItems="center">
            <Grid>
              <Text type="secondary">Manage Subscription</Text>
            </Grid>
            <Grid>
              {user.status === "active" && user.cancelAtPeriodEnd && (
                <Button auto scale={0.6} onClick={() => setVisible(true)}>
                  Renew Plan
                </Button>
              )}
              {user.status === "active" && !user.cancelAtPeriodEnd && (
                <Button
                  mr="8px"
                  auto
                  type="error"
                  ghost
                  scale={0.6}
                  onClick={() => setVisible(true)}
                >
                  Cancel Plan
                </Button>
              )}
              {user.status === "active" && !user.cancelAtPeriodEnd && (
                <Button auto ghost scale={0.6}>
                  Change Plan
                </Button>
              )}
            </Grid>
          </Grid.Container>
        </Fieldset.Footer>
      </Fieldset>
      <Modal {...bindings}>
        <Modal.Title>
          {user.cancelAtPeriodEnd ? "Renew Plan" : "Cancel Plan"}
        </Modal.Title>
        <Modal.Content>
          <Text type="secondary" style={{ textAlign: "center" }}>
            {user.cancelAtPeriodEnd
              ? "You are about to renew you subscription. If confirmed, we will continue to bill you at the normal rate, and you will keep access to our services."
              : "Are you sure you want to cancel your subscription? You will have access to current services until the next billing period."}
          </Text>
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>
          Cancel
        </Modal.Action>
        <Modal.Action
          loading={isLoading ? true : false}
          onClick={
            user.cancelAtPeriodEnd
              ? handleRenewSubscription
              : handleCancelSubscription
          }
        >
          Confirm
        </Modal.Action>
      </Modal>
      <Spacer h={1.5} />
    </>
  );
};

export default Subscription;
