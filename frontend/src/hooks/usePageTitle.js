import { useEffect } from "react";
import { useCoreContext } from "../context/useCoreContext";

export function usePageTitle(pageTitle) {
  const { coreContext } = useCoreContext();

  useEffect(() => {
    const domainName = coreContext?.domainName;

    if (!domainName) {
      return;
    }

    document.title = pageTitle ? `${pageTitle} | ${domainName}` : domainName;
  }, [pageTitle, coreContext?.domainName]);
}
