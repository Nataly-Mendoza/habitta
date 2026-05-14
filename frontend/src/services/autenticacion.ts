import { api } from "./api";

export interface DatosRegistro {
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  password: string;
  password_confirmation: string;
}

export interface DatosLogin {
  email: string;
  password: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  full_name: string;
  email: string;
  telefono: string | null;
  foto_perfil: string | null;
  notificaciones: boolean;
  roles?: string[];
}

export interface RespuestaAutenticacion {
  token: string;
  usuario: Usuario;
}

export async function registrar(datos: DatosRegistro): Promise<RespuestaAutenticacion> {
  const res = await api.post<RespuestaAutenticacion>("/auth/registro", datos);
  return res.data;
}

export async function iniciarSesion(datos: DatosLogin): Promise<RespuestaAutenticacion> {
  const res = await api.post<RespuestaAutenticacion>("/auth/login", datos);
  return res.data;
}

export async function cerrarSesion(): Promise<void> {
  await api.post("/auth/logout");
}

export async function obtenerUsuario(): Promise<Usuario> {
  const res = await api.get<Usuario>("/auth/usuario");
  return res.data;
}

export async function actualizarPerfil(datos: Partial<{
  nombre: string;
  apellido: string;
  telefono: string;
  foto_perfil: string;
}>): Promise<Usuario> {
  const res = await api.put<Usuario>("/auth/perfil", datos);
  return res.data;
}

export async function cambiarContrasena(
  contraseña_actual: string,
  contraseña_nueva: string,
  contraseña_nueva_confirmation: string
): Promise<void> {
  await api.put("/auth/contraseña", {
    contraseña_actual,
    contraseña_nueva,
    contraseña_nueva_confirmation,
  });
}
