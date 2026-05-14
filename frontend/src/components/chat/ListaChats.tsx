import { useState, useMemo } from "react";
import type { Conversacion } from "../../types";
import { NotificacionChat } from "./NotificacionChat";

interface Props {
  conversaciones: Conversacion[];
  onSeleccionar: (id: number) => void;
}

export const ListaChats = ({ conversaciones, onSeleccionar }: Props) => {
  const [busqueda, setBusqueda] = useState("");

  const conversacionesFiltradas = useMemo(() => {
    if (!busqueda.trim()) return conversaciones;

    const termino = busqueda.toLowerCase();
    return conversaciones.filter((conv) =>
      conv.usuario_propietario.nombre.toLowerCase().includes(termino) ||
      conv.propiedad.titulo.toLowerCase().includes(termino)
    );
  }, [conversaciones, busqueda]);

  return (
    <div className="flex h-full flex-col border-r bg-white">
      {/* Header con búsqueda */}
      <div className="border-b p-4">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Mensajes</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar conversaciones..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Lista de conversaciones */}
      <div className="flex-1 overflow-y-auto">
        {conversacionesFiltradas.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-gray-500">
            {busqueda ? "No se encontraron conversaciones" : "No hay conversaciones"}
          </div>
        ) : (
          conversacionesFiltradas.map((conversacion) => (
            <div
              key={conversacion.id}
              onClick={() => onSeleccionar(conversacion.id)}
              className="cursor-pointer border-b border-gray-100 p-4 hover:bg-gray-50"
            >
              <div className="flex items-start gap-3">
                <img
                  src={conversacion.propiedad.foto_principal_url}
                  alt={conversacion.propiedad.titulo}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="truncate text-sm font-medium text-gray-900">
                      {conversacion.usuario_propietario.nombre}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {new Date(conversacion.ultimo_mensaje.created_at).toLocaleDateString()}
                      </span>
                      <NotificacionChat total={conversacion.mensajes_no_leidos} />
                    </div>
                  </div>
                  <p className="truncate text-xs text-gray-600">
                    {conversacion.propiedad.titulo}
                  </p>
                  <p className="truncate text-sm text-gray-700">
                    {conversacion.ultimo_mensaje.contenido}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};