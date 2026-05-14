// usuarios de prueba para desarrollo
export const usuarioMock = {
  id: 1,
  nombre: "Juan",
  apellido: "Pérez",
  correo: "user@habitta.mx",
  telefono: "+33 612345678",
  fotoPerfil: "https://via.placeholder.com/150",
  rol: {
    id: 2,
    nombre: "propietario",
    descripcion: "Puede publicar propiedades",
  },
  notificaciones: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const tokenMock = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.token";
