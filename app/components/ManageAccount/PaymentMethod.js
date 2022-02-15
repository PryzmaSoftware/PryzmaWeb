import { Card, Text, Note, Grid, Button, Modal, useModal } from "@geist-ui/core";
import ElementsProvider from './ElementsProvider';

const PaymentMethod = ({ user }) => {

  const {setVisible, bindings} = useModal();

  return (
    <>
    <Card>
      <Text h3>Payment Method</Text>
      {!user.PaymentMethod && <Note type="error" mb="20px">You don't have a payment method on file. Add a payment method below to continue using our services before your trial is over.</Note>}
      <Card.Footer disableAutoMargin pt="5px" pb="5px">
      <Grid.Container justify="space-between" alignItems="center">
          <Grid><Text type="secondary" mr="10px">
            Add a payment method for future billing.
          </Text></Grid>
          <Grid>
            <Button auto onClick={() => setVisible(true)}>Add Payment Method</Button>
          </Grid>
          </Grid.Container>
      </Card.Footer>
    </Card>
    <Modal {...bindings}>
    <Modal.Title>Add Payment Method</Modal.Title>
      <Modal.Content><ElementsProvider user={user} /></Modal.Content>
    </Modal>
    </>
  );
};

export default PaymentMethod;
