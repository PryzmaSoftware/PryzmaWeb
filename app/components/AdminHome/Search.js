import { Search as MagnifyGlass } from "react-bootstrap-icons";
import { useRouter } from "next/router";
import { useDebounce } from "use-debounce";
import { Dash } from "react-bootstrap-icons";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import ButtonSpinner from "../ButtonSpinner";
import { useDetectClickOutside } from "react-detect-click-outside";
import SymbolContext from "../SymbolContext";
import { useForm } from "react-hook-form";

const Search = () => {
  const { register, handleSubmit, reset } = useForm();

  // symbol context
  const { setSymbol } = useContext(SymbolContext);

  const [text, setText] = useState();
  const [value] = useDebounce(text, 500);
  const [results, setResults] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  // function to close search div when clicked outside
  const closeDropDown = () => {
    setResults();
    setText();
    reset();
  };

  const ref = useDetectClickOutside({ onTriggered: closeDropDown });

  // when the user presses enter
  // get the value of the input and run an api call
  const onSubmit = async (data) => {
    // right when we press enter we want to erase text and results
    setText();
    setResults();
    // this variable is to check if we get a match
    // from the user input to any ticker from the response
    let match = false;
    // if we have input make the api call and check
    if (data.input) {
      // set issubmitting to true to show the user its working
      setIsSubmitting(true);
      // make the search / auto complete call
      const response = await axios.get(
        `https://cloud.iexapis.com/stable/search/${data.input}?token=pk_ca6a1d7ec33745b1bfeb585df0bbf978`
      );
      // go through the response to see if any of the symbols match the users input
      response.data.forEach((element) => {
        // if match then set the context symbol and set the match true
        if (element.symbol === data.input.toUpperCase()) {
          if (element.exchange === "OTCM") return;
          if (
            !element.type === "cs" ||
            !element.type === "ad" ||
            element.exchange === "OTCM" ||
            element.symbol.includes("-")
          )
            return;
          setSymbol([element.symbol, element.name]);
          match = true;
          setIsSubmitting(false);
          reset();
          // if user is on home page and there is a match
          // we want to redirect them to the overview page
          // so they can see what they just searched
          if (
            router.pathname.endsWith("/admin") ||
            (router.pathname.endsWith("/movers") && match)
          ) {
            router.push("/admin/overview");
          }
        }
        // if there is no match, notify the user
        if (match === false) setIsSubmitting(false);
      });
    }
  };

  // fetch results when user is done typing
  useEffect(() => {
    if (!value) return setText();
    const getSearchResults = async () => {
      const response = await axios.get(
        `https://cloud.iexapis.com/stable/search/${value}?token=pk_ca6a1d7ec33745b1bfeb585df0bbf978`
      );
      setResults(response.data);
    };
    getSearchResults();
  }, [value]);

  // when a user is typing set results to null
  // so that it will show the spinner component
  useEffect(() => {
    setResults();
  }, [text, value]);

  // when a user clicks a result
  const handleResultClick = (e) => {
    // set the symbol to the selected option
    setSymbol(e.target.value.split(","));
    // reset the input
    reset();
    // if the user is on the home page
    // we will redirect them to the overview page
    // so they can see what they just searched
    if (
      router.pathname.endsWith("/admin") ||
      router.pathname.endsWith("/movers")
    )
      return router.push("/admin/overview");
  };

  if (
    router.pathname.endsWith("/manage-account") ||
    router.pathname.endsWith("/subscription-created") ||
    router.pathname.endsWith("/subscription-deleted")
  )
    return <div></div>;

  return (
    <div className=" w-1/2 max-w-lg relative">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg relative"
        ref={ref}
      >
        <input
          {...register("input", { onChange: (e) => setText(e.target.value) })}
          autoComplete="off"
          type="text"
          placeholder="Search Symbol or Company Name..."
          className="bg-black text-sm p-2 w-full transition-all placeholder:text-neutral-500 border-neutral-700 border font-medium text-white focus:border-white duration-300 rounded-md outline-none pr-10"
        />
        <button type="submit">
          {isSubmitting ? (
            <div className="absolute right-4 bottom-2.5 z-10">
              <ButtonSpinner />
            </div>
          ) : (
            <MagnifyGlass className="text-neutral-500 absolute right-4 bottom-2.5 z-10 text-xl hover:text-white transition-all" />
          )}
        </button>
      </form>
      {results || text ? (
        <div className="absolute w-full bg-neutral-800 shadow-xl shadow-black/50 rounded-md mt-2 overflow-hidden opacity-0 translate-y-2 animate-fadeInUpFast">
          {results?.length ? (
            results.map((element, index) => {
              if (element.exchange === "OTCM") return;
              if (
                (element.type !== "cs" && element.type !== "ad") ||
                element.symbol.includes("-")
              )
                return;
              return (
                <button
                  onClick={handleResultClick}
                  key={index}
                  value={[element.symbol, element.name]}
                  className="w-full hover:bg-neutral-900 flex p-3 items-center transition duration-200 cursor-pointer"
                >
                  <p className="text-xs py-1 px-2 bg-neutral-700 rounded-md text-white pointer-events-none tracking-wider mr-2">
                    {element.symbol}
                  </p>
                  {/* <Dash className="text-neutral-300 pointer-events-none" /> */}
                  <p className="text-neutral-300 text-xs pointer-events-none">
                    {element.securityName}
                  </p>
                </button>
              );
            })
          ) : (
            <div className="p-6 flex justify-center items-center">
              <ButtonSpinner />
            </div>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Search;
