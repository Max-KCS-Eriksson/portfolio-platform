import { useEffect, useState } from "react";
import { getCoreContext } from "../api/coreApi";
import { CoreContext } from "./CoreContext";

/**
 * Provide core context data loaded from the API.
 *
 * @param {object} props
 * @param {import("react").ReactNode} props.children
 * Child tree that can read core context through `useCoreContext`.
 */
export function CoreContextProvider({ children }) {
  const [coreContext, setCoreContext] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCoreContext()
      .then(setCoreContext)
      .catch((error) => {
        console.error(error);
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return <CoreContext.Provider value={{ coreContext, error, isLoading }}>{children}</CoreContext.Provider>;
}
