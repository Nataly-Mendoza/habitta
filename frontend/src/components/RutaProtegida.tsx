import { Navigate, Outlet } from "react-router-dom";
import { useAutenticacion } from "../hooks/useAutenticacion";

export function RutaProtegida() {
  const { usuario, cargando } = useAutenticacion();

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 border-4 border-[rgba(27,43,94,0.2)] border-t-[#1B2B5E] rounded-full animate-spin"
          />
          <p style={{ color: "#1B2B5E", fontSize: "14px" }}>
            Cargando...
          </p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
