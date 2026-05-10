import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { renderLinebreaks } from "./renderLinebreaks";

describe("renderLinebreaks", () => {
  test("renders line breaks between text lines", () => {
    const { container } = render(<p>{renderLinebreaks("First line\nSecond line")}</p>);

    expect(container).toHaveTextContent("First lineSecond line");
    expect(container.querySelectorAll("br")).toHaveLength(1);
  });

  test("returns null for empty content", () => {
    expect(renderLinebreaks("")).toBeNull();
  });
});
