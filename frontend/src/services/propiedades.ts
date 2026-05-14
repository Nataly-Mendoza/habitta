import { api } from "./api";

// ─── API Types (match Laravel API response) ────────────────────────────────

export interface PropiedadImagen {
  id: number;
  url: string;
  is_main: boolean;
  order: number;
}

export interface PropietarioInfo {
  id: number;
  nombre: string;
  apellido: string;
  full_name: string;
  email: string;
  telefono: string | null;
  foto_perfil: string | null;
}

export interface Propiedad {
  id: number;
  title: string;
  description: string | null;
  type: "house" | "apartment" | "land" | "studio" | "commercial" | "office";
  listing_type: "sale" | "rent";
  price: number;
  location: string;
  city: string;
  state: string | null;
  country: string;
  area: number;
  bedrooms: number | null;
  bathrooms: number | null;
  floor: number | null;
  year_built: number | null;
  status: "active" | "closed";
  close_reason: string | null;
  views_count: number;
  has_water: boolean;
  has_electricity: boolean;
  has_drainage: boolean;
  has_garage: boolean;
  has_garden: boolean;
  has_pool: boolean;
  has_security: boolean;
  has_gym: boolean;
  has_elevator: boolean;
  images: PropiedadImagen[];
  main_image: string | null;
  owner: PropietarioInfo | null;
  is_favorited?: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginacionMeta {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
  from: number | null;
  to: number | null;
}

export interface ListadoPropiedades {
  data: Propiedad[];
  meta: PaginacionMeta;
  links: object;
}

export interface FiltrosPropiedades {
  type?: string;
  listing_type?: "sale" | "rent";
  city?: string;
  q?: string;
  price_min?: number;
  price_max?: number;
  area_min?: number;
  area_max?: number;
  bedrooms?: number;
  sort?: "newest" | "price_asc" | "price_desc" | "area_asc" | "area_desc";
  per_page?: number;
  page?: number;
}

export interface DatosPropiedad {
  title: string;
  description?: string;
  type: string;
  listing_type: string;
  price: number;
  location: string;
  city: string;
  state?: string;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  year_built?: number;
  has_water?: boolean;
  has_electricity?: boolean;
  has_drainage?: boolean;
  has_garage?: boolean;
  has_garden?: boolean;
  has_pool?: boolean;
  has_security?: boolean;
  has_gym?: boolean;
  has_elevator?: boolean;
  images?: string[];
}

// ─── Funciones ────────────────────────────────────────────────────────────────

export async function obtenerPropiedades(
  filtros: FiltrosPropiedades = {}
): Promise<ListadoPropiedades> {
  const params = new URLSearchParams();
  Object.entries(filtros).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
  });
  const res = await api.get<ListadoPropiedades>(`/properties?${params}`);
  return res.data;
}

export async function obtenerPropiedad(id: number): Promise<Propiedad> {
  const res = await api.get<{ data: Propiedad }>(`/properties/${id}`);
  return res.data.data;
}

export async function obtenerPropiedadesSimilares(id: number): Promise<Propiedad[]> {
  const res = await api.get<{ data: Propiedad[] }>(`/properties/${id}/similar`);
  return res.data.data;
}

export async function obtenerCiudades(): Promise<{ city: string; count: number }[]> {
  const res = await api.get("/properties/cities");
  return res.data;
}

export async function obtenerCantidadPorTipo(): Promise<Record<string, { count: number }>> {
  const res = await api.get("/properties/type-counts");
  return res.data;
}

export async function crearPropiedad(datos: DatosPropiedad): Promise<Propiedad> {
  const res = await api.post<{ data: Propiedad }>("/properties", datos);
  return res.data.data;
}

export async function actualizarPropiedad(
  id: number,
  datos: Partial<DatosPropiedad>
): Promise<Propiedad> {
  const res = await api.put<{ data: Propiedad }>(`/properties/${id}`, datos);
  return res.data.data;
}

export async function eliminarPropiedad(id: number): Promise<void> {
  await api.delete(`/properties/${id}`);
}

export interface DatosCierrePropiedad {
  reason: "sold" | "rented" | "other";
  note?: string;
}

export async function cerrarPropiedad(
  id: number,
  datos: DatosCierrePropiedad
): Promise<Propiedad> {
  const reason = datos.note ? `${datos.reason}: ${datos.note}` : datos.reason;
  const res = await api.post<{ data: Propiedad }>(`/properties/${id}/close`, { reason });
  return res.data.data;
}

export async function obtenerMisPropiedades(
  filtros: { status?: string; q?: string; page?: number } = {}
): Promise<ListadoPropiedades> {
  const params = new URLSearchParams();
  Object.entries(filtros).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") params.set(k, String(v));
  });
  const res = await api.get<ListadoPropiedades>(`/my-properties?${params}`);
  return res.data;
}

export async function subirImagenesPropiedad(
  propiedadId: number,
  archivos: File[]
): Promise<PropiedadImagen[]> {
  const formData = new FormData();
  archivos.forEach((f) => formData.append("images[]", f));
  const res = await api.post<PropiedadImagen[]>(`/properties/${propiedadId}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function eliminarImagenPropiedad(
  propiedadId: number,
  imagenId: number
): Promise<void> {
  await api.delete(`/properties/${propiedadId}/images/${imagenId}`);
}

export async function setMainImage(
  propiedadId: number,
  imagenId: number
): Promise<PropiedadImagen> {
  const res = await api.put<PropiedadImagen>(
    `/properties/${propiedadId}/images/${imagenId}/set-main`
  );
  return res.data;
}

export async function toggleFavorito(propiedadId: number): Promise<{ favorited: boolean }> {
  const res = await api.post<{ favorited: boolean }>(`/properties/${propiedadId}/favorite`);
  return res.data;
}

export async function obtenerFavoritos(): Promise<ListadoPropiedades> {
  const res = await api.get<ListadoPropiedades>("/favorites");
  return res.data;
}
