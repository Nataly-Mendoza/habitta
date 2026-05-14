import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom';
import FiltrosBusqueda from '../ui/filtrosBusqueda'; 

describe('FiltrosBusqueda Component', () => {
    const mockOnFiltrar = vi.fn();

    it('debe renderizar con los filtros vacíos inicialmente', () => {
        render(
            <MemoryRouter>
                <FiltrosBusqueda onFiltrar={mockOnFiltrar} />
            </MemoryRouter>
        );
        
        expect(screen.getByPlaceholderText(/Where to?/i)).toHaveValue('');
    });

    it('debe actualizar el valor del select al seleccionar "casa"', () => {
        render(
            <MemoryRouter>
            <FiltrosBusqueda onFiltrar={mockOnFiltrar} />
            </MemoryRouter>
        );
        
        const selectTipo = screen.getByLabelText(/type/i); 

        fireEvent.change(selectTipo, { target: { value: 'casa', name: 'tipo' } });
        expect(selectTipo).toHaveValue('casa');
    });
    it('debe actualizar el valor al escribir', () => {
        render(
            <MemoryRouter>
                <FiltrosBusqueda onFiltrar={mockOnFiltrar} />
            </MemoryRouter>
        );
        
        const inputUbicacion = screen.getByPlaceholderText(/Where to?/i);
        fireEvent.change(inputUbicacion, { target: { value: 'Morelia', name: 'ubicacion' } });
        
        expect(inputUbicacion).toHaveValue('Morelia');
    });

    it('debe limpiar el campo al hacer click en el boton de limpiar', () => {
        render(
            <MemoryRouter>
                <FiltrosBusqueda onFiltrar={mockOnFiltrar} />
            </MemoryRouter>
        );
        
        const inputUbicacion = screen.getByPlaceholderText(/Where to?/i);
        const botonLimpiar = screen.getByRole('button', { name: /clear/i });

        fireEvent.change(inputUbicacion, { target: { value: 'Morelia', name: 'ubicacion' } });
        fireEvent.click(botonLimpiar);
        
        expect(inputUbicacion).toHaveValue('');
    });
});