import { createContext, useEffect, useState } from "react";

const ContextConfig = createContext();

/**
 * Provides context data fetched from the `/api/context` endpoint to its
 * children.
 */
export default function ContextProvider({ children }) {
  const [context, setContext] = useState(null);

  useEffect(() => {
    fetch("/api/context")
      .then((response) => response.json())
      .then((data) => setContext(data));
  }, []);

  if (!context) return null;

  return (
    <ContextConfig.Provider value={context}>{children}</ContextConfig.Provider>
  );
}
