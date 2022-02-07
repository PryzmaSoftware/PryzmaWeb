const Exchanges = () => {
  return (
    <div className="bg-neutral-900 border-t border-b border-neutral-800 mt-20 px-4 opacity-0 animate-fadeIn">
      <div className="max-w-4xl mx-auto flex py-4">
        <div className="w-full">
          <p className="text-xl xs:text-2xl sm:text-4xl font-semibold text-white text-center">
            NYSE
          </p>
          <p className="text-neutral-400 mt-2 text-center text-sm xs:text-base">
            Full Coverage
          </p>
        </div>
        <div className="w-full">
          <p className="text-xl xs:text-2xl sm:text-4xl font-semibold text-white text-center">
            NASDAQ
          </p>
          <p className="text-neutral-400 mt-2 text-center text-sm xs:text-base">
            Full Coverage
          </p>
        </div>
        <div className="w-full">
          <p className="text-xl xs:text-2xl sm:text-4xl font-semibold text-white text-center">
            7,200+
          </p>
          <p className="text-neutral-400 mt-2 text-center text-sm xs:text-base">
            Symbols
          </p>
        </div>
      </div>
    </div>
  );
};

export default Exchanges;
