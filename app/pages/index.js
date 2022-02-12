import styles from "../styles/Home/Home.module.css";
import { Text } from "@geist-ui/react";

const Home = () => {
  return (
    <div className={styles.container}>
      <Text
        className={styles.mainText}
        style={{ color: "#fff", textAlign: "center" }}
      >
        Not your average stock data.
      </Text>
    </div>
  );
};

export default Home;
