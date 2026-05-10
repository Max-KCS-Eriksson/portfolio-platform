import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import Status404Page from "./Status404Page";
import Status500Page from "./Status500Page";

vi.mock("../hooks/usePageTitle", () => ({
  usePageTitle: vi.fn(),
}));

describe("status pages", () => {
  test("renders the 404 status page", () => {
    render(<Status404Page />);

    expect(screen.getByRole("heading", { name: "Requested page can't be found" })).toBeInTheDocument();
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  test("renders the 500 status page", () => {
    render(<Status500Page />);

    expect(screen.getByRole("heading", { name: "There has been an internal error" })).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
  });
});
