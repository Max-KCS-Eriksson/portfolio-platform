import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { getAbout } from "../api/coreApi";
import { CoreContext } from "../context/CoreContext";
import AboutPage from "./AboutPage";

vi.mock("../api/coreApi", () => ({
  getAbout: vi.fn(),
}));

vi.mock("../hooks/usePageTitle", () => ({
  usePageTitle: vi.fn(),
}));

function renderAboutPage() {
  return render(
    <CoreContext.Provider value={{ coreContext: { socialMediaLinks: [] }, error: null, isLoading: false }}>
      <AboutPage />
    </CoreContext.Provider>,
  );
}

describe("AboutPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("renders about content loaded from the API", async () => {
    getAbout.mockResolvedValue({
      intro: "About intro",
      background: "Background text",
      mindsetIntro: "How I work intro",
      mindsetList: ["Write clear code", "Test useful behavior"],
      focusIntro: "Current focus intro",
      focusList: ["Django", "React"],
    });

    renderAboutPage();

    expect(await screen.findByRole("heading", { name: "About" })).toBeInTheDocument();
    expect(screen.getByText("About intro")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "1. Background" })).toBeInTheDocument();
    expect(screen.getByText("Write clear code")).toBeInTheDocument();
    expect(screen.getByText("Django")).toBeInTheDocument();
  });

  test("renders placeholders and an error message when loading fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    getAbout.mockRejectedValue(new Error("Failed"));

    renderAboutPage();

    expect(await screen.findByText("Could not load about content.")).toBeInTheDocument();
    expect(screen.getByText("About intro TBD")).toBeInTheDocument();

    console.error.mockRestore();
  });
});
