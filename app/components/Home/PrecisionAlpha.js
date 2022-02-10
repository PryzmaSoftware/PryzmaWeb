import probability from "../../public/images/probability.png";
import energy from "../../public/images/energy.png";
import power from "../../public/images/power.png";
import noise from "../../public/images/noise.png";
import emotion from "../../public/images/emotion.png";
import resistance from "../../public/images/resistance.png";
import Image from "next/image";
import Link from "next/link";

const PrecisionAlpha = () => {
  return (
    <div className="p-4 precisionHome:mt-20 mt-10 mb-10 opacity-0 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        <p className="text-neutral-500 font-semibold uppercase text-xs steps:text-sm text-center">
          precision alpha
        </p>
        <p className="font-bold text-white text-2xl steps:text-4xl text-center mt-2 capitalize">
          Machine Learning Stock Signals
        </p>
        <p className="max-w-5xl mx-auto text-neutral-400 text-center mt-6 leading-7">
          Precision Alpha performs an unbiased non-equilibrium market analysis
          on six months of closing price data for all NASDAQ and NYSE listed
          equities, every day after market close. Precision Alpha calculates
          scientifically and exactly: market emotion, power, resistance,
          noise/efficiency, and next day probabilities.
        </p>
        <div className="flex mt-16 items-center flex-col precisionHome:flex-row">
          <div className="rounded-md overflow-hidden max-h-[332px] max-w-[638px]">
            <Image src={probability} width={640} height={335} />
          </div>
          <div className="precisionHome:ml-10 mt-6 precisionHome:mt-0">
            <p className="font-semibold text-white text-2xl capitalize">
              Next Day Probability
            </p>
            <p className="precisionHome:max-w-xl max-w-[640px] mx-auto text-neutral-500 mt-4 leading-7">
              Next day probabiliy that the price of a stock will increase in
              price (Bull) or decrease in price (Bear). For example, a bull
              probability over 0.50 will make it more likely that the price will
              increase the following day. The same can be applied on the bear
              side. This is great to see who is in control, buyers or sellers?
              Bear or Bull?
            </p>
            <p className="max-w-xl mt-4">
              <span className="italic text-neutral-400 text-sm">
                Takeaway: Bulls are in control, a move to the upside is likely.
              </span>
            </p>
          </div>
        </div>
        <div className="flex mt-32 items-center precisionHome:flex-row flex-col-reverse">
          <div className="precisionHome:mr-10">
            <p className="font-semibold text-white text-2xl capitalize mt-6 precisionHome:mt-0">
              Market Energy & Temperature
            </p>
            <p className="precisionHome:max-w-xl max-w-[640px] mx-auto text-neutral-500 mt-4 leading-7">
              The energy available to do useful price movement work. As the free
              energy drops, the price of an asset and temperature will move up
              (direction of dominant probability) over an extended number of
              days and weeks.
            </p>
            <p className="max-w-xl mt-4">
              <span className="italic text-neutral-400 text-sm">
                Takeaway: Energy is resetting at zero while temperature is
                dropping, this is a sign a move to the upside is coming soon.
              </span>
            </p>
          </div>
          <div className="rounded-md overflow-hidden max-h-[332px] max-w-[638px]">
            <Image src={energy} width={640} height={335} />
          </div>
        </div>
        <div className="flex mt-32 items-center flex-col precisionHome:flex-row">
          <div className="rounded-md overflow-hidden max-h-[332px] max-w-[638px]">
            <Image src={power} width={640} height={335} />
          </div>
          <div className="precisionHome:ml-10">
            <p className="font-semibold text-white text-2xl capitalize mt-6 precisionHome:mt-0">
              Market Power
            </p>
            <p className="max-w-[640px] precisionHome:max-w-xl mx-auto text-neutral-500 mt-4 leading-7">
              The ability of the overall market to increase or decrease the
              price of a stock. The higher above the equilibrium, being zero,
              the more the financial market has an impact on the price of the
              asset.
            </p>
            <p className="max-w-xl mt-4">
              <span className="italic text-neutral-400 text-sm">
                Takeaway: Power is slowly dropping off, near equilibrium, it
                will not have much of an impact.
              </span>
            </p>
          </div>
        </div>
        <div className="flex mt-32 items-center precisionHome:flex-row flex-col-reverse">
          <div className="precisionHome:mr-10">
            <p className="font-semibold text-white text-2xl capitalize mt-6 precisionHome:mt-0">
              Market Noise
            </p>
            <p className="max-w-[640px] precisionHome:max-w-xl mx-auto text-neutral-500 mt-4 leading-7">
              Noise reduces the efficiency of market power. As market noise goes
              down, market power becomes stronger and more efficient, on the
              other hand, if market noise goes up, market power becomes less
              efficient.
            </p>
            <p className="max-w-xl mt-4">
              <span className="italic text-neutral-400 text-sm">
                Takeaway: With the rise of market noise, the market power
                becomes even less efficient than it already is.
              </span>
            </p>
          </div>
          <div className="rounded-md overflow-hidden max-h-[332px] max-w-[638px]">
            <Image src={noise} width={640} height={335} />
          </div>
        </div>
        <div className="flex mt-32 items-center precisionHome:flex-row flex-col">
          <div className="rounded-md overflow-hidden max-h-[332px] max-w-[638px]">
            <Image src={emotion} width={640} height={335} />
          </div>
          <div className="precisionHome:ml-10">
            <p className="font-semibold text-white text-2xl capitalize mt-6 precisionHome:mt-0">
              Market Emotion
            </p>
            <p className="max-w-[640px] precisioinHome:max-w-xl mx-auto text-neutral-500 mt-4 leading-7">
              Market energy measured from equilibrium of zero, a negative market
              emotion is bearish while a positive market emotion is bullish.
            </p>
            <p className="max-w-xl mt-4">
              <span className="italic text-neutral-400 text-sm">
                Takeaway: Market emotion remains elevated, BULLISH!
              </span>
            </p>
          </div>
        </div>
        <div className="flex mt-32 items-center mb-12 precisionHome:flex-row flex-col-reverse">
          <div className="precisionHome:mr-10">
            <p className="font-semibold text-white text-2xl capitalize mt-6 precisionHome:mt-0">
              Market Resistance
            </p>
            <p className="max-w-[640px] precisionHome:max-w-xl mx-auto text-neutral-500 mt-4 leading-7">
              Resistance to a dominant movement in price of an asset. Increasing
              resistance reduces market power while decreasing resistance
              increase market power.
            </p>
            <p className="max-w-xl mt-4">
              <span className="italic text-neutral-400 text-sm">
                Takeaway: Resistance slowly decreasing which means the market
                power will become more efficient and should be able to make a
                stronger price movement.
              </span>
            </p>
          </div>
          <div className="rounded-md overflow-hidden max-h-[332px] max-w-[638px]">
            <Image src={resistance} width={640} height={335} />
          </div>
        </div>
        <p className="text-3xl steps:text-5xl font-bold text-white max-w-2xl mb-6 mt-24 mx-auto text-center leading-10 steps:leading-[60px]">
          Take Your Fundamental Research to the Next Level.
        </p>
        <p className="text-neutral-400 text-center mb-6">
          Don&#39;t get left behind.
        </p>
        <div className="flex justify-center flex-col xs:flex-row opacity-0 animate-fadeIn xs:mt-0 mb-10">
          <Link href="/signup">
            <a className="animate-fadeIn animate-move mb-4 xs:mb-0 hover:scale-105 text-center w-full xs:w-[200px] text-white bg-gradient-to-r from-indigo-600 to-rose-600 bg-[length:400%] bg-left hover:bg-right rounded-md py-3 transition-all duration-300">
              Start Free Trial
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrecisionAlpha;
