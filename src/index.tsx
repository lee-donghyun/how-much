import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "antd/dist/antd.css";
import "./global.css";

if (new URLSearchParams(window.location.search).get("mode") == "pwa") {
  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
  );
} else {
  (document.getElementById("no-pwa") as HTMLDivElement).style.display = "block";
}
