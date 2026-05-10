import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { CoreContext } from "../context/CoreContext";
import { usePageTitle } from "./usePageTitle";

function PageTitleHarness({ pageTitle }) {
  usePageTitle(pageTitle);
  return null;
}

function renderWithCoreContext(pageTitle, coreContext = { domainName: "example.dev" }) {
  return render(
    <CoreContext.Provider value={{ coreContext, error: null, isLoading: false }}>
      <PageTitleHarness pageTitle={pageTitle} />
    </CoreContext.Provider>,
  );
}

describe("usePageTitle", () => {
  test("sets a page-specific document title with the domain name", () => {
    renderWithCoreContext("Portfolio");

    expect(document.title).toBe("Portfolio | example.dev");
  });

  test("sets the document title to the domain name when no page title is provided", () => {
    renderWithCoreContext("");

    expect(document.title).toBe("example.dev");
  });

  test("leaves the current document title unchanged until the domain name is available", () => {
    document.title = "Existing title";

    renderWithCoreContext("Portfolio", null);

    expect(document.title).toBe("Existing title");
  });
});
