import * as React from "react";
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import { AuthPage } from "./pages/Auth";
import "./scss/app";

render(
  <BrowserRouter>
    <Routes>
        <Route path="/" element={<App />} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="products" element={<App />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
