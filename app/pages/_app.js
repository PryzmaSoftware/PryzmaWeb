import "../styles/globals.css";
import Nav from "../components/Nav";
import NestedNav from "../components/AdminHome/NestedNav";
import { useRouter } from "next/router";
import NextNProgress from "nextjs-progressbar";
import SymbolContext from "../components/SymbolContext";
import UserContext from "../components/UserContext";
import { useState } from "react";
import SymbolNav from "../components/AdminHome/SymbolNav";
import Script from "next/script";

function MyApp({ Component, pageProps }) {
  const [symbol, setSymbol] = useState(null);
  const [user, setUser] = useState(null);

  const router = useRouter();

  if (router.pathname.startsWith("/admin")) {
    return (
      <>
        <Script
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=G-TN02PJMMFZ`}
          id="googleScriptOne"
        />
        <Script strategy="lazyOnload" id="googleScriptTwo">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-TN02PJMMFZ');`}
        </Script>
        <NextNProgress
          color="#c026d3"
          startPosition={0.7}
          stopDelayMs={50}
          height={2}
        />
        <UserContext.Provider value={{ user, setUser }}>
          <SymbolContext.Provider value={{ symbol, setSymbol }}>
            <div className="font-inter">
              <div className="flex">
                <NestedNav />
                <div className="w-full bg-neutral-900">
                  <Nav />
                  {router.pathname.endsWith("/admin") ||
                  router.pathname.endsWith("/manage-account") ||
                  router.pathname.endsWith("/movers") ? (
                    ""
                  ) : (
                    <SymbolNav />
                  )}
                  <Component {...pageProps} />
                </div>
              </div>
            </div>
          </SymbolContext.Provider>
        </UserContext.Provider>
      </>
    );
  }

  return (
    <>
      <Script
        id="googleScriptThree"
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=G-TN02PJMMFZ`}
      />
      <Script strategy="lazyOnload" id="googleScriptFour">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-TN02PJMMFZ');`}
      </Script>
      <div className="font-inter bg-black">
        <Nav />
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;
