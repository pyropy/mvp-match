import * as React from "react";
import { Link } from "react-router-dom";

import Layout from "./components/Layout";

const App = (props: AppProps) => {
  return (
    <Layout>
      <>
        <h1>Hello World</h1>
        <Link to="/auth">Authenticate</Link>
      </>
    </Layout>
  );
};

interface AppProps {}

export default App;
