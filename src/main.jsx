import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
// import App from "./App.jsx";
const App = lazy(() => import("./App.jsx"));
import "./index.css";

const rootKey = "__quarterlyReportReactRoot";
const root = window[rootKey] ?? ReactDOM.createRoot(document.getElementById("root"));
window[rootKey] = root;

root.render(
  <React.StrictMode>
    <Suspense>
      <App />
    </Suspense>
  </React.StrictMode>
);
