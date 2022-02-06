import Image from "next/image";
import profile from "../../public/images/business-and-financial-1.svg";
import quotes from "../../public/images/business-and-financial-2.svg";
import stats from "../../public/images/business-and-financial-3.svg";
import financials from "../../public/images/business-and-financial-4.svg";
import news from "../../public/images/business-and-financial-5.svg";
import movers from "../../public/images/business-and-financial-6.svg";
import ownership from "../../public/images/business-and-financial-7.svg";
import offerings from "../../public/images/business-and-financial-8.svg";

const Features = () => {
  return (
    <div className="p-4 mt-20 mb-20 opacity-0 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        <p className="text-neutral-500 font-semibold uppercase text-sm text-center">
          info that will give you the{" "}
          <span className="text-fuchsia-600">EDGE</span> you need
        </p>
        <p className="font-bold text-white text-4xl text-center mt-2 capitalize">
          Get the most up to date information
        </p>
        <div className="flex mt-12 justify-between mb-10">
          <div className="mr-4 w-full">
            <Image src={profile} layout="fixed" height={50} width={50} />
            <p className="text-xs w-[112px] text-center font-semibold text-black py-1 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 mb-4">
              Company Profile
            </p>
            <p className="text-neutral-500 text-sm">
              Get a detailed overview of a company.
            </p>
          </div>
          <div className="mr-4 w-full">
            <Image src={quotes} layout="fixed" height={50} width={50} />
            <p className="text-xs w-[112px] text-center font-semibold text-black py-1 rounded-full bg-gradient-to-br from-red-500 to-amber-500 mb-4">
              Quotes
            </p>
            <p className="text-neutral-500 text-sm">
              Get the price of a stock along with other price and volume stats.
            </p>
          </div>
          <div className="mr-4 w-full">
            <Image src={stats} layout="fixed" height={50} width={50} />
            <p className="text-xs w-[112px] text-center font-semibold text-black py-1 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500 mb-4">
              Statistics
            </p>
            <p className="text-neutral-500 text-sm">
              Find things like market cap, float, short float, etc...
            </p>
          </div>
          <div className="w-full">
            <Image src={financials} layout="fixed" height={50} width={50} />
            <p className="text-xs w-[112px] text-center font-semibold text-black py-1 rounded-full bg-gradient-to-br from-yellow-500 to-green-500 mb-4">
              Financials
            </p>
            <p className="text-neutral-500 text-sm">
              Get a quick overlook on how a company is doing financially.
            </p>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="mr-4 w-full">
            <Image src={news} layout="fixed" height={50} width={50} />
            <p className="text-xs w-[112px] text-center font-semibold text-black py-1 rounded-full bg-gradient-to-br from-pink-500 to-violet-500 mb-4">
              Latest News
            </p>
            <p className="text-neutral-500 text-sm">
              View the latest news for a company, it is important to be ably to
              identify catalysts quickly.
            </p>
          </div>
          <div className="mr-4 w-full">
            <Image src={movers} layout="fixed" height={50} width={50} />
            <p className="text-xs w-[112px] text-center font-semibold text-black py-1 rounded-full bg-gradient-to-br from-violet-500 to-emerald-500 mb-4">
              Top Movers
            </p>
            <p className="text-neutral-500 text-sm">
              View the top movers on the day. You can see the top gainers and
              top losers during regular market hours.
            </p>
          </div>
          <div className="mr-4 w-full">
            <Image src={ownership} layout="fixed" height={50} width={50} />
            <p className="text-xs w-[112px] text-center font-semibold text-black py-1 rounded-full bg-gradient-to-br from-amber-500 to-purple-500 mb-4">
              Ownership
            </p>
            <p className="text-neutral-500 text-sm">
              See the top institutional and insider holders of a stock.
            </p>
          </div>
          <div className="w-full">
            <Image src={offerings} layout="fixed" height={50} width={50} />
            <p className="text-xs w-[112px] text-center font-semibold text-black py-1 rounded-full bg-gradient-to-br from-indigo-500 to-red-500 mb-4">
              Offerings
            </p>
            <p className="text-neutral-500 text-sm">
              This tool lets you see the recent and upcoming offerings a stock
              may have.
            </p>
          </div>
        </div>
        {/* <div className="w-1/2 ml-14">
            <p className="text-2xl text-white font-semibold">
              Something here for the title
            </p>
            <p className="text-neutral-400">
              orem Ipsum has been the industry's standard dummy text ever since
              the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book. It has survived not
              only five centuries, but also the leap into electronic
              typesetting, remaining essentially unchanged. orem Ipsum has been
              the industry's standard dummy text ever since the 1500s, when an
              unknown printer took a galley of type and scrambled it to make a
              type specimen book. It has survived not only five centuries, but
              also the leap into electronic typesetting, remaining essentially
              unchanged.
            </p>
          </div> */}
      </div>
    </div>
  );
};

export default Features;
