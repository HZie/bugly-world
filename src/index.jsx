import React from "react";
import ReactDOM from "react-dom/client";
import App from "./screens/App";
import { AgentProvider } from "./contexts/AgentContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AgentProvider>
    <App />
  </AgentProvider>
);
