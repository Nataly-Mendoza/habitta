import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BurbujaMensaje } from "../BurbujaMensaje";

describe("BurbujaMensaje", () => {
  it("should align to right when esMio is true", () => {
    render(<BurbujaMensaje esMio={true} mensaje={{ id: 1, conversacion_id: 1, usuario: { id: 1, nombre: 'Juan' }, contenido: 'Hola', leido: true, created_at: new Date().toISOString() }} />);

    const contenido = screen.getByText("Hola");
    const contenedor = contenido.parentElement?.parentElement;

    expect(contenido).toBeVisible();
    expect(contenedor).toHaveClass("justify-end");
    expect(contenedor).not.toHaveClass("justify-start");
  });

  it("should align to left when esMio is false", () => {
    render(<BurbujaMensaje esMio={false} mensaje={{ id: 2, conversacion_id: 1, usuario: { id: 2, nombre: 'Ana' }, contenido: 'Mensaje del otro', leido: false, created_at: new Date().toISOString() }} />);

    const contenido = screen.getByText("Mensaje del otro");
    const contenedor = contenido.parentElement?.parentElement;

    expect(contenido).toBeVisible();
    expect(contenedor).toHaveClass("justify-start");
    expect(contenedor).not.toHaveClass("justify-end");
  });

  it("should always display message content", () => {
    render(<BurbujaMensaje esMio={true} mensaje={{ id: 3, conversacion_id: 1, usuario: { id: 1, nombre: 'Juan' }, contenido: 'Este es un mensaje importante', leido: false, created_at: new Date().toISOString() }} />);

    const elemento = screen.getByText("Este es un mensaje importante");

    expect(elemento).toBeInTheDocument();
    expect(elemento).toBeVisible();
    expect(elemento.textContent).toBe("Este es un mensaje importante");
  });
});
