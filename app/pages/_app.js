import { GeistProvider, CssBaseline } from "@geist-ui/core";
import Nav from "../components/Nav";

const App = ({ Component, pageProps }) => {
  return (
    <GeistProvider themeType="dark">
      <CssBaseline />
      <Nav />
      <Component {...pageProps} />
    </GeistProvider>
  );
};

export default App;
