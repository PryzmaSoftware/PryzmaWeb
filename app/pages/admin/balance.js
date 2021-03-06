import clientPromise from "../../lib/mongodb";
import { withIronSession } from "next-iron-session";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../components/UserContext";
import SymbolContext from "../../components/SymbolContext";
import millify from "millify";
import Head from "next/head";

const Balance = ({ user }) => {
  const { symbol } = useContext(SymbolContext);
  const { setUser } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();

  const [period, setPeriod] = useState("quarterly");

  useEffect(() => {
    setUser(user);
  }, []);

  const handleSwitchPeriod = async (e) => {
    setData();
    setIsLoading(true);
    setPeriod(e.target.value);
    const response = await axios.post("/api/balance-sheet", {
      symbol: symbol[0],
      period: e.target.value,
    });
    if (response.data.balance_sheet) {
      setData(response.data.balance_sheet);
      return setIsLoading(false);
    }
    setIsLoading(false);
    setData("data not available");
  };

  useEffect(() => {
    if (!symbol) return;

    // reset data
    // and loader
    setData();
    setIsLoading(true);

    // create function to hit backend endpoint
    const getData = async () => {
      if (!symbol) return;
      const response = await axios.post("/api/balance-sheet", {
        symbol: symbol[0],
        period: period,
      });
      if (response.data.balance_sheet) {
        setData(response.data.balance_sheet);
        return setIsLoading(false);
      }
      setIsLoading(false);
      setData("data not available");
    };
    getData();
  }, [symbol]);

  if (!symbol)
    return (
      <div className="p-4 opacity-0 animate-fadeIn">
        <Head>
          <title>Pryzma - Balance Sheet</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="description" content="Balance Sheet" />
          <meta name="keywords" content="pryzma, balance sheet" />
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

  if (!data || isLoading)
    return (
      <div className="px-4">
        <Head>
          <title>Pryzma - Balance Sheet - {symbol[0]}</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="description" content="Balance Sheet" />
          <meta name="keywords" content="pryzma, balance sheet" />
        </Head>
        <div className="max-w-7xl mx-auto mt-4">
          <div className="flex items-center justify-between">
            <div className="p-4 max-w-[300px] w-full bg-neutral-800 animate-pulse rounded-md"></div>
            <div className="flex">
              <div className="p-2 rounded-md w-[70px] bg-neutral-800 animate-pulse mr-4"></div>
              <div className="p-2 rounded-md w-[70px] bg-neutral-800 animate-pulse"></div>
            </div>
          </div>
          <div className="w-full p-4 rounded-md bg-neutral-800 animate-pulse mt-3"></div>
          <div className="w-full p-4 rounded-md bg-neutral-800 animate-pulse mt-3"></div>
          <div className="w-full p-4 rounded-md bg-neutral-800 animate-pulse mt-3"></div>
          <div className="w-full p-4 rounded-md bg-neutral-800 animate-pulse mt-3"></div>
          <div className="w-full p-4 rounded-md bg-neutral-800 animate-pulse mt-3"></div>
          <div className="w-full p-4 rounded-md bg-neutral-800 animate-pulse mt-3"></div>
        </div>
      </div>
    );

  if (data === "data not available" || !data.length)
    return (
      <div className="p-4 mx-auto rounded-md border w-fit border-red-500 bg-neutral-800 mt-10 animate-fadeIn opacity-0">
        <Head>
          <title>Pryzma - Balance Sheet - {symbol[0]}</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta name="description" content="Balance Sheet" />
          <meta name="keywords" content="pryzma, balance sheet" />
        </Head>
        <p className=" text-white text-sm">No data available for {symbol[0]}</p>
      </div>
    );

  return (
    <div className="p-4 mb-12 animate-fadeIn opacity-0">
      <Head>
        <title>Pryzma - Balance Sheet - {symbol[0]}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Balance Sheet" />
        <meta name="keywords" content="pryzma, balance sheet" />
      </Head>
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-2">
          <p className="font-medium text-white text-2xl mb-2 capitalize">
            Balance Sheet - {period}
          </p>
          <div className="flex">
            <button
              onClick={handleSwitchPeriod}
              value="quarterly"
              className={`rounded-md border text-xs w-[80px] hover:text-white hover:border-white text-center duration-300 px-2 py-1.5 mr-2 ${
                period === "quarterly"
                  ? "border-white text-white"
                  : "border-neutral-700 text-neutral-500"
              } transition-all`}
            >
              Quarterly
            </button>
            <button
              onClick={handleSwitchPeriod}
              value="annual"
              className={`rounded-md border text-xs w-[80px] text-center hover:border-white hover:text-white duration-300 px-2 py-1.5 ${
                period === "annual"
                  ? "text-white border-white"
                  : "text-neutral-500 border-neutral-700"
              } transition-all`}
            >
              Annual
            </button>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-800">
              <td className="text-xs  text-white p-2">Break Down</td>
              <td className="text-xs  text-white">
                {data[0] ? data[0].fiscal_date : ""}
              </td>
              {data[1] ? (
                <td className="text-xs  text-white">{data[1].fiscal_date}</td>
              ) : (
                ""
              )}
              {data[2] ? (
                <td className="text-xs  text-white">{data[2].fiscal_date}</td>
              ) : (
                ""
              )}
              {data[3] ? (
                <td className="text-xs  text-white">{data[3].fiscal_date}</td>
              ) : (
                ""
              )}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-neutral-800">
              <td className=" text-white p-2 text-xs">Total Current Assets</td>
              {data[0] && (
                <td className="text-neutral-300 text-xs">
                  {data[0].assets.current_assets.total_current_assets
                    ? millify(
                        data[0].assets.current_assets.total_current_assets,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className="text-neutral-300 text-xs">
                  {data[1].assets.current_assets.total_current_assets
                    ? millify(
                        data[1].assets.current_assets.total_current_assets,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].assets.current_assets.total_current_assets
                    ? millify(
                        data[2].assets.current_assets.total_current_assets,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].assets.current_assets.total_current_assets
                    ? millify(
                        data[3].assets.current_assets.total_current_assets,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 text-xs p-2">Cash</td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].assets.current_assets.cash
                    ? millify(data[0].assets.current_assets.cash, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].assets.current_assets.cash
                    ? millify(data[1].assets.current_assets.cash, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].assets.current_assets.cash
                    ? millify(data[2].assets.current_assets.cash, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].assets.current_assets.cash
                    ? millify(data[3].assets.current_assets.cash, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 text-xs p-2">
                Cash Equivalents
              </td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].assets.current_assets.cash_equivalents
                    ? millify(data[0].assets.current_assets.cash_equivalents, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].assets.current_assets.cash_equivalents
                    ? millify(data[1].assets.current_assets.cash_equivalents, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].assets.current_assets.cash_equivalents
                    ? millify(data[2].assets.current_assets.cash_equivalents, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].assets.current_assets.cash_equivalents
                    ? millify(data[3].assets.current_assets.cash_equivalents, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 text-xs p-2">
                Cash & Cash Equivalents
              </td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].assets.current_assets.cash_and_cash_equivalents
                    ? millify(
                        data[0].assets.current_assets.cash_and_cash_equivalents,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].assets.current_assets.cash_and_cash_equivalents
                    ? millify(
                        data[1].assets.current_assets.cash_and_cash_equivalents,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].assets.current_assets.cash_and_cash_equivalents
                    ? millify(
                        data[2].assets.current_assets.cash_and_cash_equivalents,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].assets.current_assets.cash_and_cash_equivalents
                    ? millify(
                        data[3].assets.current_assets.cash_and_cash_equivalents,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 text-xs p-2">
                Short Term Investments
              </td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].assets.current_assets.other_short_term_investments
                    ? millify(
                        data[0].assets.current_assets
                          .other_short_term_investments,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].assets.current_assets.other_short_term_investments
                    ? millify(
                        data[1].assets.current_assets
                          .other_short_term_investments,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].assets.current_assets.other_short_term_investments
                    ? millify(
                        data[2].assets.current_assets
                          .other_short_term_investments,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].assets.current_assets.other_short_term_investments
                    ? millify(
                        data[3].assets.current_assets
                          .other_short_term_investments,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 text-xs p-2">
                Accounts Receivable
              </td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].assets.current_assets.accounts_receivable
                    ? millify(
                        data[0].assets.current_assets.accounts_receivable,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].assets.current_assets.accounts_receivable
                    ? millify(
                        data[1].assets.current_assets.accounts_receivable,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].assets.current_assets.accounts_receivable
                    ? millify(
                        data[2].assets.current_assets.accounts_receivable,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].assets.current_assets.accounts_receivable
                    ? millify(
                        data[3].assets.current_assets.accounts_receivable,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 text-xs p-2">
                Other Receivables
              </td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].assets.current_assets.other_receivables
                    ? millify(data[0].assets.current_assets.other_receivables, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].assets.current_assets.other_receivables
                    ? millify(data[1].assets.current_assets.other_receivables, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].assets.current_assets.other_receivables
                    ? millify(data[2].assets.current_assets.other_receivables, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].assets.current_assets.other_receivables
                    ? millify(data[3].assets.current_assets.other_receivables, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 text-xs p-2">Inventory</td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].assets.current_assets.inventory
                    ? millify(data[0].assets.current_assets.inventory, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].assets.current_assets.inventory
                    ? millify(data[1].assets.current_assets.inventory, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].assets.current_assets.inventory
                    ? millify(data[2].assets.current_assets.inventory, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].assets.current_assets.inventory
                    ? millify(data[3].assets.current_assets.inventory, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 text-xs p-2">Prepaid Assets</td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].assets.current_assets.prepaid_assets
                    ? millify(data[0].assets.current_assets.prepaid_assets, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].assets.current_assets.prepaid_assets
                    ? millify(data[1].assets.current_assets.prepaid_assets, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].assets.current_assets.prepaid_assets
                    ? millify(data[2].assets.current_assets.prepaid_assets, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].assets.current_assets.prepaid_assets
                    ? millify(data[3].assets.current_assets.prepaid_assets, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 text-xs p-2">
                Other Current Assets
              </td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].assets.current_assets.other_current_assets
                    ? millify(
                        data[0].assets.current_assets.other_current_assets,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].assets.current_assets.other_current_assets
                    ? millify(
                        data[1].assets.current_assets.other_current_assets,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].assets.current_assets.other_current_assets
                    ? millify(
                        data[2].assets.current_assets.other_current_assets,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].assets.current_assets.other_current_assets
                    ? millify(
                        data[3].assets.current_assets.other_current_assets,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-white p-2 text-xs">
                Total Non Current Assets
              </td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].assets.non_current_assets.total_non_current_assets
                    ? millify(
                        data[0].assets.non_current_assets
                          .total_non_current_assets,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].assets.non_current_assets.total_non_current_assets
                    ? millify(
                        data[1].assets.non_current_assets
                          .total_non_current_assets,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].assets.non_current_assets.total_non_current_assets
                    ? millify(
                        data[2].assets.non_current_assets
                          .total_non_current_assets,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].assets.non_current_assets.total_non_current_assets
                    ? millify(
                        data[3].assets.non_current_assets
                          .total_non_current_assets,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 p-2 text-xs">Properties</td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].assets.non_current_assets.properties
                    ? millify(data[0].assets.non_current_assets.properties, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].assets.non_current_assets.properties
                    ? millify(data[1].assets.non_current_assets.properties, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].assets.non_current_assets.properties
                    ? millify(data[2].assets.non_current_assets.properties, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].assets.non_current_assets.properties
                    ? millify(data[3].assets.non_current_assets.properties, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 p-2 text-xs">
                Land & Improvements
              </td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].assets.non_current_assets.land_and_improvements
                    ? millify(
                        data[0].assets.non_current_assets.land_and_improvements,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].assets.non_current_assets.land_and_improvements
                    ? millify(
                        data[1].assets.non_current_assets.land_and_improvements,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].assets.non_current_assets.land_and_improvements
                    ? millify(
                        data[2].assets.non_current_assets.land_and_improvements,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].assets.non_current_assets.land_and_improvements
                    ? millify(
                        data[3].assets.non_current_assets.land_and_improvements,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 p-2 text-xs">
                Machinery Equipment
              </td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].assets.non_current_assets
                    .machinery_furniture_equipment
                    ? millify(
                        data[0].assets.non_current_assets
                          .machinery_furniture_equipment,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].assets.non_current_assets
                    .machinery_furniture_equipment
                    ? millify(
                        data[1].assets.non_current_assets
                          .machinery_furniture_equipment,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].assets.non_current_assets
                    .machinery_furniture_equipment
                    ? millify(
                        data[2].assets.non_current_assets
                          .machinery_furniture_equipment,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].assets.non_current_assets
                    .machinery_furniture_equipment
                    ? millify(
                        data[3].assets.non_current_assets
                          .machinery_furniture_equipment,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 p-2 text-xs">Leases</td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].assets.non_current_assets.leases
                    ? millify(data[0].assets.non_current_assets.leases, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].assets.non_current_assets.leases
                    ? millify(data[1].assets.non_current_assets.leases, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].assets.non_current_assets.leases
                    ? millify(data[2].assets.non_current_assets.leases, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].assets.non_current_assets.leases
                    ? millify(data[3].assets.non_current_assets.leases, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 p-2 text-xs">
                Accumulated Depreciation
              </td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].assets.non_current_assets.accumulated_depreciation
                    ? millify(
                        data[0].assets.non_current_assets
                          .accumulated_depreciation,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].assets.non_current_assets.accumulated_depreciation
                    ? millify(
                        data[1].assets.non_current_assets
                          .accumulated_depreciation,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].assets.non_current_assets.accumulated_depreciation
                    ? millify(
                        data[2].assets.non_current_assets
                          .accumulated_depreciation,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].assets.non_current_assets.accumulated_depreciation
                    ? millify(
                        data[3].assets.non_current_assets
                          .accumulated_depreciation,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 p-2 text-xs">
                Intangible Assets
              </td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].assets.non_current_assets.intangible_assets
                    ? millify(
                        data[0].assets.non_current_assets.intangible_assets,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].assets.non_current_assets.intangible_assets
                    ? millify(
                        data[1].assets.non_current_assets.intangible_assets,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].assets.non_current_assets.intangible_assets
                    ? millify(
                        data[2].assets.non_current_assets.intangible_assets,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].assets.non_current_assets.intangible_assets
                    ? millify(
                        data[3].assets.non_current_assets.intangible_assets,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 p-2 text-xs">
                Investments & Advances
              </td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].assets.non_current_assets.investments_and_advances
                    ? millify(
                        data[0].assets.non_current_assets
                          .investments_and_advances,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].assets.non_current_assets.investments_and_advances
                    ? millify(
                        data[1].assets.non_current_assets
                          .investments_and_advances,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].assets.non_current_assets.investments_and_advances
                    ? millify(
                        data[2].assets.non_current_assets
                          .investments_and_advances,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].assets.non_current_assets.investments_and_advances
                    ? millify(
                        data[3].assets.non_current_assets
                          .investments_and_advances,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 p-2 text-xs">
                Other Non Current Assets
              </td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].assets.non_current_assets.other_non_current_assets
                    ? millify(
                        data[0].assets.non_current_assets
                          .other_non_current_assets,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].assets.non_current_assets.other_non_current_assets
                    ? millify(
                        data[1].assets.non_current_assets
                          .other_non_current_assets,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].assets.non_current_assets.other_non_current_assets
                    ? millify(
                        data[2].assets.non_current_assets
                          .other_non_current_assets,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].assets.non_current_assets.other_non_current_assets
                    ? millify(
                        data[3].assets.non_current_assets
                          .other_non_current_assets,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800 bg-neutral-800">
              <td className=" text-white p-2 text-xs">Total Assets</td>
              {data[0] && (
                <td className=" text-white text-xs">
                  {data[0].assets.total_assets
                    ? millify(data[0].assets.total_assets, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-white text-xs">
                  {data[1].assets.total_assets
                    ? millify(data[1].assets.total_assets, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-white text-xs">
                  {data[2].assets.total_assets
                    ? millify(data[2].assets.total_assets, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-white text-xs">
                  {data[3].assets.total_assets
                    ? millify(data[3].assets.total_assets, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-white p-2 text-xs">
                Total Current Liabilities
              </td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].liabilities.current_liabilities
                    .total_current_liabilities
                    ? millify(
                        data[0].liabilities.current_liabilities
                          .total_current_liabilities,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].liabilities.current_liabilities
                    .total_current_liabilities
                    ? millify(
                        data[1].liabilities.current_liabilities
                          .total_current_liabilities,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].liabilities.current_liabilities
                    .total_current_liabilities
                    ? millify(
                        data[2].liabilities.current_liabilities
                          .total_current_liabilities,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].liabilities.current_liabilities
                    .total_current_liabilities
                    ? millify(
                        data[3].liabilities.current_liabilities
                          .total_current_liabilities,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 p-2 text-xs">
                Accounts Payable
              </td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].liabilities.current_liabilities.accounts_payable
                    ? millify(
                        data[0].liabilities.current_liabilities
                          .accounts_payable,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].liabilities.current_liabilities.accounts_payable
                    ? millify(
                        data[1].liabilities.current_liabilities
                          .accounts_payable,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].liabilities.current_liabilities.accounts_payable
                    ? millify(
                        data[2].liabilities.current_liabilities
                          .accounts_payable,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].liabilities.current_liabilities.accounts_payable
                    ? millify(
                        data[3].liabilities.current_liabilities
                          .accounts_payable,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 p-2 text-xs">
                Accrued Expenses
              </td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].liabilities.current_liabilities.accrued_expenses
                    ? millify(
                        data[0].liabilities.current_liabilities
                          .accrued_expenses,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].liabilities.current_liabilities.accrued_expenses
                    ? millify(
                        data[1].liabilities.current_liabilities
                          .accrued_expenses,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].liabilities.current_liabilities.accrued_expenses
                    ? millify(
                        data[2].liabilities.current_liabilities
                          .accrued_expenses,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].liabilities.current_liabilities.accrued_expenses
                    ? millify(
                        data[3].liabilities.current_liabilities
                          .accrued_expenses,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 p-2 text-xs">Short Term Debt</td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].liabilities.current_liabilities.short_term_debt
                    ? millify(
                        data[0].liabilities.current_liabilities.short_term_debt,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].liabilities.current_liabilities.short_term_debt
                    ? millify(
                        data[1].liabilities.current_liabilities.short_term_debt,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].liabilities.current_liabilities.short_term_debt
                    ? millify(
                        data[2].liabilities.current_liabilities.short_term_debt,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].liabilities.current_liabilities.short_term_debt
                    ? millify(
                        data[3].liabilities.current_liabilities.short_term_debt,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 p-2 text-xs">
                Deferred Revenue
              </td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].liabilities.current_liabilities.deferred_revenue
                    ? millify(
                        data[0].liabilities.current_liabilities
                          .deferred_revenue,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].liabilities.current_liabilities.deferred_revenue
                    ? millify(
                        data[1].liabilities.current_liabilities
                          .deferred_revenue,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].liabilities.current_liabilities.deferred_revenue
                    ? millify(
                        data[2].liabilities.current_liabilities
                          .deferred_revenue,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].liabilities.current_liabilities.deferred_revenue
                    ? millify(
                        data[3].liabilities.current_liabilities
                          .deferred_revenue,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 p-2 text-xs">
                Other Current Liabilities
              </td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].liabilities.current_liabilities
                    .other_current_liabilities
                    ? millify(
                        data[0].liabilities.current_liabilities
                          .other_current_liabilities,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].liabilities.current_liabilities
                    .other_current_liabilities
                    ? millify(
                        data[1].liabilities.current_liabilities
                          .other_current_liabilities,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].liabilities.current_liabilities
                    .other_current_liabilities
                    ? millify(
                        data[2].liabilities.current_liabilities
                          .other_current_liabilities,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].liabilities.current_liabilities
                    .other_current_liabilities
                    ? millify(
                        data[3].liabilities.current_liabilities
                          .other_current_liabilities,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 p-2 text-xs">Tax Payable</td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].liabilities.current_liabilities.tax_payable
                    ? millify(
                        data[0].liabilities.current_liabilities.tax_payable,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].liabilities.current_liabilities.tax_payable
                    ? millify(
                        data[1].liabilities.current_liabilities.tax_payable,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].liabilities.current_liabilities.tax_payable
                    ? millify(
                        data[2].liabilities.current_liabilities.tax_payable,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].liabilities.current_liabilities.tax_payable
                    ? millify(
                        data[3].liabilities.current_liabilities.tax_payable,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-white p-2 text-xs">
                Total Non Current Liabilities
              </td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].liabilities.non_current_liabilities
                    .total_non_current_liabilities
                    ? millify(
                        data[0].liabilities.non_current_liabilities
                          .total_non_current_liabilities,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].liabilities.non_current_liabilities
                    .total_non_current_liabilities
                    ? millify(
                        data[1].liabilities.non_current_liabilities
                          .total_non_current_liabilities,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].liabilities.non_current_liabilities
                    .total_non_current_liabilities
                    ? millify(
                        data[2].liabilities.non_current_liabilities
                          .total_non_current_liabilities,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].liabilities.non_current_liabilities
                    .total_non_current_liabilities
                    ? millify(
                        data[3].liabilities.non_current_liabilities
                          .total_non_current_liabilities,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 p-2 text-xs">Long Term Debt</td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].liabilities.non_current_liabilities.long_term_debt
                    ? millify(
                        data[0].liabilities.non_current_liabilities
                          .long_term_debt,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].liabilities.non_current_liabilities.long_term_debt
                    ? millify(
                        data[1].liabilities.non_current_liabilities
                          .long_term_debt,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].liabilities.non_current_liabilities.long_term_debt
                    ? millify(
                        data[2].liabilities.non_current_liabilities
                          .long_term_debt,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].liabilities.non_current_liabilities.long_term_debt
                    ? millify(
                        data[3].liabilities.non_current_liabilities
                          .long_term_debt,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 p-2 text-xs">
                Provision for Risks & Charges
              </td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].liabilities.non_current_liabilities
                    .provision_for_risks_and_charges
                    ? millify(
                        data[0].liabilities.non_current_liabilities
                          .provision_for_risks_and_charges,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].liabilities.non_current_liabilities
                    .provision_for_risks_and_charges
                    ? millify(
                        data[1].liabilities.non_current_liabilities
                          .provision_for_risks_and_charges,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].liabilities.non_current_liabilities
                    .provision_for_risks_and_charges
                    ? millify(
                        data[2].liabilities.non_current_liabilities
                          .provision_for_risks_and_charges,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].liabilities.non_current_liabilities
                    .provision_for_risks_and_charges
                    ? millify(
                        data[3].liabilities.non_current_liabilities
                          .provision_for_risks_and_charges,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 p-2 text-xs">
                Deferred Liabilities
              </td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].liabilities.non_current_liabilities
                    .deferred_liabilities
                    ? millify(
                        data[0].liabilities.non_current_liabilities
                          .deferred_liabilities,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].liabilities.non_current_liabilities
                    .deferred_liabilities
                    ? millify(
                        data[1].liabilities.non_current_liabilities
                          .deferred_liabilities,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].liabilities.non_current_liabilities
                    .deferred_liabilities
                    ? millify(
                        data[2].liabilities.non_current_liabilities
                          .deferred_liabilities,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].liabilities.non_current_liabilities
                    .deferred_liabilities
                    ? millify(
                        data[3].liabilities.non_current_liabilities
                          .deferred_liabilities,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 p-2 text-xs">
                Other Non Current Liabilities
              </td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].liabilities.non_current_liabilities
                    .other_non_current_liabilities
                    ? millify(
                        data[0].liabilities.non_current_liabilities
                          .other_non_current_liabilities,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].liabilities.non_current_liabilities
                    .other_non_current_liabilities
                    ? millify(
                        data[1].liabilities.non_current_liabilities
                          .other_non_current_liabilities,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].liabilities.non_current_liabilities
                    .other_non_current_liabilities
                    ? millify(
                        data[2].liabilities.non_current_liabilities
                          .other_non_current_liabilities,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].liabilities.non_current_liabilities
                    .other_non_current_liabilities
                    ? millify(
                        data[3].liabilities.non_current_liabilities
                          .other_non_current_liabilities,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 p-2 text-xs">
                Long Term Provisions
              </td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].liabilities.non_current_liabilities
                    .long_term_provisions
                    ? millify(
                        data[0].liabilities.non_current_liabilities
                          .long_term_provisions,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].liabilities.non_current_liabilities
                    .long_term_provisions
                    ? millify(
                        data[1].liabilities.non_current_liabilities
                          .long_term_provisions,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].liabilities.non_current_liabilities
                    .long_term_provisions
                    ? millify(
                        data[2].liabilities.non_current_liabilities
                          .long_term_provisions,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].liabilities.non_current_liabilities
                    .long_term_provisions
                    ? millify(
                        data[3].liabilities.non_current_liabilities
                          .long_term_provisions,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800 bg-neutral-800">
              <td className=" text-white p-2 text-xs">Total Liabilities</td>
              {data[0] && (
                <td className=" text-white text-xs">
                  {data[0].liabilities.total_liabilities
                    ? millify(data[0].liabilities.total_liabilities, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-white text-xs">
                  {data[1].liabilities.total_liabilities
                    ? millify(data[1].liabilities.total_liabilities, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-white text-xs">
                  {data[2].liabilities.total_liabilities
                    ? millify(data[2].liabilities.total_liabilities, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-white text-xs">
                  {data[3].liabilities.total_liabilities
                    ? millify(data[3].liabilities.total_liabilities, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 p-2 text-xs">Common Stock</td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].shareholders_equity.common_stock
                    ? millify(data[0].shareholders_equity.common_stock, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].shareholders_equity.common_stock
                    ? millify(data[1].shareholders_equity.common_stock, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].shareholders_equity.common_stock
                    ? millify(data[2].shareholders_equity.common_stock, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].shareholders_equity.common_stock
                    ? millify(data[3].shareholders_equity.common_stock, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 p-2 text-xs">
                Retained Eearnings
              </td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].shareholders_equity.retained_earnings
                    ? millify(data[0].shareholders_equity.retained_earnings, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].shareholders_equity.retained_earnings
                    ? millify(data[1].shareholders_equity.retained_earnings, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].shareholders_equity.retained_earnings
                    ? millify(data[2].shareholders_equity.retained_earnings, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].shareholders_equity.retained_earnings
                    ? millify(data[3].shareholders_equity.retained_earnings, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 p-2 text-xs">
                Other Shareholder Equity
              </td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].shareholders_equity.other_shareholders_equity
                    ? millify(
                        data[0].shareholders_equity.other_shareholders_equity,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].shareholders_equity.other_shareholders_equity
                    ? millify(
                        data[1].shareholders_equity.other_shareholders_equity,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].shareholders_equity.other_shareholders_equity
                    ? millify(
                        data[2].shareholders_equity.other_shareholders_equity,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].shareholders_equity.other_shareholders_equity
                    ? millify(
                        data[3].shareholders_equity.other_shareholders_equity,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 p-2 text-xs">
                Additional Paid in Capital
              </td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].shareholders_equity.additional_paid_in_capital
                    ? millify(
                        data[0].shareholders_equity.additional_paid_in_capital,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].shareholders_equity.additional_paid_in_capital
                    ? millify(
                        data[1].shareholders_equity.additional_paid_in_capital,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].shareholders_equity.additional_paid_in_capital
                    ? millify(
                        data[2].shareholders_equity.additional_paid_in_capital,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].shareholders_equity.additional_paid_in_capital
                    ? millify(
                        data[3].shareholders_equity.additional_paid_in_capital,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 p-2 text-xs">Treasury Stock</td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].shareholders_equity.treasury_stock
                    ? millify(data[0].shareholders_equity.treasury_stock, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].shareholders_equity.treasury_stock
                    ? millify(data[1].shareholders_equity.treasury_stock, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].shareholders_equity.treasury_stock
                    ? millify(data[2].shareholders_equity.treasury_stock, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].shareholders_equity.treasury_stock
                    ? millify(data[3].shareholders_equity.treasury_stock, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800">
              <td className=" text-neutral-300 p-2 text-xs">
                Minority Interest
              </td>
              {data[0] && (
                <td className=" text-neutral-300 text-xs">
                  {data[0].shareholders_equity.minority_interest
                    ? millify(data[0].shareholders_equity.minority_interest, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-neutral-300 text-xs">
                  {data[1].shareholders_equity.minority_interest
                    ? millify(data[1].shareholders_equity.minority_interest, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-neutral-300 text-xs">
                  {data[2].shareholders_equity.minority_interest
                    ? millify(data[2].shareholders_equity.minority_interest, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-neutral-300 text-xs">
                  {data[3].shareholders_equity.minority_interest
                    ? millify(data[3].shareholders_equity.minority_interest, {
                        precision: 2,
                        space: true,
                      })
                    : "-"}
                </td>
              )}
            </tr>
            <tr className="border-b border-neutral-800 bg-neutral-800">
              <td className=" text-white p-2 text-xs">
                Total Shareholder Equity
              </td>
              {data[0] && (
                <td className=" text-white text-xs">
                  {data[0].shareholders_equity.total_shareholders_equity
                    ? millify(
                        data[0].shareholders_equity.total_shareholders_equity,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[1] && (
                <td className=" text-white text-xs">
                  {data[1].shareholders_equity.total_shareholders_equity
                    ? millify(
                        data[1].shareholders_equity.total_shareholders_equity,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[2] && (
                <td className=" text-white text-xs">
                  {data[2].shareholders_equity.total_shareholders_equity
                    ? millify(
                        data[2].shareholders_equity.total_shareholders_equity,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
              {data[3] && (
                <td className=" text-white text-xs">
                  {data[3].shareholders_equity.total_shareholders_equity
                    ? millify(
                        data[3].shareholders_equity.total_shareholders_equity,
                        { precision: 2, space: true }
                      )
                    : "-"}
                </td>
              )}
            </tr>
          </tbody>
        </table>
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

export default Balance;
