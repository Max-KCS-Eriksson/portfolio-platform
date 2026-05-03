import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { FrontendContextProvider } from "./context/FrontendContextProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <FrontendContextProvider>
      <App />
    </FrontendContextProvider>
  </StrictMode>,
);
