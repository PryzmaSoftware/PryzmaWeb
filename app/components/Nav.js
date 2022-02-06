import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import { ArrowRight, CaretDownFill, Person } from "react-bootstrap-icons";
import DropDownNavMenu from "./DropDownNavMenu";
import Search from "./AdminHome/Search";
import logo from "../public/images/logo.png";
import Image from "next/image";
import useScrollPosition from "@react-hook/window-scroll";

const Nav = () => {
  const router = useRouter();
  const scrollY = useScrollPosition(60);

  const [name, setName] = useState();
  const [dropDownActive, setDropDownActive] = useState(false);
  const [userData, setUserData] = useState();

  const button = useRef();

  useEffect(() => {
    const getUser = async () => {
      if (!router.pathname.startsWith("/admin")) return;
      const response = await axios
        .get("/api/user")
        .catch((e) => console.error(e));
      if (response.data) setName(response.data.user.firstName);
      const { firstName, lastName, email } = response.data.user;
      setUserData({ firstName, lastName, email });
    };
    getUser();
  }, [router.pathname, router.query]);

  return (
    <div
      className={`px-4 transition-all duration-300 sticky top-0 z-[9999] border ${
        scrollY > 0 && !router.pathname.startsWith("/admin")
          ? "border-neutral-800 backdrop-blur bg-black/50"
          : "border-transparent bg-black"
      }`}
    >
      <div
        className={`w-full ${
          router.pathname.endsWith("/login") ||
          router.pathname.endsWith("/signup")
            ? "z-[9999]"
            : ""
        } ${
          router.pathname.startsWith("/admin")
            ? "sticky mx-auto max-w-7xl top-0 z-10"
            : ""
        }`}
      >
        <div
          className={`w-full flex justify-between items-center mx-auto relative ${
            router.pathname.startsWith("/admin")
              ? "py-2"
              : "pb-6 pt-6 max-w-7xl"
          }`}
        >
          {!router.pathname.startsWith("/admin") && (
            <Link href={router.pathname.startsWith("/admin") ? "/admin" : "/"}>
              <a className="flex items-center justify-center">
                <Image src={logo} layout="fixed" height={32} width={110} />
              </a>
            </Link>
          )}
          {router.pathname.startsWith("/admin") && <Search />}
          {router.pathname.startsWith("/admin") ? (
            <div className="flex">
              {name && (
                <p
                  ref={button}
                  onClick={() =>
                    dropDownActive
                      ? setDropDownActive(false)
                      : setDropDownActive(true)
                  }
                  className={`text-xs flex text-zinc-400 font-medium hover:border-violet-500 items-center cursor-pointer rounded-md p-1.5 border border-zinc-800 pl-4 pr-4 hover:bg-zinc-800 transition-all duration-200 ${
                    dropDownActive && "bg-zinc-800"
                  }`}
                >
                  <Person className="mr-1 text-lg pointer-events-none" />
                  {name}
                  <CaretDownFill
                    className={`pointer-events-none ml-2 text-xs relative top-[1px] text-zinc-400 transition-all duration-300 ${
                      dropDownActive ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </p>
              )}
              {dropDownActive && (
                <DropDownNavMenu
                  userData={userData}
                  active={dropDownActive}
                  setDropDownActive={setDropDownActive}
                  button={button}
                />
              )}
            </div>
          ) : (
            <div className="flex items-center">
              <Link href="/contact">
                <a className="mr-6 text-sm text-neutral-500 font-medium hover:text-white transition-all">
                  Contact
                </a>
              </Link>
              <Link href="/login">
                <a className="mr-6 text-sm text-neutral-500 font-medium hover:text-white transition-all">
                  Login
                </a>
              </Link>
              <Link href="/signup">
                <a className="rounded-md py-1.5 font-medium text-sm px-5 bg-white flex items-center border border-white hover:bg-transparent hover:text-white transition-all duration-300">
                  Sign Up
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Nav;
