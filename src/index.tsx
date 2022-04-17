import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "antd/dist/antd.css";
import "./global.css";

if (new URLSearchParams(window.location.search).get("mode") == "pwa") {
  const container = document.getElementById("root") as HTMLDivElement;
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  (document.getElementById("no-pwa") as HTMLDivElement).style.display = "block";
}
