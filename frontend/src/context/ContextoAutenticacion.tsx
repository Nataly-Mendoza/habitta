import { createContext, useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Usuario } from "../services/autenticacion";
import { cerrarSesion as apiCerrarSesion, obtenerUsuario } from "../services/autenticacion";

export type { Usuario };

export interface ContextoAutenticacionType {
  usuario: Usuario | null;
  token: string | null;
  cargando: boolean;
  error: string | null;
  guardarSesion: (token: string, usuario: Usuario) => void;
  cerrarSesion: () => Promise<void>;
  limpiarError: () => void;
  refrescarPerfil: () => Promise<void>;
}

export const ContextoAutenticacion = createContext<ContextoAutenticacionType | undefined>(
  undefined
);

export function ProveedorAutenticacion({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tokenGuardado = localStorage.getItem("token");

    if (!tokenGuardado) {
      setCargando(false);
      return;
    }

    setToken(tokenGuardado);

    // Restore cached user immediately for fast render
    try {
      const usuarioGuardado = localStorage.getItem("usuario");
      if (usuarioGuardado) setUsuario(JSON.parse(usuarioGuardado));
    } catch {
      localStorage.removeItem("usuario");
    }

    // Always fetch fresh profile so role changes are reflected on next load
    obtenerUsuario()
      .then((fresh) => {
        setUsuario(fresh);
        localStorage.setItem("usuario", JSON.stringify(fresh));
      })
      .catch(() => {
        // Token expired or invalid — clean up
        setToken(null);
        setUsuario(null);
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
      })
      .finally(() => setCargando(false));

    const handleUnauthorized = () => {
      setToken(null);
      setUsuario(null);
    };
    window.addEventListener("unauthorized", handleUnauthorized);
    return () => window.removeEventListener("unauthorized", handleUnauthorized);
  }, []);

  const guardarSesion = (tokenNuevo: string, usuarioNuevo: Usuario) => {
    setToken(tokenNuevo);
    setUsuario(usuarioNuevo);
    localStorage.setItem("token", tokenNuevo);
    localStorage.setItem("usuario", JSON.stringify(usuarioNuevo));
  };

  const cerrarSesion = async () => {
    try {
      await apiCerrarSesion();
    } catch {
      // intentional: clean up regardless
    } finally {
      setToken(null);
      setUsuario(null);
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
    }
  };

  const refrescarPerfil = useCallback(async () => {
    const t = localStorage.getItem("token");
    if (!t) return;
    try {
      const fresh = await obtenerUsuario();
      setUsuario(fresh);
      localStorage.setItem("usuario", JSON.stringify(fresh));
    } catch {
      // silently ignore — token may have expired
    }
  }, []);

  const limpiarError = () => setError(null);

  return (
    <ContextoAutenticacion.Provider
      value={{ usuario, token, cargando, error, guardarSesion, cerrarSesion, limpiarError, refrescarPerfil }}
    >
      {children}
    </ContextoAutenticacion.Provider>
  );
}
