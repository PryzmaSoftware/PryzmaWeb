import {
  Card,
  Text,
  Note,
  Grid,
  Button,
  Modal,
  useModal,
  Spacer,
  Dot,
  Fieldset,
} from "@geist-ui/core";
import ElementsProvider from "./ElementsProvider";
import { CreditCard } from "@geist-ui/icons";

const PaymentMethod = ({ user }) => {
  const { setVisible, bindings } = useModal();

  return (
    <>
      <Fieldset>
        <Text h3>Your Payment Method</Text>
        {!user.paymentMethod && (
          <Note type="warning" mb="20px" width="90%">
            You don't have a payment method on file. Add a payment method below
            to continue using our services before your trial is over.
          </Note>
        )}
        {user.paymentMethod && (
          <Card mb="20px" width="90%">
            <Grid.Container alignItems="center">
              <Dot type={user.failedPaymentInvoice ? "error" : "success"} />
              <Spacer w={0.5} />
              <Grid style={{ position: "relative", top: 3 }}>
                <CreditCard size={18} />
              </Grid>
              <Spacer w={0.5} />
              <Grid>
                <Text
                  small
                  type="secondary"
                  style={{ textTransform: "uppercase" }}
                >
                  {user.cardDetails.brand}
                </Text>
              </Grid>
              <Spacer w={1.5} />
              <Grid>
                <Text small type="secondary">
                  ****{user.cardDetails.last4}
                </Text>
              </Grid>
              <Spacer w={1.5} />
              <Grid>
                <Text small type="secondary">
                  exp {user.cardDetails.expMonth}/{user.cardDetails.expYear}
                </Text>
              </Grid>
            </Grid.Container>
          </Card>
        )}

        <Fieldset.Footer>
          <Grid.Container justify="space-between" alignItems="center">
            <Grid>
              <Text type="secondary" mr="10px" small>
                Update payment method.
              </Text>
            </Grid>
            <Grid>
              <Button
                scale={0.6}
                auto
                disabled={
                  (user.cancelAtPeriodEnd && user.status === "active") ||
                  user.failedPaymentInvoice
                    ? true
                    : false
                }
                onClick={() => setVisible(true)}
              >
                Update
              </Button>
            </Grid>
          </Grid.Container>
        </Fieldset.Footer>
      </Fieldset>
      <Modal {...bindings}>
        <Modal.Title>Update Payment Method</Modal.Title>
        <Modal.Content>
          <ElementsProvider user={user} setVisible={setVisible} />
        </Modal.Content>
      </Modal>
      <Spacer h={1.5} />
    </>
  );
};

export default PaymentMethod;
