import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { PaginaLogin } from "../pages/Login";
import { ProveedorAutenticacion } from "../context/ContextoAutenticacion";
import * as servicioAutenticacion from "../services/autenticacion";

vi.mock("../services/autenticacion");

describe("PaginaLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderizar = (componente: React.ReactNode) => {
    return render(
      <BrowserRouter>
        <ProveedorAutenticacion>{componente}</ProveedorAutenticacion>
      </BrowserRouter>
    );
  };

  it("debe renderizar los campos de correo y contraseña", () => {
    renderizar(<PaginaLogin />);
    expect(screen.getByPlaceholderText(/usuario@habitta.mx/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/)).toBeInTheDocument();
  });

  it("debe mostrar errores de validación al enviar vacío", async () => {
    renderizar(<PaginaLogin />);
    const botonEnviar = screen.getByRole("button", { name: /iniciar sesión/i });
    fireEvent.click(botonEnviar);
    await waitFor(() => {
      expect(screen.getByText(/el correo es requerido/i)).toBeInTheDocument();
    });
  });

  it("debe llamar al servicio de autenticación con datos válidos", async () => {
    vi.mocked(servicioAutenticacion.iniciarSesion).mockResolvedValueOnce({
      token: "token-mock",
      usuario: {
        id: 1,
        nombre: "Juan",
        apellido: "Pérez",
        full_name: "Juan Pérez",
        email: "user@habitta.mx",
        telefono: null,
        foto_perfil: null,
        notificaciones: true,
      },
    });

    renderizar(<PaginaLogin />);

    fireEvent.change(screen.getByPlaceholderText(/usuario@habitta.mx/i), {
      target: { value: "user@habitta.mx" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/), {
      target: { value: "ValidPass123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(servicioAutenticacion.iniciarSesion).toHaveBeenCalledWith({
        email: "user@habitta.mx",
        password: "ValidPass123",
      });
    });
  });

  it("debe mostrar un error del API si las credenciales son incorrectas", async () => {
    vi.mocked(servicioAutenticacion.iniciarSesion).mockRejectedValueOnce({
      response: { data: { message: "Credenciales inválidas" } },
    });

    renderizar(<PaginaLogin />);

    fireEvent.change(screen.getByPlaceholderText(/usuario@habitta.mx/i), {
      target: { value: "user@habitta.mx" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/), {
      target: { value: "PassIncorrecta123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument();
    });
  });
});
