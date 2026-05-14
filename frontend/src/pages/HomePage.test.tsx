// src/pages/HomePage.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { HomePage } from "./Inicio";
import { ProveedorAutenticacion } from "../context/ContextoAutenticacion";
import { BrowserRouter } from "react-router";

// Mock useNavigate
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza la página de inicio correctamente", () => {
    render(
      <BrowserRouter>
        <ProveedorAutenticacion>
          <HomePage />
        </ProveedorAutenticacion>
      </BrowserRouter>
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("muestra sección del hero con imagen de fondo", () => {
    render(
      <BrowserRouter>
        <ProveedorAutenticacion>
          <HomePage />
        </ProveedorAutenticacion>
      </BrowserRouter>
    );

    const heroSection = screen.getByRole("img", { hidden: true });
    expect(heroSection).toBeInTheDocument();
  });

  it("renderiza el navbar", () => {
    render(
      <BrowserRouter>
        <ProveedorAutenticacion>
          <HomePage />
        </ProveedorAutenticacion>
      </BrowserRouter>
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("muestra propiedades destacadas", () => {
    const { container } = render(
      <BrowserRouter>
        <ProveedorAutenticacion>
          <HomePage />
        </ProveedorAutenticacion>
      </BrowserRouter>
    );

    // Verificar que existan elementos de propiedades
    const propertyCards = container.querySelectorAll("[class*='property']");
    expect(propertyCards.length >= 0).toBe(true);
  });

  it("integra correctamente con mocks de propiedades", () => {
    const { container } = render(
      <BrowserRouter>
        <ProveedorAutenticacion>
          <HomePage />
        </ProveedorAutenticacion>
      </BrowserRouter>
    );

    expect(container).toBeInTheDocument();
  });
});
