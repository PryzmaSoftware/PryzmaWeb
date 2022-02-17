import { withIronSessionSsr } from "iron-session/next";
import clientPromise from "../../lib/mongodb";
import { Text, Card, Button, Divider, Grid, Toggle, Modal, useModal } from "@geist-ui/core";
import { Check, ArrowRight } from "@geist-ui/icons";
import { useState } from "react";

const SelectPlan = ({ customerId }) => {

  const [plan, setPlan] = useState('monthly');

  const {setVisible, bindings} = useModal()

  return (
    <div style={{ padding: 16 }}>
      <div style={{ maxWidth: 1000, margin: "auto" }}>
        <Text h2 style={{ fontWeight: 700 }}>
          Select a Subscription
        </Text>
        <Card>
          <Card.Content>
            <Text h5 margin={0} type="secondary" style={{ letterSpacing: 2 }}>
              PRYZMA SUBSCRIPTION
            </Text>
          </Card.Content>
          <Divider margin={0} />
          <Card.Content>
            <Grid.Container justify="space-between">
              <Grid>
                <Text h3>Everything you need</Text>
                <Text type="secondary" style={{ fontWeight: 500 }}>
                  Included Package:
                </Text>
                <Grid.Container>
                  <Grid alignItems="center">
                    <Check color="#0070F3" size="16" />
                  </Grid>
                  <Grid>
                    <Text
                      margin={0}
                      ml="10px"
                      style={{
                        position: "relative",
                        bottom: 4,
                        fontWeight: 500,
                      }}
                      small
                    >
                      AI Stock Signals and Gauges
                    </Text>
                  </Grid>
                </Grid.Container>
              </Grid>
              <Grid>
                <Grid.Container justify="center" direction="column">
                  <Text h3 margin={0} style={{ textAlign: "center" }}>
                    {plan === 'monthly' ? '$79.99/mo' : '$799.99/yr'}
                  </Text>
                  <Text
                    small
                    style={{ textAlign: "center" }}
                    type="secondary"
                    mt="-2px"
                  >
                    {plan === 'monthly' ? 'Billed Monthly' : 'Billed Annually'}
                  </Text>
                </Grid.Container>
                <Grid.Container alignItems="center" justify="center" mt="20px" mb="30px">
                  <Grid mr="5px" mb="-9px">Monthly</Grid>
                  <Grid>
                    <Toggle scale={1.7} onChange={() => plan === 'monthly' ? setPlan('annually') : setPlan('monthly')}/>
                  </Grid>
                  <Grid ml="5px" mb="-9px">Annual</Grid>
                </Grid.Container>
                <Button type="secondary" scale={1.2} onClick={() => setVisible(true)}>Select Plan</Button>
              </Grid>
            </Grid.Container>
          </Card.Content>
        </Card>
      </div>
      <Modal {...bindings}></Modal>
    </div>
  );
};

export const getServerSideProps = withIronSessionSsr(
  async ({ req }) => {
    // get user from session
    const user = req.session.user;

    // if no user redirect to login
    if (!user) {
      return {
        redirect: {
          permanant: false,
          destination: "/login",
        },
      };
    }

    // if user connect to mongodb
    // and pull the user from there
    // to get the most up to date info
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("users");

    // get user from db
    let updatedUser = await collection.findOne({
      stripeCustomerId: user.user,
    });

    updatedUser = JSON.parse(JSON.stringify(updatedUser));

    return {
      props: { customerId: updatedUser.stripeCustomerId },
    };
  },
  {
    cookieName: "user",
    password: process.env.IRON_SESSION_PASSWORD,
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);

export default SelectPlan;
