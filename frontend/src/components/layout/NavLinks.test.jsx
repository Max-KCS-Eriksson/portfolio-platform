import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";
import NavLinks from "./NavLinks";

function renderNavLinks(path = "/portfolio/", props = {}) {
  const onNavigate = vi.fn();

  const renderResult = render(
    <MemoryRouter initialEntries={[path]}>
      <NavLinks isMenuOpen={false} onNavigate={onNavigate} {...props} />
    </MemoryRouter>,
  );

  return { onNavigate, ...renderResult };
}

describe("NavLinks", () => {
  test("marks the current route", () => {
    renderNavLinks("/portfolio/");

    expect(screen.getByRole("link", { name: "Portfolio" })).toHaveClass("current");
  });

  test("hides the home link on the home page", () => {
    renderNavLinks("/");

    expect(screen.queryByRole("link", { name: "Home" })).not.toBeInTheDocument();
  });

  test("calls onNavigate when a link is clicked", () => {
    const { onNavigate } = renderNavLinks("/portfolio/");

    fireEvent.click(screen.getByRole("link", { name: "About" }));

    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  test("applies active class when the menu is open", () => {
    const { container } = renderNavLinks("/portfolio/", { isMenuOpen: true });

    expect(container.querySelector(".nav-menu")).toHaveClass("active");
  });
});
