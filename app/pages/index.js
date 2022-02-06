import Link from "next/link";
import Footer from "../components/Home/Footer";
import { withIronSession } from "next-iron-session";
import Head from "next/head";
import Steps from "../components/Home/Steps";
import Features from "../components/Home/Features";
import Exchanges from "../components/Home/Exhanges";
import { Link as SmoothScrollLink } from "react-scroll";

const Home = () => {
  return (
    <div className="bg-black flex flex-col justify-between">
      <Head>
        <title>Pryzma - Stock Research Simplified</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Pryzma is a stock research platform for anyone looking to get information for the stock market. You can find things like financials, statistics, the latest news, and much more."
        />
        <meta
          name="keywords"
          content="stocks, research, pryzma, fundamentals, financials, statistics, short interest, float, dilution, news"
        />
      </Head>
      <div className="max-w-7xl mx-auto">
        <div className="mt-8">
          <p className="font-[800] text-zinc-200 text-[150px] text-center opacity-0 animate-fadeIn mb-[-70px] tracking-tighter px-4">
            Discover.
          </p>
          <p className="font-[800] text-zinc-200 text-[150px] text-center opacity-0 animate-fadeIn mb-[-70px] tracking-tighter px-4">
            Research.
          </p>
          <p className="font-[800] text-zinc-200 text-[150px] text-center opacity-0 animate-fadeIn tracking-tighter mb-[-10px] px-4">
            Execute.
          </p>
          <div className="flex justify-center opacity-0 animate-fadeIn px-4">
            <Link href="/signup">
              <a className="animate-fadeIn animate-move mr-6 hover:scale-105 text-center w-[200px] text-white bg-gradient-to-r from-indigo-600 to-rose-600 bg-[length:400%] bg-left hover:bg-right rounded-md py-3 transition-all duration-300">
                Start Free Trial
              </a>
            </Link>
            <SmoothScrollLink
              to="steps"
              smooth={true}
              className="text-neutral-500 cursor-pointer font-medium rounded-md w-[200px] text-center py-3 transition-all duration-300 border border-neutral-700 hover:border-white hover:text-white"
            >
              View Features
            </SmoothScrollLink>
          </div>
          <p className="text-center font-medium text-neutral-500 opacity-0 text-lg animate-fadeIn mt-12 max-w-3xl mx-auto px-4">
            Pryzma takes the stock research process and makes it more effecient
            and easier than ever by disecting and displaying only the most
            important information.
          </p>
        </div>
      </div>
      <Exchanges />
      <Steps />
      <Features />
      <Footer />
    </div>
  );
};

export const getServerSideProps = withIronSession(
  ({ req, res }) => {
    const user = req.session.get("user");

    if (!user) return { props: {} };

    return {
      redirect: {
        permanant: false,
        destination: "/admin",
      },
      props: {},
    };
  },
  {
    password: process.env.IRON_SESSION_PASSWORD,
    cookieName: "user",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);

export default Home;
