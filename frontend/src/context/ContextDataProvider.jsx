import { useEffect, useState } from "react";
import { getContextData } from "../api/coreApi";
import { ContextData } from "./ContextData";

/**
 * Provide site-wide context data loaded from the API.
 *
 * @param {object} props
 * @param {import("react").ReactNode} props.children
 * Child tree that can read context data through `useContextData`.
 */
export function ContextDataProvider({ children }) {
  const [contextData, setContextData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getContextData()
      .then(setContextData)
      .catch((error) => {
        console.error(error);
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return <ContextData.Provider value={{ contextData, error, isLoading }}>{children}</ContextData.Provider>;
}
