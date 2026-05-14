import { useEffect, useState } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { obtenerUsuariosAdmin, actualizarRolUsuario, type AdminUser } from "../../services/admin";
import { useAutenticacion } from "../../hooks/useAutenticacion";

const ROLES = ["admin", "propietario", "visitante_registrado"] as const;

function RolBadge({ rol }: { rol: string | undefined }) {
  const style =
    rol === "admin"
      ? { background: "rgba(201,169,110,0.15)", color: "#8A6230" }
      : rol === "propietario"
      ? { background: "rgba(27,43,94,0.1)", color: "#1B2B5E" }
      : { background: "rgba(138,146,178,0.1)", color: "#8A92B2" };

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" style={style}>
      {rol ?? "sin rol"}
    </span>
  );
}

export function AdminUsersPage() {
  const { usuario, refrescarPerfil } = useAutenticacion();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [cargando, setCargando] = useState(true);
  const [roles, setRoles] = useState<Record<number, string>>({});
  const [guardando, setGuardando] = useState<Record<number, boolean>>({});
  const [exito, setExito] = useState<string | null>(null);

  useEffect(() => {
    obtenerUsuariosAdmin()
      .then((data) => {
        setUsers(data);
        const init: Record<number, string> = {};
        data.forEach((u) => {
          init[u.id] = u.roles[0] ?? "visitante_registrado";
        });
        setRoles(init);
      })
      .finally(() => setCargando(false));
  }, []);

  async function handleSave(id: number) {
    setGuardando((prev) => ({ ...prev, [id]: true }));
    try {
      await actualizarRolUsuario(id, roles[id]);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, roles: [roles[id]] } : u))
      );
      // If admin changed their own role, refresh auth context immediately
      if (usuario?.id === id) {
        await refrescarPerfil();
      }
      setExito("Rol actualizado correctamente.");
      setTimeout(() => setExito(null), 3000);
    } finally {
      setGuardando((prev) => ({ ...prev, [id]: false }));
    }
  }

  return (
    <DashboardLayout title="Usuarios" subtitle="Gestión de roles">
      {exito && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm">
          {exito}
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
                {["Usuario", "Email", "Rol actual", "Cambiar rol"].map((h) => (
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
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b"
                  style={{ borderColor: "rgba(27,43,94,0.06)" }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0"
                        style={{ background: "linear-gradient(135deg,#1B2B5E,#4A5FA8)" }}
                      >
                        {u.nombre.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium" style={{ color: "#1B2B5E" }}>
                        {u.nombre} {u.apellido}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4" style={{ color: "#5A6280" }}>
                    {u.email}
                  </td>
                  <td className="px-6 py-4">
                    <RolBadge rol={u.roles[0]} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={roles[u.id] ?? "visitante_registrado"}
                        onChange={(e) =>
                          setRoles((prev) => ({ ...prev, [u.id]: e.target.value }))
                        }
                        className="text-sm rounded-xl border px-3 py-1.5 focus:outline-none"
                        style={{
                          borderColor: "rgba(27,43,94,0.2)",
                          color: "#1B2B5E",
                          background: "white",
                        }}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleSave(u.id)}
                        disabled={guardando[u.id]}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium text-white disabled:opacity-50"
                        style={{
                          background: "linear-gradient(135deg,#1B2B5E,#4A5FA8)",
                        }}
                      >
                        {guardando[u.id] ? "..." : "Guardar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="text-center py-12 text-sm" style={{ color: "#8A92B2" }}>
              No hay usuarios registrados.
            </p>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
