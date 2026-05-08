import { useEffect } from "react";
import { useFrontendContext } from "../context/useFrontendContext";

export function usePageTitle(pageTitle) {
  const { contextData } = useFrontendContext();

  useEffect(() => {
    const domainName = contextData?.domainName;

    if (!domainName) {
      return;
    }

    document.title = pageTitle ? `${pageTitle} | ${domainName}` : domainName;
  }, [pageTitle, contextData?.domainName]);
}
