import {
  Tabs,
  Link,
  Button,
  Text,
  Toggle,
  AutoComplete,
  Popover,
  Avatar,
  Tooltip,
  Divider,
} from "@geist-ui/core";
import logo from "../public/images/logo.png";
import Image from "next/image";
import { useRouter } from "next/router";
import NextLink from "next/link";
import logoLight from "../public/images/logo-light.png";
import { LogOut } from "@geist-ui/icons";
import axios from "axios";

const Nav = ({ themeType, setThemeType }) => {
  const router = useRouter();

  const url = "/images/pink-orange.png";

  const logout = async () => {
    const response = await axios.get("/api/logout");
    if (response.status === 200) return router.push("/login");
  };

  const content = () => (
    <>
      <Popover.Item title>
        <span>My Account</span>
      </Popover.Item>
      <Popover.Item>
        <NextLink href="/admin/manage-account" passHref>
          <Link>Manage Account</Link>
        </NextLink>
      </Popover.Item>
      <Popover.Item line />
      <Popover.Item>
        <span
          style={{
            color: "red",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
          onClick={logout}
        >
          <span style={{ marginRight: 5 }}>Log Out</span>
          <LogOut size={16} />
        </span>
      </Popover.Item>
    </>
  );

  return (
    <>
      <div
        style={{
          padding: "10px 16px",
          display: "flex",
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            width: "100%",
            margin: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <NextLink href={router.pathname.startsWith('/admin') ? '/admin' : '/'} passHref>
            <Link>
              <Image
                src={themeType === "dark" ? logo : logoLight}
                layout="fixed"
                height={32}
                width={110}
              />
            </Link>
          </NextLink>
          {router.pathname.startsWith("/admin") ? (
            <>
              <AutoComplete
                placeholder="Search Ticker..."
                width="80%"
                ml="15px"
              />
              <div style={{ display: "flex", alignItems: "center" }}>
                <Popover
                  content={content}
                  style={{ cursor: "pointer" }}
                  enterDelay={0}
                >
                  <Avatar src={url} />
                </Popover>
                <Toggle
                  type="secondary"
                  initialChecked
                  ml="15px"
                  padding={0}
                  onChange={() =>
                    themeType === "dark"
                      ? setThemeType("light")
                      : setThemeType("dark")
                  }
                />
              </div>
            </>
          ) : (
            <>
              {" "}
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
                  type="secondary"
                  scale={0.7}
                  onClick={() => router.push("/signup")}
                >
                  <Text font="14px" style={{ fontWeight: 500 }}>
                    Sign Up
                  </Text>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
      <Divider />
    </>
  );
};

export default Nav;
