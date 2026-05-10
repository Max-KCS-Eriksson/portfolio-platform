import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { CoreContext } from "../../context/CoreContext";
import Footer from "./Footer";

describe("Footer", () => {
  test("renders copyright and social links from core context", () => {
    render(
      <CoreContext.Provider
        value={{
          coreContext: {
            siteOwner: "Example Owner",
            socialMediaLinks: [{ id: 1, socialMedia: "gh", url: "https://github.com/example" }],
          },
          error: null,
          isLoading: false,
        }}
      >
        <Footer />
      </CoreContext.Provider>,
    );

    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} Example Owner`))).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/example");
  });
});
