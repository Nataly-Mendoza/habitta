import { api } from "./api";

export interface AdminUser {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  roles: string[];
  creado_en: string | null;
}

export interface AdminProperty {
  id: number;
  title: string;
  status: "active" | "closed";
  close_reason: string | null;
  price: number;
  city: string;
  listing_type: "sale" | "rent";
  type: string;
  views_count: number;
  owner: { id: number; nombre: string; email: string } | null;
  main_image: string | null;
  created_at: string | null;
}

export async function obtenerUsuariosAdmin(): Promise<AdminUser[]> {
  const res = await api.get("/admin/users");
  return res.data.data;
}

export async function actualizarRolUsuario(id: number, role: string): Promise<void> {
  await api.patch(`/admin/users/${id}/role`, { role });
}

export async function obtenerPropiedadesAdmin(): Promise<AdminProperty[]> {
  const res = await api.get("/admin/properties");
  return res.data.data;
}
