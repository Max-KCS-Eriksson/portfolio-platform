import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import NumberedHeading from "./NumberedHeading";

describe("NumberedHeading", () => {
  test("renders the marker and title as one accessible heading", () => {
    render(
      <NumberedHeading id="background-heading" marker="01">
        Background
      </NumberedHeading>,
    );

    const heading = screen.getByRole("heading", { name: "01 Background" });

    expect(heading).toHaveAttribute("id", "background-heading");
    expect(within(heading).getByText("01")).toHaveClass("numbered-heading__marker");
  });

  test("renders optional trailing actions", () => {
    render(
      <NumberedHeading id="solution-heading" marker="02" actions={<span>BETA</span>}>
        What I Built
      </NumberedHeading>,
    );

    const heading = screen.getByRole("heading", { name: "02 What I Built" });

    expect(within(heading).getByText("BETA")).toBeInTheDocument();
  });
});
