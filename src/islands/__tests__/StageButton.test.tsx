import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StageButton } from "@/islands/StageButton";

describe("StageButton", () => {
  it("発見するリンクが/discoverを指している", () => {
    render(<StageButton />);
    const link = screen.getByRole("link", { name: "発見する" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/discover");
  });

  it("ステージテキストが表示される", () => {
    render(<StageButton />);
    expect(screen.getByText("Enliminal")).toBeInTheDocument();
    expect(screen.getByText("行ってみよう。飛んでみよう")).toBeInTheDocument();
  });
});
