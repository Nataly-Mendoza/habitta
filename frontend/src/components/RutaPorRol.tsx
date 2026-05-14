import { Navigate, Outlet } from "react-router-dom";
import { useAutenticacion } from "../hooks/useAutenticacion";

interface RutaPorRolProps {
  rolesRequeridos?: string[];
}

export function RutaPorRol({ rolesRequeridos = [] }: RutaPorRolProps) {
  const { usuario, cargando } = useAutenticacion();

  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!usuario) return <Navigate to="/login" replace />;

  if (rolesRequeridos.length > 0) {
    const userRoles = usuario.roles ?? [];
    const tieneRol = rolesRequeridos.some((r) => userRoles.includes(r));
    if (!tieneRol) return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
