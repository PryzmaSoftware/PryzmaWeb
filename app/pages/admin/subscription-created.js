import { useRouter } from "next/router";
import Head from "next/head";

const SubscriptionCreated = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/admin");
  };

  return (
    <div className="mt-24 justify-center flex flex-col items-center opacity-0 animate-fadeIn">
      <Head>
        <title>Pryzma - Subscription Created</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Subscription Created" />
        <meta name="keywords" content="pryzma, subscription" />
      </Head>
      <p className="text-center text-3xl font-semibold text-white mb-2">
        Your subscription has been created!
      </p>
      <p className="text-center text-3xl font-semibold text-white mb-10">
        You can now use all features!
      </p>
      <button
        className="p-3 pl-6 pr-6 text-sm text-white font-medium bg-gradient-to-r from-indigo-600 to-rose-600 bg-[length:200%] bg-left hover:bg-right transition-all w-fit rounded-md duration-500"
        onClick={handleClick}
      >
        Go to Home Page
      </button>
    </div>
  );
};

export default SubscriptionCreated;
