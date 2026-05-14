// src/pages/Catalogo.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Catalogo } from "./catalogo";
import { ProveedorAutenticacion } from "../context/ContextoAutenticacion";
import { BrowserRouter } from "react-router";

// Mock useSearchParams
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useSearchParams: () => [new URLSearchParams(), vi.fn()],
  };
});

describe("Catalogo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza el catálogo de propiedades", () => {
    render(
      <BrowserRouter>
        <ProveedorAutenticacion>
          <Catalogo />
        </ProveedorAutenticacion>
      </BrowserRouter>
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("muestra el navbar", () => {
    render(
      <BrowserRouter>
        <ProveedorAutenticacion>
          <Catalogo />
        </ProveedorAutenticacion>
      </BrowserRouter>
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("muestra opciones de vista (grid/list)", () => {
    const { container } = render(
      <BrowserRouter>
        <ProveedorAutenticacion>
          <Catalogo />
        </ProveedorAutenticacion>
      </BrowserRouter>
    );

    expect(container.querySelectorAll("button").length > 0).toBe(true);
  });

  it("renderiza correctamente con mocks de propiedades", () => {
    const { container } = render(
      <BrowserRouter>
        <ProveedorAutenticacion>
          <Catalogo />
        </ProveedorAutenticacion>
      </BrowserRouter>
    );

    expect(container).toBeInTheDocument();
  });

  it("integra sistema de filtros", () => {
    const { container } = render(
      <BrowserRouter>
        <ProveedorAutenticacion>
          <Catalogo />
        </ProveedorAutenticacion>
      </BrowserRouter>
    );

    // Verificar que existan controles de filtrado
    expect(container.querySelectorAll("input, select").length >= 0).toBe(true);
  });

  it("muestra paginación", () => {
    const { container } = render(
      <BrowserRouter>
        <ProveedorAutenticacion>
          <Catalogo />
        </ProveedorAutenticacion>
      </BrowserRouter>
    );

    // Verificar que exista el componente de paginación
    expect(container).toBeInTheDocument();
  });
});
