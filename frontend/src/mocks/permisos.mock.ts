// src/mocks/permisos.mock.ts

export interface Permiso {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface RolConPermisos {
  id: number;
  nombre: string;
  descripcion: string;
  permisos: Permiso[];
}

export const permisosMock: Permiso[] = [
  { id: 1, nombre: "crear_propiedad", descripcion: "Crear nuevas propiedades" },
  { id: 2, nombre: "editar_propiedad", descripcion: "Editar propiedades existentes" },
  { id: 3, nombre: "eliminar_propiedad", descripcion: "Eliminar propiedades" },
  { id: 4, nombre: "ver_propiedades", descripcion: "Ver lista de propiedades" },
  { id: 5, nombre: "contactar_propietario", descripcion: "Contactar al propietario" },
  { id: 6, nombre: "ver_dashboard", descripcion: "Ver panel de usuario" },
  { id: 7, nombre: "ver_ofertas", descripcion: "Ver ofertas recibidas" },
  { id: 8, nombre: "aceptar_oferta", descripcion: "Aceptar ofertas" },
  { id: 9, nombre: "ver_favoritos", descripcion: "Ver propiedades favoritas" },
];

export const rolesMock: RolConPermisos[] = [
  {
    id: 1,
    nombre: "propietario",
    descripcion: "Propietario que publica y gestiona propiedades",
    permisos: [
      permisosMock[0], // crear_propiedad
      permisosMock[1], // editar_propiedad
      permisosMock[2], // eliminar_propiedad
      permisosMock[3], // ver_propiedades
      permisosMock[5], // ver_dashboard
      permisosMock[6], // ver_ofertas
      permisosMock[7], // aceptar_oferta
    ],
  },
  {
    id: 2,
    nombre: "comprador",
    descripcion: "Comprador que busca propiedades",
    permisos: [
      permisosMock[3], // ver_propiedades
      permisosMock[4], // contactar_propietario
      permisosMock[5], // ver_dashboard
      permisosMock[8], // ver_favoritos
    ],
  },
  {
    id: 3,
    nombre: "admin",
    descripcion: "Administrador del sistema",
    permisos: permisosMock, // Todos los permisos
  },
];

/**
 * Obtiene los permisos de un rol
 */
export function obtenerPermisosDelRol(nombreRol: string): Permiso[] {
  const rol = rolesMock.find((r) => r.nombre === nombreRol);
  return rol?.permisos || [];
}

/**
 * Verifica si un rol tiene un permiso específico
 */
export function tienePermiso(nombreRol: string, nombrePermiso: string): boolean {
  const permisos = obtenerPermisosDelRol(nombreRol);
  return permisos.some((p) => p.nombre === nombrePermiso);
}
