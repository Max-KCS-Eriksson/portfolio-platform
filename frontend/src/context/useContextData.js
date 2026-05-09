import { useContext } from "react";
import { ContextData } from "./ContextData";

export function useContextData() {
  const value = useContext(ContextData);

  if (!value) {
    throw new Error("useContextData must be used inside ContextDataProvider");
  }

  return value;
}
