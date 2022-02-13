import { Tabs, Link, Button, Text } from "@geist-ui/core";
import logo from "../public/images/logo.png";
import Image from "next/image";
import { useRouter } from "next/router";
import NextLink from "next/link";

const Nav = () => {
  const router = useRouter();

  return (
    <div style={{ padding: "10px 16px" }}>
      <div
        style={{
          maxWidth: 1000,
          margin: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <NextLink href="/" passHref>
          <Link>
            <Image src={logo} layout="fixed" height={32} width={110} />
          </Link>
        </NextLink>
        <Tabs
          value={router.pathname}
          onChange={(route) => router.push(route)}
          hideBorder
          hideDivider
          align="center"
          leftSpace="5px"
          hoverWidthRatio={1}
          style={{
            marginBottom: -15,
            position: "absolute",
            left: "50%",
            transform: "translate(-50%)",
          }}
        >
          <Tabs.Item label="Contact" value="/contact" />
          <Tabs.Item label="Pricing" value="/pricing" />
          <Tabs.Item label="Features" value="/features" />
        </Tabs>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Tabs
            value={router.pathname}
            onChange={(route) => router.push(route)}
            hideBorder
            hideDivider
            align="center"
            hoverWidthRatio={0}
            style={{ marginBottom: -15, marginRight: 15 }}
          >
            <Tabs.Item label="Login" value="/login"></Tabs.Item>
          </Tabs>
          <Button
            auto
            margin={0}
            type="secondary"
            scale={0.7}
            onClick={() => router.push("/signup")}
          >
            <Text font="14px" style={{ fontWeight: 600 }}>
              Sign Up
            </Text>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Nav;
