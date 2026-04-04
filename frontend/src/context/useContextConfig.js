import { useContext } from "react";
import ContextProvider from "./ContextProvider";

/** Hook providing data from the `/api/context` endpoint. */
export default function useContextConfig() {
  const context = useContext(ContextProvider);

  if (!context) {
    throw new Error(
      "`useContextConfig` must be used withing a `ContextProvider`",
    );
  }
  return context;
}
