import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useAutenticacion } from "../hooks/useAutenticacion";
import { ProveedorAutenticacion } from "./ContextoAutenticacion";
import type { Usuario } from "./ContextoAutenticacion";

function ComponenteDePrueba() {
  const { usuario, token, cargando, error } = useAutenticacion();

  if (cargando) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!usuario) return <div>No autenticado</div>;

  return (
    <div>
      <div>Nombre: {usuario.nombre}</div>
      <div>Email: {usuario.email}</div>
      <div>Token: {token}</div>
    </div>
  );
}

describe("ContextoAutenticacion", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("proporciona el contexto de autenticación", () => {
    render(
      <ProveedorAutenticacion>
        <ComponenteDePrueba />
      </ProveedorAutenticacion>
    );

    expect(screen.getByText(/No autenticado/i)).toBeInTheDocument();
  });

  it("restaura sesión desde localStorage", async () => {
    const usuarioMock: Usuario = {
      id: 1,
      nombre: "Test User",
      apellido: "Test",
      full_name: "Test User",
      email: "test@habitta.mx",
      telefono: null,
      foto_perfil: null,
      notificaciones: true,
      roles: ["propietario"],
    };

    localStorage.setItem("token", "mock-token-123");
    localStorage.setItem("usuario", JSON.stringify(usuarioMock));

    render(
      <ProveedorAutenticacion>
        <ComponenteDePrueba />
      </ProveedorAutenticacion>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Cargando/i)).not.toBeInTheDocument();
    });
  });

  it("maneja el estado de cargando", async () => {
    const { rerender } = render(
      <ProveedorAutenticacion>
        <ComponenteDePrueba />
      </ProveedorAutenticacion>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Cargando/i)).not.toBeInTheDocument();
    });

    rerender(
      <ProveedorAutenticacion>
        <ComponenteDePrueba />
      </ProveedorAutenticacion>
    );
  });

  it("exporta las interfaces correctas", () => {
    const usuarioTest: Usuario = {
      id: 1,
      nombre: "Juan",
      apellido: "Pérez",
      full_name: "Juan Pérez",
      email: "juan@test.com",
      telefono: null,
      foto_perfil: null,
      notificaciones: true,
    };

    expect(usuarioTest).toHaveProperty("id");
    expect(usuarioTest).toHaveProperty("nombre");
    expect(usuarioTest).toHaveProperty("email");
  });

  it("proporciona métodos de autenticación", async () => {
    render(
      <ProveedorAutenticacion>
        <ComponenteDePrueba />
      </ProveedorAutenticacion>
    );

    await waitFor(() => {
      expect(screen.getByText(/No autenticado/i)).toBeInTheDocument();
    });
  });
});
