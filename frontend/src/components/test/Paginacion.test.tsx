import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Paginacion from '../ui/paginacion';

describe('Paginacion Component', () => {
  const mockOnCambiar = vi.fn();

  it('debe deshabilitar el botón anterior en la primera página', () => {
    render(<Paginacion paginaActual={1} totalPaginas={5} onCambiar={mockOnCambiar} />);
    
    const botones = screen.getAllByRole('button');
    expect(botones[0]).toBeDisabled(); 
  });

  it('debe llamar a onCambiar con el número correcto al hacer click', () => {
    render(<Paginacion paginaActual={1} totalPaginas={5} onCambiar={mockOnCambiar} />);
    
    const botonPagina = screen.getByText('3');
    fireEvent.click(botonPagina);
    expect(mockOnCambiar).toHaveBeenCalledWith(3);
  });
});