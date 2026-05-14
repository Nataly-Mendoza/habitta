// src/pages/Dashboard.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DashboardOverviewPage } from "./dashboard";
import { ProveedorAutenticacion } from "../context/ContextoAutenticacion";

// Mock useAutenticacion
vi.mock("../hooks/useAutenticacion", () => ({
  useAutenticacion: () => ({
    usuario: {
      id: 1,
      nombre: "Juan",
      apellido: "Pérez",
      correo: "juan@habitta.mx",
      rol: { id: 1, nombre: "propietario", descripcion: "Propietario" },
      notificaciones: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    token: "mock-token",
    cargando: false,
    error: null,
    guardarSesion: vi.fn(),
    cerrarSesion: vi.fn(),
    limpiarError: vi.fn(),
  }),
}));

describe("DashboardOverviewPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza el dashboard correctamente", () => {
    render(
      <ProveedorAutenticacion>
        <DashboardOverviewPage />
      </ProveedorAutenticacion>
    );

    expect(screen.getByText(/Bienvenido, Juan/i)).toBeInTheDocument();
  });

  it("muestra el navbar con logo Habitta", () => {
    render(
      <ProveedorAutenticacion>
        <DashboardOverviewPage />
      </ProveedorAutenticacion>
    );

    expect(screen.getByText("Habitta")).toBeInTheDocument();
  });

  it("muestra las 4 tarjetas de estadísticas", () => {
    render(
      <ProveedorAutenticacion>
        <DashboardOverviewPage />
      </ProveedorAutenticacion>
    );

    expect(screen.getByText(/Propiedades Activas/i)).toBeInTheDocument();
    expect(screen.getByText(/Propiedades Totales/i)).toBeInTheDocument();
    expect(screen.getByText(/Chats Abiertos/i)).toBeInTheDocument();
    expect(screen.getByText(/Vistas Totales/i)).toBeInTheDocument();
  });

  it("muestra la tabla de propiedades con datos", () => {
    render(
      <ProveedorAutenticacion>
        <DashboardOverviewPage />
      </ProveedorAutenticacion>
    );

    expect(screen.getByText(/Casa en Chapultepec/i)).toBeInTheDocument();
    expect(screen.getByText(/Departamento en Camelinas/i)).toBeInTheDocument();
    expect(screen.getByText(/Villa Colonial/i)).toBeInTheDocument();
  });

  it("muestra el botón Nueva Propiedad", () => {
    render(
      <ProveedorAutenticacion>
        <DashboardOverviewPage />
      </ProveedorAutenticacion>
    );

    expect(screen.getByText(/Nueva Propiedad/i)).toBeInTheDocument();
  });

  it("muestra el nombre del usuario en el dashboard", () => {
    render(
      <ProveedorAutenticacion>
        <DashboardOverviewPage />
      </ProveedorAutenticacion>
    );

    expect(screen.getByText(/Juan/i)).toBeInTheDocument();
  });
});
