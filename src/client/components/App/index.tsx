import * as React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  RouteProps,
  Navigate,
} from "react-router-dom";

import AuthPage from "../AuthPage";
import Home from "../HomePage";

const App = (props: AppProps) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="auth" element={<AuthPage />} />
        <Route
          path="products"
          element={
            <VendorOnlyRoute>
              <AuthPage />
            </VendorOnlyRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

const useAuth = () => ({ vendor: false, loggedIn: true });

const VendorOnlyRoute = ({ children }: RouteProps): JSX.Element => {
  const auth = useAuth();

  return <>{auth.vendor && auth.loggedIn ? children : <Navigate to="/" />}</>;
};

interface AppProps {}

export default App;
