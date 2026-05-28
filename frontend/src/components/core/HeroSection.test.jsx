import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import HeroSection from "./HeroSection";

describe("HeroSection", () => {
  test("renders headline, intro, skills, and actions", () => {
    render(
      <HeroSection
        headline="Portfolio"
        meta={<span>31 Dec, 2025</span>}
        intro={"First line\nSecond line"}
        skills={["Python", "Django"]}
        actions={<a href="/portfolio/">View portfolio</a>}
      />,
    );

    expect(screen.getByRole("heading", { name: "Portfolio" })).toBeInTheDocument();
    expect(screen.getByText("31 Dec, 2025")).toBeInTheDocument();
    expect(screen.getByText((_, element) => element.textContent === "First lineSecond line")).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Core technologies" })).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View portfolio" })).toHaveAttribute("href", "/portfolio/");
  });

  test("renders custom visual content when provided", () => {
    render(<HeroSection headline="Project" intro="Intro" visual={<img src="/media/project.png" alt="Project visual" />} />);

    expect(screen.getByRole("img", { name: "Project visual" })).toHaveAttribute("src", "/media/project.png");
  });
});
