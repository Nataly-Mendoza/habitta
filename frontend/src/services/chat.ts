import { api } from "./api";
import type { PropietarioInfo } from "./propiedades";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Mensaje {
  id: number;
  conversation_id: number;
  sender_id: number;
  sender: PropietarioInfo | null;
  content: string;
  read_at: string | null;
  created_at: string;
}

export interface Conversacion {
  id: number;
  property: {
    id: number;
    title: string;
    price: number;
    main_image: string | null;
    city: string;
  } | null;
  inquirer: PropietarioInfo | null;
  owner: PropietarioInfo | null;
  last_message: Mensaje | null;
  unread_count: number;
  created_at: string;
}

export interface RespuestaIniciarConversacion {
  conversation: Conversacion;
  message: Mensaje;
}

// ─── Funciones ────────────────────────────────────────────────────────────────

export async function obtenerConversaciones(): Promise<{ data: Conversacion[] }> {
  const res = await api.get("/conversations");
  return res.data;
}

export async function iniciarConversacion(
  property_id: number,
  initial_message: string
): Promise<RespuestaIniciarConversacion> {
  const res = await api.post<RespuestaIniciarConversacion>("/conversations", {
    property_id,
    initial_message,
  });
  return res.data;
}

export async function obtenerMensajes(conversationId: number): Promise<{ data: Mensaje[] }> {
  const res = await api.get(`/conversations/${conversationId}/messages`);
  return res.data;
}

export async function enviarMensaje(
  conversationId: number,
  content: string
): Promise<Mensaje> {
  const res = await api.post<Mensaje>(`/conversations/${conversationId}/messages`, {
    content,
  });
  return res.data;
}

export async function obtenerNoLeidas(): Promise<{ unread_count: number }> {
  const res = await api.get<{ unread_count: number }>("/conversations/unread-count");
  return res.data;
}
