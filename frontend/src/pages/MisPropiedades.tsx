import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye, Edit2, X, Search } from "lucide-react";
import {
  obtenerMisPropiedades,
  eliminarPropiedad,
  cerrarPropiedad,
  type Propiedad,
  type ListadoPropiedades,
  type DatosCierrePropiedad,
} from "../services/propiedades";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { ModalCierre } from "../components/modals/modalCierre";

const TIPO_LABEL: Record<string, string> = {
  house: "Casa", apartment: "Departamento", land: "Terreno",
  studio: "Estudio", commercial: "Local", office: "Oficina",
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(price);
}

export function MisPropiedades() {
  const [listado, setListado] = useState<ListadoPropiedades | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<"" | "active" | "closed">("");
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [propiedadACerrar, setPropiedadACerrar] = useState<Propiedad | null>(null);
  const [cerrando, setCerrando] = useState(false);

  const cargar = async () => {
    setCargando(true);
    try {
      const data = await obtenerMisPropiedades({
        status: filtroEstado || undefined,
        q: busqueda || undefined,
      });
      setListado(data);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, [filtroEstado, busqueda]);

  const handleEliminar = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta propiedad?")) return;
    await eliminarPropiedad(id);
    cargar();
  };

  const handleConfirmarCierre = async (datos: DatosCierrePropiedad) => {
    if (!propiedadACerrar) return;
    setCerrando(true);
    try {
      await cerrarPropiedad(propiedadACerrar.id, datos);
      setPropiedadACerrar(null);
      cargar();
    } finally {
      setCerrando(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Propiedades</h1>
            <p className="text-gray-500 text-sm mt-1">
              {listado?.meta.total ?? 0} propiedad{listado?.meta.total !== 1 ? "es" : ""}
            </p>
          </div>
          <Link
            to="/panel/propiedades/crear"
            className="flex items-center gap-2 bg-[#1B2B5E] text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-800 transition"
          >
            <Plus size={18} />
            Publicar propiedad
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            {(["", "active", "closed"] as const).map((estado) => (
              <button
                key={estado}
                onClick={() => setFiltroEstado(estado)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  filtroEstado === estado
                    ? "bg-[#1B2B5E] text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {estado === "" ? "Todas" : estado === "active" ? "Activas" : "Cerradas"}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {cargando ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900" />
          </div>
        ) : listado?.data.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg mb-4">No tienes propiedades publicadas aún.</p>
            <Link
              to="/panel/propiedades/crear"
              className="bg-[#1B2B5E] text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-800"
            >
              Publicar mi primera propiedad
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {listado?.data.map((p) => (
              <div
                key={p.id}
                className={`bg-white rounded-2xl border overflow-hidden flex flex-col sm:flex-row ${
                  p.status === "closed" ? "border-gray-200 opacity-75" : "border-gray-100"
                }`}
              >
                {/* Image */}
                <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-gray-100">
                  {p.main_image ? (
                    <img src={p.main_image} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">🏠</div>
                  )}
                  {p.status === "closed" && (
                    <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                      <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">Cerrada</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 p-4 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex gap-2 mb-1">
                        <span className="text-xs bg-blue-50 text-blue-900 font-medium px-2 py-0.5 rounded">
                          {TIPO_LABEL[p.type]}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded">
                          {p.listing_type === "sale" ? "Venta" : "Renta"}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{p.title}</h3>
                      <p className="text-sm text-gray-500">{p.city}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-blue-900">{formatPrice(p.price)}</div>
                      <div className="text-xs text-gray-500">{p.views_count} vistas</div>
                    </div>
                  </div>

                  {p.close_reason && (
                    <p className="text-xs text-red-600 mt-2 bg-red-50 px-3 py-2 rounded-lg">
                      Motivo de cierre: {p.close_reason}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto pt-3">
                    <Link
                      to={`/propiedad/${p.id}`}
                      className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-900 border border-gray-200 rounded-lg px-3 py-1.5"
                    >
                      <Eye size={14} /> Ver
                    </Link>
                    {p.status === "active" && (
                      <>
                        <Link
                          to={`/panel/propiedades/editar/${p.id}`}
                          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-900 border border-gray-200 rounded-lg px-3 py-1.5"
                        >
                          <Edit2 size={14} /> Editar
                        </Link>
                        <button
                          onClick={() => setPropiedadACerrar(p)}
                          className="flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 border border-amber-200 rounded-lg px-3 py-1.5"
                        >
                          <X size={14} /> Cerrar
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleEliminar(p.id)}
                      className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 border border-red-200 rounded-lg px-3 py-1.5 ml-auto"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ModalCierre
        isOpen={propiedadACerrar !== null}
        onClose={() => setPropiedadACerrar(null)}
        propertyTitle={propiedadACerrar?.title ?? ""}
        onConfirm={handleConfirmarCierre}
        isLoading={cerrando}
      />
    </DashboardLayout>
  );
}
