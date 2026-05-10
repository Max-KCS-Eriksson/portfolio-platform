import { useContext } from "react";
import { CoreContext } from "./CoreContext";

export function useCoreContext() {
  const value = useContext(CoreContext);

  if (!value) {
    throw new Error("useCoreContext must be used inside CoreContextProvider");
  }

  return value;
}
