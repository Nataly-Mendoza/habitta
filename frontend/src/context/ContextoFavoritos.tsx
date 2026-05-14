import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { toggleFavorito as apiToggle, obtenerFavoritos } from "../services/propiedades";
import { ContextoAutenticacion } from "./ContextoAutenticacion";

interface ContextoFavoritosType {
  favoritedIds: Set<number>;
  toggleFavorito: (id: number) => Promise<void>;
}

export const ContextoFavoritos = createContext<ContextoFavoritosType>({
  favoritedIds: new Set(),
  toggleFavorito: async () => {},
});

export function ProveedorFavoritos({ children }: { children: ReactNode }) {
  const ctx = useContext(ContextoAutenticacion);
  const token = ctx?.token ?? null;

  const [favoritedIds, setFavoritedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!token) {
      setFavoritedIds(new Set());
      return;
    }
    obtenerFavoritos()
      .then((lista) => {
        const ids = new Set(lista.data.map((p) => p.id));
        setFavoritedIds(ids);
      })
      .catch(() => {});
  }, [token]);

  const toggleFavorito = useCallback(async (id: number) => {
    if (!token) return;
    const res = await apiToggle(id);
    setFavoritedIds((prev) => {
      const next = new Set(prev);
      if (res.favorited) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, [token]);

  return (
    <ContextoFavoritos.Provider value={{ favoritedIds, toggleFavorito }}>
      {children}
    </ContextoFavoritos.Provider>
  );
}
