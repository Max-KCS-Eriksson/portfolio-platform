import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, test } from "vitest";
import { CoreContext } from "../../context/CoreContext";
import Layout from "./Layout";

describe("Layout", () => {
  test("renders header, breadcrumb, outlet content, and footer", () => {
    render(
      <CoreContext.Provider
        value={{
          coreContext: {
            domainName: "Example.dev",
            siteOwner: "Example Owner",
            socialMediaLinks: [],
          },
          error: null,
          isLoading: false,
        }}
      >
        <MemoryRouter initialEntries={["/portfolio/"]}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/portfolio/" element={<p>Outlet content</p>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </CoreContext.Provider>,
    );

    expect(screen.getByRole("link", { name: "Example.dev" })).toHaveAttribute("href", "/");
    expect(screen.getByText("guest@example.dev")).toBeInTheDocument();
    expect(screen.getByText("~/portfolio/")).toBeInTheDocument();
    expect(screen.getByText("Outlet content")).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} Example Owner`))).toBeInTheDocument();
  });
});
