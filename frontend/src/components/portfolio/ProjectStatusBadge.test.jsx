import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import ProjectStatusBadge from "./ProjectStatusBadge";

describe("ProjectStatusBadge", () => {
  test("renders featured status with a star icon", () => {
    render(<ProjectStatusBadge featured={true} />);

    expect(screen.getByText("Featured")).toBeInTheDocument();
    expect(document.querySelector('[data-icon="star"]')).toBeInTheDocument();
  });

  test("renders beta status with a person digging icon", () => {
    render(<ProjectStatusBadge status="beta" />);

    expect(screen.getByText("BETA")).toBeInTheDocument();
    expect(document.querySelector('[data-icon="person-digging"]')).toBeInTheDocument();
  });

  test("renders prototype status with a flask icon", () => {
    render(<ProjectStatusBadge status="prototype" />);

    expect(screen.getByText("PROTOTYPE")).toBeInTheDocument();
    expect(document.querySelector('[data-icon="flask"]')).toBeInTheDocument();
  });
});
