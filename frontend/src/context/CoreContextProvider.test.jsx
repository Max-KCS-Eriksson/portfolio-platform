import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { getCoreContext } from "../api/coreApi";
import { CoreContextProvider } from "./CoreContextProvider";
import { useCoreContext } from "./useCoreContext";

vi.mock("../api/coreApi", () => ({
  getCoreContext: vi.fn(),
}));

function ContextState() {
  const { coreContext, error, isLoading } = useCoreContext();

  if (isLoading) {
    return <p>Loading</p>;
  }

  if (error) {
    return <p>Failed</p>;
  }

  return <p>{coreContext.domainName}</p>;
}

describe("CoreContextProvider", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("loads and provides core context", async () => {
    getCoreContext.mockResolvedValue({ domainName: "example.dev" });

    render(
      <CoreContextProvider>
        <ContextState />
      </CoreContextProvider>,
    );

    expect(screen.getByText("Loading")).toBeInTheDocument();
    expect(await screen.findByText("example.dev")).toBeInTheDocument();
  });

  test("provides error state when core context loading fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    getCoreContext.mockRejectedValue(new Error("Failed"));

    render(
      <CoreContextProvider>
        <ContextState />
      </CoreContextProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText("Failed")).toBeInTheDocument();
    });

    console.error.mockRestore();
  });
});
