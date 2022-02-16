import { Text, Button, Input, useToasts, Grid, Fieldset } from "@geist-ui/core";
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
    <Fieldset>
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
      <Fieldset.Footer>
        <Grid.Container alignItems="center" justify="space-between">
          <Grid>
            <Text type="secondary" mr="10px" small>
              Update your name.
            </Text>
          </Grid>
          <Grid>
            <Button
              onClick={handleSubmit}
              auto
              type={isLoading ? "default" : "secondary"}
              scale={0.6}
              loading={isLoading ? true : false}
              disabled={
                user.firstName === first && user.lastName === last
                  ? true
                  : false
              }
            >
              Save
            </Button>
          </Grid>
        </Grid.Container>
      </Fieldset.Footer>
    </Fieldset>
  );
};

export default Name;
