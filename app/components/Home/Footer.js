import { Twitter } from "react-bootstrap-icons";
import Link from "next/link";
import { useRouter } from "next/router";

const Footer = () => {
  const router = useRouter();

  return (
    <div className="px-4 border-t border-neutral-800 bg-neutral-900">
      <div className="max-w-7xl mx-auto flex flex-col items-center sm:items-baseline sm:flex-row justify-between pt-8 pb-8 w-full">
        <Link href="/">
          <a className="font-medium text-xl text-white transition-all mb-4">
            Pryzma
          </a>
        </Link>
        <div className="order-last sm:-order-none mt-2">
          <div className="flex justify-center">
            <Link href="/terms-of-service">
              <a
                className={`text-xs font-medium text-center mr-4 transition-all ${
                  router.pathname.endsWith("/terms-of-service")
                    ? "text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Terms of Service
              </a>
            </Link>
            <Link href="/privacy-policy">
              <a
                className={`text-xs font-medium text-center transition-all ${
                  router.pathname.endsWith("/privacy-policy")
                    ? "text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Privacy Policy
              </a>
            </Link>
          </div>
          <p className="mt-6 text-xs text-neutral-500 text-center">
            &copy; Copyright 2022 Pryzma. All Rights Reservered.
          </p>
        </div>
        <a
          href="https://twitter.com/pryzma_io"
          target="_blank"
          rel="noreferrer"
        >
          <Twitter className="text-neutral-400 hover:text-white transition-all mt-1 mb-4" />
        </a>
      </div>
    </div>
  );
};

export default Footer;
