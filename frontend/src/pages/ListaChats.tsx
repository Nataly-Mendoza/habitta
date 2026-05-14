import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { obtenerConversaciones, type Conversacion } from "../services/chat";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { useAutenticacion } from "../hooks/useAutenticacion";

function formatFecha(fecha: string) {
  const d = new Date(fecha);
  const ahora = new Date();
  const diff = ahora.getTime() - d.getTime();
  if (diff < 86400000) {
    return d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

export function ListaChats() {
  const { usuario } = useAutenticacion();
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerConversaciones()
      .then((res) => setConversaciones(res.data))
      .finally(() => setCargando(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mensajes</h1>

        {cargando ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900" />
          </div>
        ) : conversaciones.length === 0 ? (
          <div className="text-center py-20">
            <MessageCircle className="mx-auto mb-4 text-gray-300" size={48} />
            <p className="text-gray-500">No tienes conversaciones aún.</p>
            <p className="text-sm text-gray-400 mt-1">
              Contacta al propietario de una propiedad para iniciar un chat.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
            {conversaciones.map((conv) => {
              const otro = usuario?.id === conv.owner?.id ? conv.inquirer : conv.owner;
              return (
                <Link
                  key={conv.id}
                  to={`/panel/chat/${conv.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-900 font-bold text-lg">
                        {otro?.nombre?.[0] ?? "?"}
                      </span>
                    </div>
                    {conv.unread_count > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900 truncate">
                        {otro?.full_name ?? "Usuario"}
                      </span>
                      {conv.last_message && (
                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                          {formatFecha(conv.last_message.created_at)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {conv.property?.title && (
                        <span className="text-blue-700 font-medium">{conv.property.title}</span>
                      )}
                    </p>
                    {conv.last_message && (
                      <p className="text-sm text-gray-400 truncate">{conv.last_message.content}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
