import * as React from "react";
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./components/App";
import { AuthPage } from "./pages/Auth";
import "./scss/app";

render(
  <App />
  document.getElementById("root")
);
