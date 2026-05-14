import { useContext } from "react";
import type { ContextoAutenticacionType } from "../context/ContextoAutenticacion";
import { ContextoAutenticacion } from "../context/ContextoAutenticacion";

export function useAutenticacion(): ContextoAutenticacionType {
  const contexto = useContext(ContextoAutenticacion);

  if (contexto === undefined) {
    throw new Error(
      "useAutenticacion debe ser usado dentro de ProveedorAutenticacion"
    );
  }

  return contexto;
}
