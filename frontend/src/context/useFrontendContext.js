import { useContext } from "react";
import { FrontendContext } from "./FrontendContext";

export function useFrontendContext() {
  const value = useContext(FrontendContext);

  if (!value) {
    throw new Error(
      "useFrontendContext must be used inside FrontendContextProvider",
    );
  }

  return value;
}
