import { useState, useEffect, useRef } from "react";
import { useChat } from "../../hooks/useChat";
import { useAutenticacion } from "../../hooks/useAutenticacion";
import type { Conversacion } from "../../services/chat";

export const ConversacionChat = () => {
  const { estado, abrirConversacion, enviar } = useChat();
  const { usuario } = useAutenticacion();

  const [conversacionActiva, setConversacionActiva] = useState<number | null>(null);
  const [mensajeInput, setMensajeInput] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);
  const mensajesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mensajesRef.current) {
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight;
    }
  }, [estado.mensajesActivos]);

  useEffect(() => {
    if (!conversacionActiva) return;
    const id = setInterval(() => abrirConversacion(conversacionActiva), 5000);
    return () => clearInterval(id);
  }, [conversacionActiva, abrirConversacion]);

  const seleccionar = async (id: number) => {
    setConversacionActiva(id);
    await abrirConversacion(id);
  };

  const enviarMensaje = async () => {
    if (!mensajeInput.trim() || !conversacionActiva) return;
    const contenido = mensajeInput.trim();
    setMensajeInput("");
    setEscribiendo(true);
    setTimeout(() => setEscribiendo(false), 1000);
    await enviar(conversacionActiva, contenido);
  };

  const conversacionActual: Conversacion | undefined = estado.conversaciones.find(
    (c) => c.id === conversacionActiva
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Lista */}
      <div className="hidden w-80 md:flex md:flex-col border-r bg-white">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Mensajes</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {estado.conversaciones.map((conv) => (
            <button
              key={conv.id}
              onClick={() => seleccionar(conv.id)}
              className={`w-full text-left p-4 hover:bg-gray-50 border-b ${conversacionActiva === conv.id ? "bg-blue-50" : ""}`}
            >
              <p className="font-medium text-sm text-gray-900 truncate">
                {conv.property?.title ?? "Propiedad"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {conv.last_message?.content ?? "Sin mensajes"}
              </p>
              {conv.unread_count > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-600 rounded-full">
                  {conv.unread_count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Conversación */}
      <div className="flex flex-1 flex-col">
        {conversacionActual ? (
          <>
            <div className="flex items-center gap-3 border-b bg-white p-4">
              <img
                src={conversacionActual.property?.main_image ?? ""}
                alt={conversacionActual.property?.title ?? ""}
                className="h-10 w-10 rounded-full object-cover bg-gray-100"
              />
              <div>
                <h3 className="font-medium text-gray-900">
                  {conversacionActual.owner?.nombre ?? "Propietario"}
                </h3>
                <p className="text-sm text-gray-500">
                  {conversacionActual.property?.title ?? ""}
                </p>
              </div>
            </div>

            <div ref={mensajesRef} className="flex-1 overflow-y-auto p-4 space-y-2">
              {estado.mensajesActivos.map((msg) => {
                const esMio = msg.sender_id === usuario?.id;
                return (
                  <div key={msg.id} className={`flex ${esMio ? "justify-end" : "justify-start"}`}>
                    <div className={`rounded-xl px-4 py-2 max-w-xs text-sm ${esMio ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}`}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              {escribiendo && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-xl px-4 py-2">
                    <span className="text-gray-400 text-xs">Escribiendo...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t bg-white p-4 flex gap-2">
              <textarea
                value={mensajeInput}
                onChange={(e) => setMensajeInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviarMensaje(); } }}
                placeholder="Escribe un mensaje..."
                className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none"
                rows={1}
              />
              <button
                onClick={enviarMensaje}
                disabled={!mensajeInput.trim()}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-center text-gray-400">
            <p className="text-sm">Selecciona una conversación para comenzar</p>
          </div>
        )}
      </div>
    </div>
  );
};
