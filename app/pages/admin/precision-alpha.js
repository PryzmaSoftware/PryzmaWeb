import { withIronSession } from "next-iron-session";
import clientPromise from "../../lib/mongodb";
import axios from "axios";
import SymbolContext from "../../components/SymbolContext";
import UserContext from "../../components/UserContext";
import { useState, useEffect, useContext } from "react";
import Head from 'next/head'
import Probability from "../../components/PrecisionAlpha/Probability";
import MarketPower from "../../components/PrecisionAlpha/MarketPower";
import MarketResistance from "../../components/PrecisionAlpha/MarketResistance";
import MarketNoise from "../../components/PrecisionAlpha/MarketNoise";
import MarketEmotion from "../../components/PrecisionAlpha/MarketEmotion";
import EnergyTemp from "../../components/PrecisionAlpha/EnergyTemp";

const PrecisionAlpha = ({ user }) => {
  const { setUser } = useContext(UserContext);
  const { symbol } = useContext(SymbolContext);

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    setUser(user);
  }, []);

  useEffect(() => {
    if (!symbol) return;
    setData(null);
    setIsLoading(true);
    const getData = async () => {
      const response = await axios
        .post("/api/precision-alpha", {
          symbol: symbol[0],
        })
        .catch(() => setData("data not available"));

      // check for response
      if (response) {
        if (response.data.message === "success") {
          setIsLoading(false);
          return setData(response.data.data);
        } else {
          setIsLoading(false);
          return setData("data not available");
        }
      }
    };
    getData();
  }, [symbol]);

  console.log(data)

  if (!symbol)
    return (
      <div className="p-4">
        <Head>
          <title>Pryzma - Precision Alpha</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="description" content="Stock Overview" />
          <meta
            name="keywords"
            content="pryzma, precision alpha, ai, artificial intelligence, trade signals"
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

  if (isLoading || !data) return <div>Pecision is loading</div>

  if (data === 'data not available') return <div>Data not available</div>

  return (
    <div className="p-4">
      <div className="mx-auto max-w-7xl w-full mb-12">
      <div className="w-full flex">
      <Probability data={data}/>
      <EnergyTemp data={data} />
      </div>
    <div className="w-full flex mt-6">
    <MarketPower data={data} />
      
      <MarketNoise data={data} />
    </div>
    <div className="w-full flex mt-6">
      <MarketEmotion data={data} />
      <MarketResistance data={data} />
    </div>
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

export default PrecisionAlpha;
