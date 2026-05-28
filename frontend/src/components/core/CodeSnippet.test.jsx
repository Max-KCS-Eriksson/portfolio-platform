import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import CodeSnippet from "./CodeSnippet";

describe("CodeSnippet", () => {
  test("renders code, description, and copies with text highlight feedback", async () => {
    const writeText = vi.fn().mockResolvedValue();
    Object.assign(navigator, {
      clipboard: { writeText },
    });

    render(<CodeSnippet heading="Bash shell" code="python manage.py test" description="Run the test suite." />);

    expect(screen.getByRole("heading", { name: "Bash shell" })).toBeInTheDocument();
    expect(screen.getByText("python manage.py test").closest(".code-snippet__code")).toBeInTheDocument();
    expect(screen.getByText("Run the test suite.")).toBeInTheDocument();
    expect(document.querySelector('[data-icon="comment"]')).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Copy snippet" }));

    expect(writeText).toHaveBeenCalledWith("python manage.py test");
    await waitFor(() => expect(screen.getByText("python manage.py test").closest(".code-snippet__box")).toHaveClass("copied"));
  });
});
