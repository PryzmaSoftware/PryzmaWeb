import { Card, Text, Button, Link } from "@geist-ui/core";
import Users from "@geist-ui/icons/users";

const Contact = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: 70,
        paddingBottom: 50,
      }}
    >
      <Card style={{ maxWidth: 300 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              height: 90,
              width: 90,
              borderRadius: "50%",
              background: "#ff0080",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Users size={50} />
          </div>

          <Text h2 style={{ fontWeight: 700 }} mt="20px" mb="20px">
            Support
          </Text>
        </div>
        <Text style={{ textAlign: "center" }} type="secondary" margin={0}>
          You can contact our support team with any questions or comments you
          may have at{" "}
          <Link
            color
            underline
            href="mailto:support@pryzma.io"
            target="_blank"
            rel="noreferrer"
          >
            support@pryzma.io
          </Link>
        </Text>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 30,
            marginBottom: 10,
          }}
        >
          <Button width="80%" type="secondary" className="button">
            <Link href="mailto:support@rpryzma.io" className="link">
              Contact Now
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Contact;
