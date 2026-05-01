import { useEffect, useState } from "react";
import { getFrontendContext } from "../api/coreApi";
import { FrontendContext } from "./FrontendContext";

export function FrontendContextProvider({ children }) {
  const [contextData, setContextData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getFrontendContext()
      .then(setContextData)
      .catch((error) => {
        console.error(error);
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <FrontendContext.Provider value={{ contextData, error, isLoading }}>
      {children}
    </FrontendContext.Provider>
  );
}
