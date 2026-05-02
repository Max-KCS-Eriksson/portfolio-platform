import { useEffect } from "react";
import { useFrontendContext } from "../context/useFrontendContext";

export function usePageTitle(pageTitle) {
  const { contextData } = useFrontendContext();

  useEffect(() => {
    const domainName = contextData?.domain_name;

    if (!domainName) {
      return;
    }

    document.title = pageTitle ? `${pageTitle} | ${domainName}` : domainName;
  }, [pageTitle, contextData?.domain_name]);
}
