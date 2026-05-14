import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Home, Eye, TrendingUp, Plus, Edit2, BarChart2 } from "lucide-react";
import { useAutenticacion } from "../hooks/useAutenticacion";
import { obtenerEstadisticas, obtenerPropiedadesRecientes, obtenerActividadVistas, type EstadisticasDashboard } from "../services/dashboard";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import type { Propiedad } from "../services/propiedades";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(price);
}

export function DashboardOverviewPage() {
  const { usuario } = useAutenticacion();
  const [stats, setStats] = useState<EstadisticasDashboard | null>(null);
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [actividad, setActividad] = useState<{ title: string; views_count: number }[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      obtenerEstadisticas(),
      obtenerPropiedadesRecientes(),
      obtenerActividadVistas(),
    ])
      .then(([s, p, a]) => {
        setStats(s);
        setPropiedades(p.data);
        setActividad(a);
      })
      .finally(() => setCargando(false));
  }, []);

  const statCards = stats
    ? [
        {
          label: "Propiedades Activas",
          value: stats.total_active,
          icon: <Home size={22} />,
          color: "#1B2B5E",
          bg: "rgba(27,43,94,0.08)",
        },
        {
          label: "Vistas Totales",
          value: stats.total_views.toLocaleString("es-MX"),
          icon: <Eye size={22} />,
          color: "#2A7A4E",
          bg: "rgba(42,122,78,0.08)",
        },
        {
          label: "Mensajes sin leer",
          value: stats.unread_messages,
          icon: <MessageSquare size={22} />,
          color: "#C9A96E",
          bg: "rgba(201,169,110,0.1)",
        },
        {
          label: "Consultas recibidas",
          value: stats.total_inquiries,
          icon: <TrendingUp size={22} />,
          color: "#4A5FA8",
          bg: "rgba(74,95,168,0.08)",
        },
      ]
    : [];

  const maxViews = Math.max(...actividad.map((a) => a.views_count), 1);

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Welcome */}
        <div className="bg-[#1B2B5E] rounded-2xl p-6 text-white flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              ¡Bienvenido, {usuario?.nombre}! 👋
            </h1>
            <p className="text-blue-200 mt-1 text-sm">
              Aquí está el resumen de tu actividad en Habitta.
            </p>
          </div>
          <Link
            to="/panel/propiedades/crear"
            className="hidden sm:flex items-center gap-2 bg-white text-[#1B2B5E] px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-50 transition text-sm"
          >
            <Plus size={18} /> Publicar propiedad
          </Link>
        </div>

        {/* Stats */}
        {cargando ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse h-24" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {statCards.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: s.bg, color: s.color }}
                >
                  {s.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Properties */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Mis propiedades recientes</h2>
              <Link to="/panel/propiedades" className="text-sm text-blue-700 hover:underline">
                Ver todas
              </Link>
            </div>
            {propiedades.length === 0 && !cargando ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                Aún no has publicado propiedades.
              </div>
            ) : (
              <div className="space-y-3">
                {propiedades.map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      {p.main_image ? (
                        <img src={p.main_image} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">🏠</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{p.title}</p>
                      <p className="text-xs text-gray-500">{formatPrice(p.price)}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Eye size={12} /> {p.views_count}
                    </div>
                    <Link to={`/panel/propiedades/editar/${p.id}`} className="text-gray-400 hover:text-blue-700">
                      <Edit2 size={14} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Views Activity */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={18} className="text-[#1B2B5E]" />
              <h2 className="font-bold text-gray-900">Vistas por propiedad</h2>
            </div>
            {actividad.length === 0 && !cargando ? (
              <div className="text-center py-8 text-gray-400 text-sm">Sin datos aún.</div>
            ) : (
              <div className="space-y-3">
                {actividad.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span className="truncate max-w-[200px]">{item.title}</span>
                      <span className="font-medium">{item.views_count}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1B2B5E] rounded-full transition-all"
                        style={{ width: `${(item.views_count / maxViews) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-bold text-gray-900 mb-4">Acciones rápidas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Publicar propiedad", to: "/panel/propiedades/crear", icon: "🏠" },
              { label: "Mis propiedades", to: "/panel/propiedades", icon: "📋" },
              { label: "Mensajes", to: "/panel/chat", icon: "💬" },
              { label: "Ver catálogo", to: "/catalogo", icon: "🔍" },
            ].map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-sm hover:border-blue-200 transition"
              >
                <div className="text-2xl mb-2">{action.icon}</div>
                <div className="text-sm font-medium text-gray-700">{action.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
