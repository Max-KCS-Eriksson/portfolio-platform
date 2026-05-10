import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { CoreContextProvider } from "./context/CoreContextProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CoreContextProvider>
      <App />
    </CoreContextProvider>
  </StrictMode>,
);
