import styles from "../styles/Home/Home.module.css";
import { Text, Grid, Button, Page } from "@geist-ui/react";

const Home = () => {
  return (
    <Page style={{ maxWidth: 1000, margin: "auto" }}>
      <Page.Content>
        <p className={styles.text}>Page Content</p>
      </Page.Content>
    </Page>
  );
};

export default Home;
