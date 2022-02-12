import styles from "../styles/Nav.module.css";
import Image from "next/image";
import logo from "../public/images/logo.png";
import Link from "next/link";
import { Text, Grid, Button } from "@geist-ui/react";

const Nav = () => {
  return (
    <div>
      <Grid.Container
        justify="space-between"
        direction="row"
        alignItems="center"
        style={{
          padding: "10px 16px",
          maxWidth: 1200,
          margin: "auto",
        }}
      >
        <Link href="/">
          <a>
            <Image src={logo} layout="fixed" height={32} width={110} />
          </a>
        </Link>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link href="/contact">
            <a className={styles.link}>
              <Text small>Contact</Text>
            </a>
          </Link>
          <Link href="/login">
            <a className={styles.link}>
              <Text small>Login</Text>
            </a>
          </Link>
          <Link href="/login">
            <a>
              <Button auto scale={0.8} type="secondary" ghost>
                <Text b>Sign Up</Text>
              </Button>
            </a>
          </Link>
        </div>
      </Grid.Container>
    </div>
  );
};

export default Nav;
