import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NotificacionChat } from "../NotificacionChat";

describe("NotificacionChat", () => {
  it("should not render badge when total is 0", () => {
    render(<NotificacionChat total={0} />);

    const badge = screen.queryByText("0");
    expect(badge).not.toBeInTheDocument();
  });

  it("should display 5 when total is 5", () => {
    render(<NotificacionChat total={5} />);

    const badge = screen.getByText("5");
    expect(badge).toBeInTheDocument();
    expect(badge).toBeVisible();
    expect(badge).not.toHaveClass("hidden");
  });

  it("should display 99+ when total is 100", () => {
    render(<NotificacionChat total={100} />);

    const badge = screen.getByText("99+");
    expect(badge).toBeInTheDocument();
    expect(badge).toBeVisible();

    const hundred = screen.queryByText("100");
    expect(hundred).not.toBeInTheDocument();
  });

  it("should cap at 99+ for values >= 100", () => {
    const { rerender } = render(<NotificacionChat total={99} />);
    expect(screen.getByText("99")).toBeInTheDocument();
    expect(screen.queryByText("99+")).not.toBeInTheDocument();

    rerender(<NotificacionChat total={100} />);
    expect(screen.queryByText("99")).not.toBeInTheDocument();
    expect(screen.getByText("99+")).toBeInTheDocument();

    rerender(<NotificacionChat total={101} />);
    expect(screen.getByText("99+")).toBeInTheDocument();
    expect(screen.queryByText("101")).not.toBeInTheDocument();

    rerender(<NotificacionChat total={999} />);
    expect(screen.getByText("99+")).toBeInTheDocument();
    expect(screen.queryByText("999")).not.toBeInTheDocument();
  });
});
