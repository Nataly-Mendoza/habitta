import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Send, ArrowLeft, ExternalLink } from "lucide-react";
import { obtenerMensajes, enviarMensaje, type Mensaje } from "../services/chat";
import { obtenerConversaciones, type Conversacion } from "../services/chat";
import { useAutenticacion } from "../hooks/useAutenticacion";
import { DashboardLayout } from "../components/layout/DashboardLayout";

function formatHora(fecha: string) {
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
}

function formatFecha(fecha: string) {
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });
}

export function ConversacionChat() {
  const { id } = useParams<{ id: string }>();
  const { usuario } = useAutenticacion();
  const [conversacion, setConversacion] = useState<Conversacion | null>(null);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [contenido, setContenido] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      obtenerMensajes(Number(id)),
      obtenerConversaciones(),
    ]).then(([msgs, convs]) => {
      setMensajes(msgs.data);
      const conv = convs.data.find((c) => c.id === Number(id));
      setConversacion(conv ?? null);
    }).finally(() => setCargando(false));
  }, [id]);

  // Poll for new messages every 10 seconds
  useEffect(() => {
    if (!id) return;
    const interval = setInterval(async () => {
      try {
        const msgs = await obtenerMensajes(Number(id));
        setMensajes((prev) => {
          const ids = new Set(prev.map((m) => m.id));
          const nuevos = msgs.data
            .filter((m) => !ids.has(m.id))
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          return nuevos.length > 0 ? [...prev, ...nuevos] : prev;
        });
      } catch { /* silently ignore */ }
    }, 10_000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [mensajes]);

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contenido.trim() || !id) return;
    setEnviando(true);
    try {
      const msg = await enviarMensaje(Number(id), contenido.trim());
      setMensajes((prev) => [...prev, msg]);
      setContenido("");
    } finally {
      setEnviando(false);
    }
  };

  const otro = usuario?.id === conversacion?.owner?.id
    ? conversacion?.inquirer
    : conversacion?.owner;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto flex flex-col" style={{ height: "calc(100vh - 120px)" }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Link to="/panel/chat" className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={20} />
          </Link>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-900 font-bold">{otro?.nombre?.[0] ?? "?"}</span>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900">{otro?.full_name ?? "Usuario"}</div>
            {conversacion?.property && (
              <Link
                to={`/propiedad/${conversacion.property.id}`}
                className="text-xs text-blue-700 hover:underline flex items-center gap-1"
              >
                {conversacion.property.title}
                <ExternalLink size={10} />
              </Link>
            )}
          </div>
        </div>

        {/* Property Context */}
        {conversacion?.property && (
          <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-3 mb-4">
            {conversacion.property.main_image && (
              <img
                src={conversacion.property.main_image}
                alt=""
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {conversacion.property.title}
              </p>
              <p className="text-xs text-blue-700">
                ${(conversacion.property.price ?? 0).toLocaleString("es-MX")} — {conversacion.property.city}
              </p>
            </div>
          </div>
        )}

        {/* Messages */}
        <div ref={containerRef} className="flex-1 overflow-y-auto space-y-2 pr-1">
          {cargando ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900" />
            </div>
          ) : mensajes.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">No hay mensajes aún.</div>
          ) : (
            (() => {
              const grupos: { fecha: string; msgs: Mensaje[] }[] = [];
              mensajes.forEach((msg) => {
                const fecha = new Date(msg.created_at).toDateString();
                const ultimo = grupos[grupos.length - 1];
                if (!ultimo || ultimo.fecha !== fecha) {
                  grupos.push({ fecha, msgs: [msg] });
                } else {
                  ultimo.msgs.push(msg);
                }
              });
              return grupos.map(({ fecha, msgs: grupoMsgs }) => (
                <div key={fecha}>
                  <div className="text-center text-xs text-gray-400 my-3">
                    {formatFecha(grupoMsgs[0].created_at)}
                  </div>
                  {grupoMsgs.map((msg) => {
                    const esPropio = msg.sender_id === usuario?.id;
                    return (
                      <div key={msg.id} className={`flex mb-1 ${esPropio ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-2xl text-sm ${
                            esPropio
                              ? "bg-[#1B2B5E] text-white rounded-br-sm"
                              : "bg-gray-100 text-gray-800 rounded-bl-sm"
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p className={`text-xs mt-1 ${esPropio ? "text-blue-200" : "text-gray-400"}`}>
                            {formatHora(msg.created_at)}
                            {esPropio && msg.read_at && " ✓✓"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ));
            })()
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleEnviar} className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleEnviar(e as any);
              }
            }}
            placeholder="Escribe un mensaje..."
            rows={1}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <button
            type="submit"
            disabled={enviando || !contenido.trim()}
            className="bg-[#1B2B5E] text-white rounded-xl px-4 py-2.5 hover:bg-blue-800 transition disabled:opacity-50 flex-shrink-0"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
