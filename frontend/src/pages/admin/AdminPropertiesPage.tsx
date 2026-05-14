import { useEffect, useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { obtenerPropiedadesAdmin, type AdminProperty } from "../../services/admin";
import { api } from "../../services/api";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(price);
}

export function AdminPropertiesPage() {
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [closeReason, setCloseReason] = useState<Record<number, string>>({});
  const [showCloseForm, setShowCloseForm] = useState<Record<number, boolean>>({});

  function showMsg(msg: string) {
    setMensaje(msg);
    setTimeout(() => setMensaje(null), 3000);
  }

  useEffect(() => {
    obtenerPropiedadesAdmin()
      .then(setProperties)
      .finally(() => setCargando(false));
  }, []);

  async function handleDelete(id: number, title: string) {
    if (!confirm(`¿Eliminar permanentemente "${title}"?`)) return;
    await api.delete(`/properties/${id}`);
    setProperties((prev) => prev.filter((p) => p.id !== id));
    showMsg(`"${title}" eliminada.`);
  }

  async function handleClose(p: AdminProperty) {
    const reason = (closeReason[p.id] ?? "").trim();
    if (!reason) return;
    await api.post(`/properties/${p.id}/close`, { reason });
    setProperties((prev) =>
      prev.map((x) =>
        x.id === p.id ? { ...x, status: "closed" as const, close_reason: reason } : x
      )
    );
    setShowCloseForm((prev) => ({ ...prev, [p.id]: false }));
    showMsg(`"${p.title}" cerrada.`);
  }

  return (
    <DashboardLayout title="Propiedades" subtitle="Activas y cerradas de todos los propietarios">
      {mensaje && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm">
          {mensaje}
        </div>
      )}

      {cargando ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-[rgba(27,43,94,0.2)] border-t-[#1B2B5E] rounded-full animate-spin" />
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "white",
            border: "1px solid rgba(27,43,94,0.08)",
            boxShadow: "0 2px 12px rgba(27,43,94,0.06)",
          }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  background: "rgba(27,43,94,0.04)",
                  borderBottom: "1px solid rgba(27,43,94,0.08)",
                }}
              >
                {["Propiedad", "Propietario", "Precio", "Estado", "Acciones"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "#8A92B2" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <>
                  <tr
                    key={p.id}
                    className="border-b"
                    style={{ borderColor: "rgba(27,43,94,0.06)" }}
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium" style={{ color: "#1B2B5E" }}>
                        {p.title}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "#8A92B2" }}>
                        {p.city} · {p.type}
                      </p>
                    </td>
                    <td className="px-6 py-4" style={{ color: "#5A6280" }}>
                      {p.owner ? p.owner.nombre : "—"}
                    </td>
                    <td className="px-6 py-4 font-medium" style={{ color: "#1B2B5E" }}>
                      {formatPrice(p.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{
                          background:
                            p.status === "active"
                              ? "rgba(42,122,78,0.1)"
                              : "rgba(138,146,178,0.1)",
                          color: p.status === "active" ? "#2A7A4E" : "#8A92B2",
                        }}
                      >
                        {p.status === "active" ? "Activa" : "Cerrada"}
                      </span>
                      {p.close_reason && (
                        <p className="text-xs mt-1" style={{ color: "#8A92B2" }}>
                          {p.close_reason}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {p.status === "active" && (
                          <button
                            onClick={() =>
                              setShowCloseForm((prev) => ({
                                ...prev,
                                [p.id]: !prev[p.id],
                              }))
                            }
                            className="px-3 py-1.5 rounded-xl text-xs font-medium transition"
                            style={{
                              background: "rgba(201,169,110,0.12)",
                              color: "#8A6230",
                            }}
                          >
                            Cerrar
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          className="px-3 py-1.5 rounded-xl text-xs font-medium transition"
                          style={{
                            background: "rgba(220,80,80,0.1)",
                            color: "#DC4040",
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>

                  {showCloseForm[p.id] && (
                    <tr
                      key={`close-${p.id}`}
                      className="border-b"
                      style={{
                        borderColor: "rgba(27,43,94,0.06)",
                        background: "rgba(201,169,110,0.04)",
                      }}
                    >
                      <td colSpan={5} className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            placeholder="Motivo del cierre (requerido)"
                            value={closeReason[p.id] ?? ""}
                            onChange={(e) =>
                              setCloseReason((prev) => ({
                                ...prev,
                                [p.id]: e.target.value,
                              }))
                            }
                            className="flex-1 text-sm rounded-xl border px-3 py-2 focus:outline-none"
                            style={{
                              borderColor: "rgba(27,43,94,0.2)",
                              color: "#1B2B5E",
                            }}
                          />
                          <button
                            onClick={() => handleClose(p)}
                            className="px-4 py-2 rounded-xl text-xs font-medium text-white"
                            style={{
                              background: "linear-gradient(135deg,#C9A96E,#B8924A)",
                            }}
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() =>
                              setShowCloseForm((prev) => ({
                                ...prev,
                                [p.id]: false,
                              }))
                            }
                            className="px-3 py-2 rounded-xl text-xs font-medium"
                            style={{
                              color: "#8A92B2",
                              background: "rgba(27,43,94,0.06)",
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
          {properties.length === 0 && (
            <p className="text-center py-12 text-sm" style={{ color: "#8A92B2" }}>
              No hay propiedades en el sistema.
            </p>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
