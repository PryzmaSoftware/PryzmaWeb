import axios from "axios";
import { useEffect, useState, useContext } from "react";
import SymbolContext from "../SymbolContext";

const CompanyProfile = ({ setCompanyProfile, isLoading }) => {
  // get symbol from context provider
  const { symbol } = useContext(SymbolContext);

  // this state will hold the company profile data
  // the data that we will map through and display to the user
  const [data, setData] = useState();

  // this will call the function above on component load to fetch
  // the company profile data
  // it is set to run everytime the symbol changes
  useEffect(() => {
    const getData = async () => {
      // check if there is a symbol
      if (!symbol) return;
      // we set the company profile to false
      // so we can show they skeleton loading
      setCompanyProfile(false);
      setData();
      const response = await axios.post("/api/get-company-profile", {
        symbol: symbol[0],
      });
      if (response) {
        // set the data so we can map it out to the user
        setData(response.data);
        // set the company profile to loaded so the main component
        // knows when it can show everything together
        // and stop the skeleton loader
        setCompanyProfile(true);
      }
    };
    getData();
  }, [symbol]);

  if (isLoading || !data)
    return (
      <div className="w-full h-[400px] mr-6">
        <div className="p-4 w-full max-w-[200px] rounded-md bg-neutral-800 animate-pulse"></div>
        <div className="flex">
          <div className="w-full mr-6 max-w-[300px]">
            <div className="p-2 w-full rounded-md bg-neutral-800 animate-pulse mt-2"></div>
            <div className="p-2 w-full rounded-md bg-neutral-800 animate-pulse mt-2"></div>
            <div className="p-2 w-full rounded-md bg-neutral-800 animate-pulse mt-2"></div>
            <div className="p-2 w-full rounded-md bg-neutral-800 animate-pulse mt-2"></div>
            <div className="p-2 w-full rounded-md bg-neutral-800 animate-pulse mt-2"></div>
          </div>
          <div className="w-full max-w-[300px]">
            <div className="p-2 w-full rounded-md bg-neutral-800 animate-pulse mt-2"></div>
            <div className="p-2 w-full rounded-md bg-neutral-800 animate-pulse mt-2"></div>
            <div className="p-2 w-full rounded-md bg-neutral-800 animate-pulse mt-2"></div>
            <div className="p-2 w-full rounded-md bg-neutral-800 animate-pulse mt-2"></div>
            <div className="p-2 w-full rounded-md bg-neutral-800 animate-pulse mt-2"></div>
          </div>
        </div>
        <div className="p-2 rounded-md bg-neutral-800 animate-pulse mt-6"></div>
        <div className="p-2 rounded-md bg-neutral-800 animate-pulse mt-3"></div>
        <div className="p-2 rounded-md bg-neutral-800 animate-pulse mt-3"></div>
        <div className="p-2 rounded-md bg-neutral-800 animate-pulse mt-3"></div>
      </div>
    );

  return (
    <div className="w-full mr-8 animate-fadeIn opacity-0">
      {/* <p className="p-4 pl-0 text-neutral-300 text-xl flex items-center">
        <Image src={profile} height={30} width={30} />
        <span className="ml-4">Company Profile</span>
      </p> */}
      <div className="rounded-md ">
        <p className="items-center flex p-2 pl-0 text-lg text-white font-medium border-b border-neutral-800">
          <span>Company Profile</span>
        </p>
        <div className="flex">
          <div className="mr-12">
            <div className="flex py-2 items-center border-b border-zinc-800 justify-between">
              <p className="text-white text-xs">Symbol</p>
              <p className="text-xs text-neutral-300 truncate">
                {data.symbol ? data.symbol : "-"}
              </p>
            </div>
            <div className="flex py-2 items-center border-b border-zinc-800 justify-between">
              <p className="text-white text-xs min-w-[96px]">Exchange</p>
              <p className="text-xs text-neutral-300 truncate justify-between">
                {data.exchange ? data.exchange : "-"}
              </p>
            </div>
            <div className="flex py-2 items-center justify-between border-b border-zinc-800">
              <p className="text-white text-xs min-w-[96px]">Company</p>
              <p className="text-xs text-neutral-300 truncate">
                {data.name ? data.name : "-"}
              </p>
            </div>
            <div className="flex py-2 items-center justify-between border-b border-zinc-800">
              <p className="text-white text-xs min-w-[96px]">Industry</p>
              <p className="text-xs text-neutral-300 truncate">
                {data.industry ? data.industry : "-"}
              </p>
            </div>
            <div className="flex py-2 items-center justify-between border-b border-zinc-800">
              <p className="text-white text-xs min-w-[96px]">Sector</p>
              <p className="text-xs text-neutral-300 truncate">
                {data.sector ? data.sector : "-"}
              </p>
            </div>
          </div>
          <div>
            <div className="flex py-2 items-center justify-between border-b border-zinc-800">
              <p className="text-white text-xs min-w-[96px]">Website</p>
              <p className="text-xs text-neutral-300 truncate">
                {data.website ? data.website : "-"}
              </p>
            </div>
            <div className="flex py-2 items-center justify-between border-b border-zinc-800">
              <p className="text-white text-xs min-w-[96px]">Employees</p>
              <p className="text-xs text-neutral-300 truncate">
                {data.employees ? data.employees.toLocaleString("en-us") : "-"}
              </p>
            </div>
            <div className="flex py-2 items-center justify-between border-b border-zinc-800">
              <p className="text-white text-xs min-w-[96px]">Country</p>
              <p className="text-xs text-neutral-300 truncate">
                {data.country ? data.country : "-"}
              </p>
            </div>
            <div className="flex py-2 items-center justify-between border-b border-zinc-800">
              <p className="text-white text-xs min-w-[96px]">City</p>
              <p className="text-xs text-neutral-300 truncate">
                {data.city ? data.city : "-"}
              </p>
            </div>
            <div className="flex py-2 items-center justify-between border-b border-zinc-800">
              <p className="text-white text-xs min-w-[96px]">Address</p>
              <p className="text-xs text-neutral-300 truncate">
                {data.address ? data.address : "-"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex py-2 mt-4">
          <p className="text-xs font-light text-neutral-300 leading-6 tracking-wide">
            {data.description ? data.description : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;

{
  /* <div className="flex p-4">
    <div className="w-full">
      <div></div>
      <div className="w-fit flex text-sm"><p className="text-white mr-2">Symbol</p><p>{data.symbol}</p></div>
      <div className="w-fit flex text-sm"><p className="text-white mr-2">Exchange</p><p>{data.exchange}</p></div>
      <div className="w-fit flex text-sm"><p className="text-white mr-2">Company Name</p><p>{data.companyName}</p></div>
      <div className="w-fit flex text-sm"><p className="text-white mr-2">Industry</p><p>{data.industry}</p></div>
      <div className="w-fit flex text-sm"><p className="text-white mr-2">Sector</p><p>{data.sector}</p></div>
    </div>
    <div className="w-full">
      <div className="w-fit flex text-sm"><p className="text-white">Website</p><a href={`https://${data.website}`} target="_blank" rel="noreferrer">{data.website}</a></div>
      <div className="w-fit flex text-sm"><p className="text-white">Employees</p><p>{data.employees}</p></div>
      <div className="w-fit flex text-sm"><p className="text-white">Address</p><p>{data.address}</p></div>
      <div className="w-fit flex text-sm"><p className="text-white">City</p><p>{data.city}</p></div>
      <div className="w-fit flex text-sm"><p className="text-white">Country</p><p>{data.country}</p></div>
    </div>
    </div> */
}
