import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { DetallePropiedad } from "./DetallePropiedad";
import { ProveedorAutenticacion } from "../context/ContextoAutenticacion";

// ── Mock services ──────────────────────────────────────────────────────────
vi.mock("../services/propiedades", () => ({
  obtenerPropiedad: vi.fn(),
  obtenerPropiedadesSimilares: vi.fn(),
  toggleFavorito: vi.fn(),
}));

vi.mock("../services/chat", () => ({
  iniciarConversacion: vi.fn(),
}));

vi.mock("../services/ia", () => ({
  amoblarConIA: vi.fn(),
}));

// ── Mock data ──────────────────────────────────────────────────────────────
const mockPropiedad = {
  id: 1,
  title: "Casa de prueba en Polanco",
  description: "Hermosa casa con jardín y alberca.",
  type: "house" as const,
  listing_type: "sale" as const,
  price: 4500000,
  location: "Horacio 1034, Polanco",
  city: "Ciudad de México",
  state: "CDMX",
  country: "México",
  area: 220,
  bedrooms: 3,
  bathrooms: 2,
  floor: null,
  year_built: 2020,
  status: "active" as const,
  close_reason: null,
  views_count: 142,
  has_water: true,
  has_electricity: true,
  has_drainage: true,
  has_garage: true,
  has_garden: true,
  has_pool: false,
  has_security: true,
  has_gym: false,
  has_elevator: false,
  images: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      is_main: true,
      order: 0,
    },
  ],
  main_image:
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
  owner: {
    id: 2,
    nombre: "Carlos",
    apellido: "Mendoza",
    full_name: "Carlos Mendoza",
    email: "prop@habitta.mx",
    telefono: null,
    foto_perfil: null,
  },
  is_favorited: false,
  created_at: "2026-04-27T00:00:00.000000Z",
  updated_at: "2026-04-27T00:00:00.000000Z",
};

import {
  obtenerPropiedad,
  obtenerPropiedadesSimilares,
  toggleFavorito,
} from "../services/propiedades";
import { iniciarConversacion } from "../services/chat";

// ── Helpers ────────────────────────────────────────────────────────────────
const renderAt = (path = "/propiedad/1") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <ProveedorAutenticacion>
        <Routes>
          <Route path="/propiedad/:id" element={<DetallePropiedad />} />
          <Route path="*" element={<DetallePropiedad />} />
        </Routes>
      </ProveedorAutenticacion>
    </MemoryRouter>
  );

// ── Tests ──────────────────────────────────────────────────────────────────
describe("DetallePropiedad — datos de la propiedad", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(obtenerPropiedad).mockResolvedValue(mockPropiedad);
    vi.mocked(obtenerPropiedadesSimilares).mockResolvedValue([]);
  });

  it("muestra el título de la propiedad", async () => {
    renderAt();
    // Title appears in both breadcrumb and h1 — use getAllByText
    await waitFor(() => {
      const matches = screen.getAllByText("Casa de prueba en Polanco");
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  it("el precio NO es $0", async () => {
    renderAt();
    await waitFor(() => {
      expect(screen.queryByText("$0")).not.toBeInTheDocument();
    });
  });

  it("muestra el precio en pesos mexicanos", async () => {
    renderAt();
    await waitFor(() => {
      // Price appears in multiple places — use getAllByText with regex
      const matches = screen.getAllByText(/4[,.]500[,.]000/);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  it("muestra el nombre del propietario", async () => {
    renderAt();
    await waitFor(() =>
      expect(screen.getByText("Carlos Mendoza")).toBeInTheDocument()
    );
  });

  it("muestra la imagen de la propiedad (no sin imágenes)", async () => {
    renderAt();
    await waitFor(() => {
      const images = screen.getAllByRole("img");
      const propertyImg = images.find((img) =>
        (img as HTMLImageElement).src.includes("unsplash")
      );
      expect(propertyImg).toBeDefined();
    });
  });
});

describe("DetallePropiedad — NO muestra botón Llamar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(obtenerPropiedad).mockResolvedValue(mockPropiedad);
    vi.mocked(obtenerPropiedadesSimilares).mockResolvedValue([]);
  });

  it("no tiene ningún enlace tel:", async () => {
    renderAt();
    await waitFor(() => {
      const telLinks = document.querySelectorAll('a[href^="tel:"]');
      expect(telLinks.length).toBe(0);
    });
  });

  it("no muestra el texto 'Llamar'", async () => {
    renderAt();
    await waitFor(() =>
      expect(screen.queryByText(/^llamar$/i)).not.toBeInTheDocument()
    );
  });
});

describe("DetallePropiedad — flujo de contacto (sin sesión)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(obtenerPropiedad).mockResolvedValue(mockPropiedad);
    vi.mocked(obtenerPropiedadesSimilares).mockResolvedValue([]);
  });

  it("muestra opción de iniciar sesión para contactar", async () => {
    renderAt();
    await waitFor(() =>
      expect(
        screen.getByText(/inicia sesión para contactar/i)
      ).toBeInTheDocument()
    );
  });
});

describe("DetallePropiedad — API calls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(obtenerPropiedad).mockResolvedValue(mockPropiedad);
    vi.mocked(obtenerPropiedadesSimilares).mockResolvedValue([]);
  });

  it("llama a obtenerPropiedad con el id correcto", async () => {
    renderAt("/propiedad/1");
    await waitFor(() =>
      expect(vi.mocked(obtenerPropiedad)).toHaveBeenCalledWith(1)
    );
  });

  it("llama a obtenerPropiedadesSimilares", async () => {
    renderAt("/propiedad/1");
    await waitFor(() =>
      expect(
        vi.mocked(obtenerPropiedadesSimilares)
      ).toHaveBeenCalledWith(1)
    );
  });

  it("toggleFavorito está disponible y es callable", () => {
    // Verify the service is correctly mocked and importable
    expect(toggleFavorito).toBeDefined();
    expect(typeof toggleFavorito).toBe("function");
  });
});
