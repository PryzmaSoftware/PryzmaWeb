import axios from "axios";
import { useEffect, useState, useContext } from "react";
import SymbolContext from "../SymbolContext";
import millify from "millify";

const Stats = ({ isLoading, setStats }) => {
  // get symbol from context provider
  const { symbol } = useContext(SymbolContext);

  // tdis state will hold tde company profile data
  // tde data tdat we will map tdrough and display to tde user
  const [data, setData] = useState();

  // tdis will call tde function above on component load to fetch
  // tde price quote and volume stats
  // it is set to run everytime tde symbol changes
  useEffect(() => {
    const getData = async () => {
      // check if tdere is a symbol
      if (!symbol) return;
      // reset stats and data
      // to show skeleton loading
      setStats(false);
      setData();
      // hit backend api call to get data
      const response = await axios.post("/api/get-share-structure", {
        symbol: symbol[0],
      });
      if (response) {
        // if there is stats response, set the data
        setData(response.data);
        // set tde statistics to loaded so tde main component
        // knows when it can show everytding togetder
        // and stop tde skeleton loader
        setStats(true);
      }
    };
    getData();
  }, [symbol]);

  if (isLoading || !data)
    return (
      <div className="w-full p-10 mt-8 rounded-lg bg-neutral-800 animate-pulse"></div>
    );

  return (
    <div className="mt-8 animate-fadeIn opacity-0">
      <div>
        <p className="text-white font-medium text-lg py-2 border-b border-neutral-800">
          Statistics
        </p>
        {data.message === "twelve" ? (
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-neutral-800">
                <td className="text-xs text-white p-3 pl-4">Market Cap</td>
                <td className="text-xs text-white">Shares Outs</td>
                <td className="text-xs text-white">Float</td>
                <td className="text-xs text-white">Shares Short</td>
                <td className="text-xs text-white">Short Float %</td>
                <td className="text-xs text-white">Insider Own</td>
                <td className="text-xs text-white">Inst Own</td>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-neutral-800">
                <td className="text-xs text-neutral-300 p-3 pl-4">
                  {data.marketCap.market_capitalization
                    ? millify(data.marketCap.market_capitalization, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
                <td className="text-xs text-neutral-300">
                  {data.stats.shares_outstanding
                    ? millify(data.stats.shares_outstanding, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
                <td className="text-xs text-neutral-300">
                  {data.stats.float_shares
                    ? millify(data.stats.float_shares, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
                <td className="text-xs text-neutral-300">
                  {data.stats.shares_short
                    ? millify(data.stats.shares_short, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
                <td className="text-xs text-neutral-300">
                  {data.stats.shares_short && data.stats.float_shares
                    ? `${(
                        (data.stats.shares_short / data.stats.float_shares) *
                        100
                      ).toFixed(2)}%`
                    : "-"}
                </td>
                <td className="text-xs text-neutral-300">
                  {data.stats.percent_held_by_insiders
                    ? `${(data.stats.percent_held_by_insiders * 100).toFixed(
                        2
                      )}%`
                    : "-"}
                </td>
                <td className="text-xs text-neutral-300">
                  {data.stats.percent_held_by_institutions
                    ? `${(
                        data.stats.percent_held_by_institutions * 100
                      ).toFixed(2)}%`
                    : "-"}
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <table className="w-full table-fixed">
            <tr className="border-b border-neutral-800">
              <td className="text-xs text-white p-3 pl-4">Market Cap</td>
              <td className="text-xs text-white">Shares Outs</td>
              <td className="text-xs text-white">Float</td>
              <td className="text-xs text-white">Shares Short</td>
              <td className="text-xs text-white">Short Float %</td>
              <td className="text-xs text-white">Insider Own</td>
              <td className="text-xs text-white">Inst Own</td>
            </tr>
            <tr className="border-b border-neutral-800">
              <td className="text-xs text-neutral-300 p-3 pl-4">
                {data.marketCap
                  ? millify(data.marketCap, { precision: 2, space: true })
                  : "-"}
              </td>
              <td className="text-xs text-neutral-300">
                {data.sharesOutstanding
                  ? millify(data.sharesOutstanding, {
                      precision: 2,
                      space: true,
                    })
                  : "-"}
              </td>
              <td className="text-xs text-neutral-300">-</td>
              <td className="text-xs text-neutral-300">-</td>
              <td className="text-xs text-neutral-300">-</td>
              <td className="text-xs text-neutral-300">-</td>
              <td className="text-xs text-neutral-300">-</td>
            </tr>
          </table>
        )}
      </div>
    </div>
  );
};

export default Stats;
