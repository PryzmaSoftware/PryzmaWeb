import { Card, Text, Button, Input, useToasts, Grid, Spacer } from "@geist-ui/core";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const Password = ({ user }) => {

  const [password, setPassword] = useState();
  const [confirm, setConfirm] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const {setToast} = useToasts();

  const router = useRouter()

  const handleSumbmit = async () => {
    setIsLoading(true)
    const response = await axios.post('/api/manage/password', {password, stripeCustomerId: user.stripeCustomerId});

    // check for response status
    if (response.status === 200) {
      setIsLoading(false);
      setToast({text: 'Password updated successfully', type: 'success'})
      setPassword()
      setConfirm()
      router.replace(router.asPath)
    } else {
      setIsLoading(false);
      setToast({text: 'Something went wrong, please try again.', type: 'error'})
    }
  }

  console.log(password, confirm)

  return (
    <>
    <Card>
      <Text h3>Change Password</Text>
      <Input.Password
        width="300px"
        label="Password"
        value={password}
        mr="20px"
        mb="20px"
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input.Password
        width="300px"
        label="Confirm"
        value={confirm}
        mb="20px"
        onChange={(e) => setConfirm(e.target.value)}
      />
      <Card.Footer disableAutoMargin pb="5px" pb="5px">
      <Grid.Container alignItems="center" justify="space-between">
      <Grid>
      <Text type="secondary" mr="10px">
          You can update your password here.
        </Text>
      </Grid>
      <Grid>
        <Button
        onClick={handleSumbmit}
          auto
          scale={0.8}
          loading={isLoading ? true : false}
          type={password !== confirm || !password || password?.length < 8 || isLoading ? 'default' : 'secondary'}
          disabled={password !== confirm || !password || password?.length < 8 ? true : false}
        >
          Save
        </Button>
        </Grid>
      </Grid.Container>
      </Card.Footer>
    </Card>
    <Spacer h={1.5}/>
    </>
  );
};

export default Password;
