const Steps = () => {
  return (
    <div className="mt-20 p-4 opacity-0 animate-fadeIn" id="steps">
      <div className="mx-auto max-w-7xl">
        <p className="text-neutral-500 font-semibold uppercase text-xs steps:text-sm text-center">
          helping you make the best decisions
        </p>
        <p className="font-bold text-white text-2xl steps:text-4xl text-center mt-2 capitalize">
          Leave the hard work up to us
        </p>
        <div className="flex mt-6 steps:mt-12 flex-col steps:flex-row">
          <div className="p-[2px] bg-gradient-to-br rounded-md from-cyan-600 to-rose-600 w-full steps:mr-6 flex justify-center items-center mb-6 steps:mb-0">
            <div className="p-3 py-6 rounded-md w-full bg-black h-full">
              <p className="font-medium text-2xl text-white text-center">
                Discover
              </p>
              <p className="text-neutral-300 text-center mb-4">
                Find New Stocks
              </p>
              <p className="text-neutral-400 text-sm text-center">
                See all of the top movers on the day during regular market
                hours. You can find the top gainers as well as the top losers.
              </p>
            </div>
          </div>
          <div className="p-[2px] bg-gradient-to-br from-emerald-600 to-fuchsia-600 rounded-md w-full mr-6 flex justify-center items-center steps:mr-6 mb-6 steps:mb-0">
            <div className="p-3 py-6 rounded-md w-full bg-black h-full">
              <p className="font-medium text-2xl text-white text-center">
                Research
              </p>
              <p className="text-neutral-300 text-center mb-2">
                Analyze Companies
              </p>
              <p className="text-neutral-400 text-sm text-center">
                Using our tools, you will be able to form a solid bias. You can
                find financials, statistics, latest news, ownership, and much
                more.
              </p>
            </div>
          </div>
          <div className="p-[2px] bg-gradient-to-br rounded-md from-pink-600 to-blue-600 w-full flex justify-center items-center">
            <div className="p-3 py-6 rounded-md w-full bg-black h-full">
              <p className="font-medium text-2xl text-white text-center">
                Execute
              </p>
              <p className="text-neutral-300 text-center mb-2">
                Trade Your Plan
              </p>
              <p className="text-neutral-400 text-sm text-center">
                We are confident you will be able to form a solid trading plan
                after analyzing the data that we provide.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Steps;
