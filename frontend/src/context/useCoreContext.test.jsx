import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { CoreContext } from "./CoreContext";
import { useCoreContext } from "./useCoreContext";

function ContextConsumer() {
  const { coreContext } = useCoreContext();
  return <p>{coreContext.domainName}</p>;
}

describe("useCoreContext", () => {
  test("returns context values from CoreContext", () => {
    render(
      <CoreContext.Provider value={{ coreContext: { domainName: "example.dev" }, error: null, isLoading: false }}>
        <ContextConsumer />
      </CoreContext.Provider>,
    );

    expect(screen.getByText("example.dev")).toBeInTheDocument();
  });

  test("throws when used outside CoreContextProvider", () => {
    expect(() => render(<ContextConsumer />)).toThrow("useCoreContext must be used inside CoreContextProvider");
  });
});
