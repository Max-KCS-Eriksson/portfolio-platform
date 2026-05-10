import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { CoreContext } from "../../context/CoreContext";
import SocialMediaLinks from "./SocialMediaLinks";

function renderWithCoreContext(ui, socialMediaLinks = []) {
  return render(
    <CoreContext.Provider value={{ coreContext: { socialMediaLinks }, error: null, isLoading: false }}>
      {ui}
    </CoreContext.Provider>,
  );
}

describe("SocialMediaLinks", () => {
  test("renders supported links from explicit props", () => {
    renderWithCoreContext(
      <SocialMediaLinks
        links={[
          { id: 1, socialMedia: "gh", url: "https://github.com/example" },
          { id: 2, socialMedia: "unknown", url: "https://example.com" },
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute("href", "https://github.com/example");
    expect(screen.queryByRole("link", { name: "unknown" })).not.toBeInTheDocument();
  });

  test("renders links from core context when explicit links are not provided", () => {
    renderWithCoreContext(<SocialMediaLinks />, [
      { id: 1, socialMedia: "in", url: "https://linkedin.com/in/example" },
    ]);

    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", "https://linkedin.com/in/example");
  });

  test("renders nothing when there are no social media links", () => {
    const { container } = renderWithCoreContext(<SocialMediaLinks />);

    expect(container).toBeEmptyDOMElement();
  });
});
