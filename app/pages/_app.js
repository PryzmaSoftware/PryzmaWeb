import Nav from "../components/Nav";
import "../styles/globals.css";
import { GeistProvider, CssBaseline } from "@geist-ui/react";

const App = ({ Component, pageProps }) => {
  return (
    <GeistProvider>
      <CssBaseline />
      <Nav />
      <Component {...pageProps} />
    </GeistProvider>
  );
};

export default App;
