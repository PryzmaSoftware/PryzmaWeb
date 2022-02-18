import clientPromise from "../../lib/mongodb";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const handler = async (req, res) => {
  // get event from stripe
  const event = req.body;

  // connect to mongodb
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection("users");

  // handle event
  if (event.type === "payment_method.attached") {
    // get details from event
    const customerId = event.data.object.customer;
    const paymentMethod = event.data.object.id;
    const cardDetails = {
      last4: event.data.object.card.last4,
      brand: event.data.object.card.brand,
      expMonth: event.data.object.card.exp_month,
      expYear: event.data.object.card.exp_year,
    };

    // get user from mongodb to get subId
    const user = await collection.findOne({ stripeCustomerId: customerId });

    // update customer subscription
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethod,
      },
    });

    // update subscription to not cancel at period end
    // this is to update when the customer is trialing
    if (user.subscriptionId) {
      await stripe.subscriptions.update(user.subscriptionId, {
        cancel_at_period_end: false,
      });
    }

    // creat document object to update in mongodb
    const updateUser = {
      $set: {
        cancelAtPeriodEnd: false,
        status: "active",
        paymentMethod: paymentMethod,
        cardDetails: cardDetails,
      },
    };

    // update in mongodb
    await collection.updateOne({ stripeCustomerId: customerId }, updateUser);
  } else if (event.type === "invoice.upcoming") {
    // get information from event
    const customerId = event.data.object.customer;
    const invoice = event.data.object;

    // set up object for mongodb
    const updateInvoice = {
      $set: {
        upcomingInvoices: invoice,
      },
    };

    // update in mongodb
    await collection.updateOne({ stripeCustomerId: customerId }, updateInvoice);
  } else if (event.type === "invoice.payment_succeeded") {
    // get info from event
    const customerId = event.data.object.customer;
    const subscriptionId = event.data.object.subscription;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const nextInvoice = subscription.current_period_end;

    // get all invoices to update recent invoices in mongodb
    const invoices = await stripe.invoices.list({
      subscription: subscriptionId,
      limit: 100,
    });

    // get user from db
    const user = await collection.findOne({ stripeCustomerId: customerId });

    // create object for mongodb
    // to update user status
    const userStatus = {
      $set: {
        status: user.isVerified ? "trialing" : "active",
        nextInvoice: nextInvoice,
        recentInvoices: invoices.data,
        upcomingInvoices: null,
        failedPaymentInvoice: null,
      },
    };

    // update in mongodb
    await collection.updateOne({ stripeCustomerId: customerId }, userStatus);
  } else if (event.type === "invoice.payment_failed") {
    // get info from event
    const customerId = event.data.object.customer;
    const subscriptionId = event.data.object.subscription;
    const invoiceLink = event.data.object.hosted_invoice_url;

    // get all invoices to update recent invoices in mongodb
    const invoices = await stripe.invoices.list({
      subscription: subscriptionId,
      limit: 100,
    });

    // create object for mongodb
    // to update user status
    const userStatus = {
      $set: {
        status: "active",
        nextInvoice: null,
        recentInvoices: invoices.data,
        upcomingInvoices: null,
        failedPaymentInvoice: invoiceLink,
      },
    };
    // update in mongodb
    await collection.updateOne({ stripeCustomerId: customerId }, userStatus);
  } else if (event.type === "customer.subscription.deleted") {
    const customerId = event.data.object.customer;

    // update customer subscription to no payment method
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: null,
      },
    });

    // create document object to update customer
    // in mongodb
    const updateUser = {
      $set: {
        subscriptionId: null,
        plan: null,
        status: "inactive",
        paymentMethod: null,
        cancelAtPeriodEnd: false,
        cardDetails: null,
        recentInvoices: null,
        upcomingInvoices: null,
        nextInvoice: null,
        magicLink: null,
        failedPaymentInvoice: null,
      },
    };

    // update in mongodb
    await collection.updateOne({ stripeCustomerId: customerId }, updateUser);
  }

  return res.status(200).send({ received: true });
};

export default handler;
