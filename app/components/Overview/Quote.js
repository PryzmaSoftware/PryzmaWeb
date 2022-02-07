import axios from "axios";
import { useEffect, useState, useContext } from "react";
import SymbolContext from "../SymbolContext";
import millify from "millify";

const Quote = ({ setQuote, isLoading }) => {
  // get symbol from context provider
  const { symbol } = useContext(SymbolContext);

  // this state will hold the price data
  // the data that we will map through and display to the user
  const [data, setData] = useState();

  // this will call the function above on component load to fetch
  // the price quote and volume stats
  // it is set to run everytime the symbol changes
  useEffect(() => {
    const getData = async () => {
      // check if there is a symbol
      if (!symbol) return;
      // reset quote and data
      // so we can show skeleton loading
      setQuote(false);
      setData();
      // make call to backend to get quote data
      const response = await axios.post("/api/get-quote", {
        symbol: symbol[0],
      });
      if (response) {
        // set the data so we can map it out to the user
        setData(response.data);
        // set the quote to loaded so the main component
        // knows when it can show everything together
        // and stop the skeleton loader
        setQuote(true);
      }
    };
    getData();
  }, [symbol]);

  if (!data || isLoading)
    return (
      <div className="w-full max-w-[300px] min-w-[300px] h-[400px]">
        <div className="animate-pulse p-4 rounded-md bg-neutral-800 w-full max-w-[100px]"></div>
        <div className="animate-pulse p-3 rounded-md bg-neutral-800 w-full mt-2"></div>
        <div className="animate-pulse p-3 rounded-md bg-neutral-800 w-full mt-2"></div>
        <div className="animate-pulse p-3 rounded-md bg-neutral-800 w-full mt-2"></div>
        <div className="animate-pulse p-3 rounded-md bg-neutral-800 w-full mt-2"></div>
        <div className="animate-pulse p-3 rounded-md bg-neutral-800 w-full mt-2"></div>
        <div className="animate-pulse p-3 rounded-md bg-neutral-800 w-full mt-2"></div>
        <div className="animate-pulse p-3 rounded-md bg-neutral-800 w-full mt-2"></div>
        <div className="animate-pulse p-3 rounded-md bg-neutral-800 w-full mt-2"></div>
        <div className="animate-pulse p-3 rounded-md bg-neutral-800 w-full mt-2"></div>
        <div className="animate-pulse p-3 rounded-md bg-neutral-800 w-full mt-2"></div>
        <div className="animate-pulse p-3 rounded-md bg-neutral-800 w-full mt-2"></div>
      </div>
    );

  return (
    <div className="w-full max-w-[280px] min-w-[280px] opacity-0 animate-fadeIn">
      {/* <p className="p-4 pl-0 text-neutral-300  text-xl flex items-center">
        <Image src={quote} height={30} width={30} />
        <span className="ml-4">Price Statistics</span>
      </p> */}
      <div>
        <p className="flex items-center py-2 text-white font-medium text-lg border-b border-neutral-800">
          Quote
          {/* <span>
          <span className="mr-4">Last Updated:</span>
            {format(new Date(data.latestUpdate), "MMMM dd, h:mm aa")}
          </span> */}
        </p>
        <div className="flex justify-between py-2 border-b border-neutral-800">
          <p className="text-xs  text-white">Price</p>
          <p className="text-xs  text-neutral-300">
            {data.latestPrice ? `${data.latestPrice.toFixed(2)}` : "-"}
          </p>
        </div>
        <div className="flex justify-between py-2 border-b border-neutral-800">
          <p className=" text-white text-xs">Change</p>
          <p
            className={`text-xs  ${
              data.change
                ? Math.sign(data.change) === -1
                  ? "text-red-500"
                  : "text-green-500"
                : ""
            }`}
          >
            {data.change ? `${data.change.toFixed(2)}` : "-"}
          </p>
        </div>
        <div className="flex justify-between py-2 border-b border-neutral-800">
          <p className=" text-white text-xs">% Change</p>
          <p
            className={`text-xs  ${
              data.changePercent
                ? Math.sign(data.changePercent) === -1
                  ? "text-red-500"
                  : "text-green-500"
                : ""
            }`}
          >
            {data.changePercent ? `${data.changePercent.toFixed(2)}%` : "-"}
          </p>
        </div>
        <div className="flex justify-between py-2 border-b border-neutral-800">
          <p className=" text-white text-xs">Volume</p>
          <p className="text-xs  text-neutral-300">
            {data.volume
              ? `${millify(data.volume, { precision: 2, space: true })}`
              : "-"}
          </p>
        </div>
        <div className="flex justify-between py-2 border-b border-neutral-800">
          <p className=" text-white text-xs">Avg Volume</p>
          <p className="text-xs  text-neutral-300">
            {data.avgTotalVolume
              ? `${millify(data.avgTotalVolume, {
                  precision: 2,
                  space: true,
                })}`
              : "-"}
          </p>
        </div>

        <div className="flex justify-between py-2 border-b border-neutral-800">
          <p className=" text-white text-xs">Close</p>
          <p className="text-xs  text-neutral-300">
            {data.iexClose
              ? `${data.isUSMarketOpen ? "-" : `${data.iexClose}`}`
              : "-"}
          </p>
        </div>
        <div className="flex justify-between py-2 border-b border-neutral-800">
          <p className=" text-white text-xs">Prev Close</p>
          <p className="text-xs  text-neutral-300">
            {data.previousClose ? `${data.previousClose.toFixed(2)}` : "-"}
          </p>
        </div>
        <div className="flex justify-between py-2 border-b border-neutral-800">
          <p className=" text-white text-xs">YTD Change</p>
          <p
            className={`text-xs  ${
              data.ytdChange
                ? Math.sign(data.ytdChange) === -1
                  ? "text-red-500"
                  : "text-green-500"
                : ""
            }`}
          >
            {data.ytdChange ? `${data.ytdChange.toFixed(2)}%` : "-"}
          </p>
        </div>
        <div className="flex justify-between py-2 border-b border-neutral-800">
          <p className=" text-white text-xs">52 Week High</p>
          <p className="text-xs  text-neutral-300">
            {data.week52High ? `${data.week52High.toFixed(2)}` : "-"}
          </p>
        </div>
        <div className="flex justify-between py-2 border-b border-neutral-800">
          <p className=" text-white text-xs">52 Week Low</p>
          <p className="text-xs  text-neutral-300">
            {data.week52Low ? `${data.week52Low.toFixed(2)}` : "-"}
          </p>
        </div>
        <div className="flex justify-between py-2 border-b border-neutral-800">
          <p className=" text-white text-xs">PE Ratio</p>
          <p className="text-xs  text-neutral-300">
            {data.peRatio ? data.peRatio.toFixed(2) : "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Quote;

{
  /* <p className=" text-gray-900  text-xs">Price</p>
          <p className="text-xs  text-neutral-300 truncate">
            ${" "}
            {data.latestPrice
              ? data.latestPrice.toLocaleString("en-us", {
                  maximumFractionDigits: 2,
                  minimumFractionDigits: 2,
                })
              : ""}
          </p>
        </div>
        <div className="flex bg-gray-100 p-3 pl-4 items-center justify-between">
          <p className=" text-gray-900  text-xs">% Change</p>
          <p className="text-xs  text-neutral-300 truncate">{data.changePercent}</p>
        </div>
        <div className="flex bg-gray-200 p-3 pl-4 items-center justify-between">
          <p className=" text-gray-900  text-xs">Change</p>
          <p className="text-xs  text-neutral-300 truncate">{data.change}</p>
        </div>
        <div className="flex bg-gray-100 p-3 pl-4 items-center justify-between">
          <p className=" text-gray-900  text-xs">High</p>
          <p className="text-xs  text-neutral-300 truncate">{data.high}</p>
        </div>
        <div className="flex bg-gray-200 p-3 pl-4 items-center justify-between">
          <p className=" text-gray-900  text-xs">Low</p>
          <p className="text-xs  text-neutral-300 truncate">{data.low}</p>
        </div>
        <div className="flex bg-gray-100 p-3 pl-4 items-center justify-between">
          <p className=" text-gray-900  text-xs">Close</p>
          <p className="text-xs  text-neutral-300 truncate">{data.close}</p>
        </div>
        <div className="flex bg-gray-200 p-3 pl-4 items-center justify-between">
          <p className=" text-gray-900  text-xs">Previous Close</p>
          <p className="text-xs  text-neutral-300 truncate">{data.previousClose}</p>
        </div>
        <div className="flex bg-gray-100 p-3 pl-4 items-center justify-between">
          <p className=" text-gray-900  text-xs">Volume</p>
          <p className="text-xs  text-neutral-300 truncate">{data.volume}</p>
        </div>
        <div className="flex bg-gray-200 p-3 pl-4 items-center justify-between">
          <p className=" text-gray-900  text-xs">Avg Volume</p>
          <p className="text-xs  text-neutral-300 truncate">{data.avgTotalVolume}</p>
        </div>
        <div className="flex bg-gray-100 p-3 pl-4 items-center justify-between">
          <p className=" text-gray-900  text-xs">52 Wk High</p>
          <p className="text-xs  text-neutral-300 truncate">{data.week52High}</p>
        </div>
        <div className="flex bg-gray-200 p-3 pl-4 items-center justify-between">
          <p className=" text-gray-900  text-xs">52 Wk Low</p>
          <p className="text-xs  text-neutral-300 truncate">{data.week52Low}</p>
        </div>
        <div className="flex bg-gray-100 p-3 pl-4 items-center justify-between">
          <p className=" text-gray-900 text-xs">Yp Change</p>
          <p className="text-xs  text-neutral-300 truncate">{data.ypChange}</p>
        </div> */
}
