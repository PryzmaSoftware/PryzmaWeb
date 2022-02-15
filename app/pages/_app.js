import { GeistProvider, CssBaseline } from "@geist-ui/core";
import { useState, useContext } from "react";
import Nav from "../components/Nav";
import ThemeContext from "../components/ThemeContext";

const App = ({ Component, pageProps }) => {
  const [themeType, setThemeType] = useState("dark");

  return (
    <ThemeContext.Provider value={{ themeType }}>
      <GeistProvider themeType={themeType}>
        <CssBaseline />
        <Nav themeType={themeType} setThemeType={setThemeType} />
        <Component {...pageProps} />
      </GeistProvider>
    </ThemeContext.Provider>
  );
};

export default App;
