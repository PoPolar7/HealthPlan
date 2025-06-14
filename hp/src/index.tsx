import React from "react";
import ReactDOM from "react-dom/client";
import './index.css';
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement // ← 수정됨
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
