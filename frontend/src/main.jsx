import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ContextDataProvider } from "./context/ContextDataProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ContextDataProvider>
      <App />
    </ContextDataProvider>
  </StrictMode>,
);
