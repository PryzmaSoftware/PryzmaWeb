import { useContext, useEffect, useState } from "react";
import SymbolContext from "../../components/SymbolContext";
import { withIronSession } from "next-iron-session";
import clientPromise from "../../lib/mongodb";
import UserContext from "../../components/UserContext";
import CompanyProfile from "../../components/Overview/CompanyProfile";
import Quote from "../../components/Overview/Quote";
import Stats from "../../components/Overview/Stats";
import Financials from "../../components/Overview/Financials";
import News from "../../components/Overview/News";
import Head from "next/head";

const Overview = ({ user }) => {
  const { symbol } = useContext(SymbolContext);
  const { setUser } = useContext(UserContext);

  const [companyProfile, setCompanyProfile] = useState();
  const [quote, setQuote] = useState();
  const [stats, setStats] = useState();
  const [financials, setFinancials] = useState();
  const [news, setNews] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(user);
  }, []);

  useEffect(() => {
    if (!quote || !companyProfile || !stats || financials || !news)
      setIsLoading(true);
    if (quote && companyProfile && stats && financials && news)
      setIsLoading(false);
  }, [quote, companyProfile, stats, symbol, financials, news]);

  if (!symbol)
    return (
      <div className="p-4">
        <Head>
          <title>Pryzma - Overview</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="description" content="Stock Overview" />
          <meta
            name="keywords"
            content="pryzma, overview, news, stats, financials, quote, profile"
          />
        </Head>
        <div className="max-w-7xl mx-auto">
          <div className="p-4 mx-auto rounded-md w-fit bg-black mt-16 animate-fadeIn opacity-0">
            <p className="text-white text-sm font-light">
              Search for a stock above to view info
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="p-4">
      <Head>
        <title>Pryzma - Overview - {symbol[0]}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Stock Overview" />
        <meta
          name="keywords"
          content="pryzma, overview, news, stats, financials, quote, profile"
        />
      </Head>
      <div className="max-w-7xl mx-auto">
        <div className="flex">
          <CompanyProfile
            setCompanyProfile={setCompanyProfile}
            isLoading={isLoading}
          />
          <Quote isLoading={isLoading} setQuote={setQuote} />
        </div>
        <Stats isLoading={isLoading} setStats={setStats} />
        <Financials isLoading={isLoading} setFinancials={setFinancials} />
        <News isLoading={isLoading} setNews={setNews} />
      </div>
    </div>
  );
};

export const getServerSideProps = withIronSession(
  async ({ req, res }) => {
    let user = req.session.get("user");

    // IF NO USER IN SESSION, REDIRECT TO LOGIN PAGE
    if (!user) {
      return {
        redirect: {
          permanant: false,
          destination: "/login",
        },
        props: {},
      };
    }

    // if user in sessoin, fetch from mongodb
    if (user) {
      // connect to mongodb
      const client = await clientPromise;
      const db = client.db();
      const collection = db.collection("users");

      // find user in db
      user = await collection.findOne({
        stripeCustomerId: user.user.stripeCustomerId,
      });

      // set session
      req.session.set("user", {
        id: user._id,
        user: user,
      });
      await req.session.save();
    }

    // retrieve updated session
    user = req.session.get("user");

    // if user subscription is canceled, redirect to manage acccount page to update payment method
    if (
      user.user.isCanceled ||
      user.user.paymentStatus === "failed" ||
      user.user.subscriptionType === null ||
      !user.user.defaultPaymentMethod
    ) {
      return {
        redirect: {
          permanant: false,
          destination: "/admin/manage-account",
        },
        props: {},
      };
    }

    // parse user to pass as props
    user = JSON.parse(JSON.stringify(user));

    // return user as props
    return { props: user };
  },
  {
    password: process.env.IRON_SESSION_PASSWORD,
    cookieName: "user",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);

export default Overview;
