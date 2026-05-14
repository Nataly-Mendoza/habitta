import { api } from "./api";
import type { Propiedad } from "./propiedades";

export interface EstadisticasDashboard {
  total_active: number;
  total_closed: number;
  total_views: number;
  total_inquiries: number;
  avg_views: number;
  unread_messages: number;
}

export async function obtenerEstadisticas(): Promise<EstadisticasDashboard> {
  const res = await api.get<EstadisticasDashboard>("/dashboard/stats");
  return res.data;
}

export async function obtenerPropiedadesRecientes(): Promise<{ data: Propiedad[] }> {
  const res = await api.get<{ data: Propiedad[] }>("/dashboard/recent-properties");
  return res.data;
}

export async function obtenerActividadVistas(): Promise<
  { title: string; views_count: number }[]
> {
  const res = await api.get("/dashboard/views-activity");
  return res.data;
}
