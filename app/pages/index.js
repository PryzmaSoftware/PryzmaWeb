import { Text, Button } from "@geist-ui/core";

const Home = () => {
  return (
    <div style={{ padding: "10px 16px" }}>
      <div style={{ maxWidth: 1000, margin: "auto" }}>
        <div style={{ marginTop: 30 }}>
          <Text
            h1
            margin={0}
            style={{ textAlign: "center" }}
            mb="-50px"
            className="h1"
          >
            Quantative
          </Text>
          <Text
            h1
            mb="-50px"
            margin={0}
            style={{
              textAlign: "center",
            }}
            className="h1"
          >
            Alternative
          </Text>
          <Text h1 margin={0} style={{ textAlign: "center" }} className="h1">
            Signals
          </Text>
        </div>
        <div className="button-container">
          <Button
            type="secondary"
            style={{ marginRight: 20, fontWeight: 500 }}
            scale={1.4}
          >
            Start Free Trial
          </Button>
          <Button scale={1.4} style={{ fontWeight: 500 }}>
            View Features
          </Button>
        </div>
        <Text
          type="secondary"
          style={{
            textAlign: "center",
            maxWidth: 700,
            margin: "auto",
            marginTop: 50,
          }}
          font="1.25rem"
        >
          Pryzma takes the stock research process and makes it more effecient
          and easier than ever by disecting and displaying only the most
          important information.
        </Text>
      </div>
      <style>{`
        .h1 {
          font-size: 130px;
          font-weight: 800;
          letter-spacing: 0.1;
        }
        .button-container {
          display: flex;
          justify-content: center;
          margin-top: 30px;
        }
      `}</style>
    </div>
  );
};

export default Home;
