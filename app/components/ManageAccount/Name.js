import { Card, Text, Button, Input, useToasts } from "@geist-ui/core";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const Name = ({ user }) => {
  const [first, setFirst] = useState(user.firstName);
  const [last, setLast] = useState(user.lastName);

  const [isLoading, setIsLoading] = useState(false);

  const { setToast } = useToasts();

  const router = useRouter();

  const handleSubmit = async () => {
    setIsLoading(true);
    const response = await axios.post("/api/manage/name", {
      stripeCustomerId: user.stripeCustomerId,
      first,
      last,
    });

    // check for response status
    if (response.status === 200) {
      router.replace(router.asPath);
      setIsLoading(false);
      setToast({ text: "Your name has been updated", type: "success" });
    } else {
      setIsLoading(false);
      setToast({
        text: "Something went wrong, please try again.",
        type: "error",
      });
    }
  };

  return (
    <Card>
      <Text h3>Your Name</Text>
      <Input
        label="First Name"
        value={first}
        mr="20px"
        mb="20px"
        onChange={(e) => setFirst(e.target.value)}
      />
      <Input
        label="Last Name"
        value={last}
        onChange={(e) => setLast(e.target.value)}
      />
      <Card.Footer style={{ display: "flex", justifyContent: "space-between" }}>
        <Text type="secondary" mr="10px">
          Make sure your name is up to date with your billing information.
        </Text>
        <Button
          onClick={handleSubmit}
          auto
          type={isLoading ? "default" : "secondary"}
          scale={0.8}
          loading={isLoading ? true : false}
          margin={0}
          disabled={
            user.firstName === first && user.lastName === last ? true : false
          }
        >
          Save
        </Button>
      </Card.Footer>
    </Card>
  );
};

export default Name;
