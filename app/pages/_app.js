import { GeistProvider, CssBaseline } from "@geist-ui/core";
import { useState } from "react";
import Nav from "../components/Nav";

const App = ({ Component, pageProps }) => {
  const [themeType, setThemeType] = useState("dark");

  return (
    <GeistProvider themeType={themeType}>
      <CssBaseline />
      <Nav themeType={themeType} setThemeType={setThemeType} />
      <Component {...pageProps} />
    </GeistProvider>
  );
};

export default App;
