import { useState, useCallback, useEffect } from "react";
import {
  obtenerConversaciones,
  obtenerMensajes,
  enviarMensaje,
  obtenerNoLeidas,
  type Conversacion,
  type Mensaje,
} from "../services/chat";

export interface ChatState {
  conversaciones: Conversacion[];
  mensajesActivos: Mensaje[];
  cargando: boolean;
  noLeidas: number;
  conversacionIdAbierta: number | null;
}

export interface UseChat {
  estado: ChatState;
  cargarConversaciones: () => Promise<void>;
  abrirConversacion: (id: number) => Promise<void>;
  enviar: (conv_id: number, contenido: string) => Promise<void>;
}

export const useChat = (): UseChat => {
  const [estado, setEstado] = useState<ChatState>({
    conversaciones: [],
    mensajesActivos: [],
    cargando: false,
    noLeidas: 0,
    conversacionIdAbierta: null,
  });

  const cargarConversaciones = useCallback(async () => {
    setEstado((prev) => ({ ...prev, cargando: true }));
    try {
      const [{ data: conversaciones }, { unread_count }] = await Promise.all([
        obtenerConversaciones(),
        obtenerNoLeidas(),
      ]);
      setEstado((prev) => ({
        ...prev,
        conversaciones: conversaciones ?? [],
        noLeidas: unread_count,
        cargando: false,
      }));
    } catch {
      setEstado((prev) => ({ ...prev, cargando: false }));
    }
  }, []);

  const abrirConversacion = useCallback(async (id: number) => {
    setEstado((prev) => ({ ...prev, cargando: true, conversacionIdAbierta: id }));
    try {
      const { data: mensajes } = await obtenerMensajes(id);
      setEstado((prev) => ({ ...prev, mensajesActivos: mensajes ?? [], cargando: false }));
    } catch {
      setEstado((prev) => ({ ...prev, cargando: false }));
    }
  }, []);

  const enviar = useCallback(
    async (conv_id: number, contenido: string) => {
      if (!contenido.trim()) return;
      try {
        const nuevoMensaje = await enviarMensaje(conv_id, contenido);
        setEstado((prev) => ({
          ...prev,
          mensajesActivos: [...prev.mensajesActivos, nuevoMensaje],
          conversaciones: prev.conversaciones.map((conv) =>
            conv.id === conv_id ? { ...conv, last_message: nuevoMensaje } : conv
          ),
        }));
      } catch {
        // swallow — let UI handle errors
      }
    },
    []
  );

  useEffect(() => {
    let active = true;
    const load = async () => { if (active) await cargarConversaciones(); };
    load();
    return () => { active = false; };
  }, [cargarConversaciones]);

  return { estado, cargarConversaciones, abrirConversacion, enviar };
};
