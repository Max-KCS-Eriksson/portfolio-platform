import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";
import { CoreContext } from "../../context/CoreContext";
import Header from "./Header";

function renderHeader() {
  return render(
    <CoreContext.Provider value={{ coreContext: { domainName: "example.dev" }, error: null, isLoading: false }}>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </CoreContext.Provider>,
  );
}

describe("Header", () => {
  test("renders the domain home link", () => {
    renderHeader();

    expect(screen.getByRole("link", { name: "example.dev" })).toHaveAttribute("href", "/");
  });

  test("toggles and closes the mobile menu", () => {
    const { container } = renderHeader();
    const button = screen.getByRole("button", { name: "Toggle navigation menu" });

    fireEvent.click(button);

    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(container.querySelector(".nav-menu")).toHaveClass("active");

    fireEvent.click(screen.getByRole("link", { name: "Portfolio" }));

    expect(button).toHaveAttribute("aria-expanded", "false");
  });
});
