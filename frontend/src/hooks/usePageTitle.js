import { useEffect } from "react";
import { useContextData } from "../context/useContextData";

export function usePageTitle(pageTitle) {
  const { contextData } = useContextData();

  useEffect(() => {
    const domainName = contextData?.domainName;

    if (!domainName) {
      return;
    }

    document.title = pageTitle ? `${pageTitle} | ${domainName}` : domainName;
  }, [pageTitle, contextData?.domainName]);
}
