import { Navigate, Outlet } from "react-router-dom";
import { useAutenticacion } from "../hooks/useAutenticacion";

export function RutaProtegidaAdmin() {
  const { usuario, cargando } = useAutenticacion();

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[rgba(27,43,94,0.2)] border-t-[#1B2B5E] rounded-full animate-spin" />
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (!(usuario.roles ?? []).includes("admin")) {
    return <Navigate to="/panel" replace />;
  }

  return <Outlet />;
}
