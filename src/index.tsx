import React from "react";
import ReactDOM from "react-dom";
import { AuthPovider } from "./contexts/AuthContext";
import "./index.css";
import Routes from "./Routes";

ReactDOM.render(
  <React.StrictMode>
    <AuthPovider>
      <Routes />
    </AuthPovider>
  </React.StrictMode>,
  document.getElementById("root")
);
