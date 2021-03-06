import { useRouter } from "next/router";
import Head from "next/head";

const SubscriptionDeleted = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/admin/manage-account");
  };

  return (
    <div className="mt-24 justify-center flex flex-col items-center opacity-0 animate-fadeIn">
      <Head>
        <title>Pryzma - Subscription Canceled</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Subscription Canceled" />
        <meta name="keywords" content="pryzma, subscription" />
      </Head>
      <p className="text-center text-3xl font-semibold text-white mb-2">
        Your subscription has been canceled.
      </p>
      <p className="text-center text-3xl font-semibold text-white mb-10">
        We hope you come back soon!
      </p>
      <button
        className="p-3 pl-6 pr-6 text-sm text-white font-medium from-indigo-600 to-rose-600 bg-[length:200%] bg-left hover:bg-right bg-gradient-to-r transition-all w-fit rounded-md duration-500"
        onClick={handleClick}
      >
        Go to Account Management
      </button>
    </div>
  );
};

export default SubscriptionDeleted;
