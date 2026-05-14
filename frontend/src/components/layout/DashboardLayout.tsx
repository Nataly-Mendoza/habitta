import { type ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Home, Plus, MessageSquare, Settings, ChevronRight, Building2, Menu, Users, ListFilter } from "lucide-react";
import { useAutenticacion } from "../../hooks/useAutenticacion";
import { obtenerNoLeidas } from "../../services/chat";

const SidebarContent = ({
  isActive,
  setSidebarOpen,
  nombreUsuario,
  unreadCount,
  isAdmin,
}: {
  isActive: (path: string) => boolean;
  setSidebarOpen: (open: boolean) => void;
  nombreUsuario: string;
  unreadCount: number;
  isAdmin: boolean;
}) => {
  const navItems = [
    { label: "Panel", icon: <LayoutDashboard size={18} />, path: "/panel" },
    { label: "Mis propiedades", icon: <Home size={18} />, path: "/panel/propiedades" },
    { label: "Publicar", icon: <Plus size={18} />, path: "/panel/propiedades/crear" },
    { label: "Mensajes", icon: <MessageSquare size={18} />, path: "/panel/chat", badge: unreadCount > 0 ? unreadCount : undefined },
    { label: "Configuración", icon: <Settings size={18} />, path: "/panel/configuracion" },
  ];

  const adminItems = isAdmin
    ? [
        { label: "Usuarios", icon: <Users size={18} />, path: "/admin/users" },
        { label: "Todas las props.", icon: <ListFilter size={18} />, path: "/admin/properties" },
      ]
    : [];

  return (
    <div className="flex flex-col h-full">
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }} className="px-6 h-16 flex items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
            <Building2 size={15} color="white" />
          </div>
          <span className="text-lg font-semibold text-white tracking-tighter">Habitta</span>
        </Link>
      </div>

      <div className="px-4 py-5">
        <div
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
          className="rounded-2xl p-4"
        >
          <div className="flex items-center gap-3">
            <div
              style={{ background: "linear-gradient(135deg, #C9A96E, #B8924A)", color: "white", fontSize: "14px" }}
              className="w-10 h-10 rounded-full flex items-center justify-center font-semibold shrink-0"
            >
              {nombreUsuario.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{nombreUsuario}</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }} className="truncate">Miembro</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="px-4 flex-1 mt-6 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.label}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center justify-between px-4 py-2.5 rounded-xl transition-all group ${
                active ? "bg-white/15 text-white border border-white/20" : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`${active ? "text-[#C9A96E]" : "text-white/40"} group-hover:text-[#C9A96E]`}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {item.badge ? (
                <span className="w-5 h-5 bg-[#C9A96E] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {item.badge}
                </span>
              ) : active && <ChevronRight size={14} className="opacity-40" />}
            </Link>
          );
        })}

        {adminItems.length > 0 && (
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <p className="px-4 mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(201,169,110,0.7)" }}>
              Admin
            </p>
            {adminItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group ${
                    active ? "bg-white/15 text-white border border-white/20" : "text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className={`${active ? "text-[#C9A96E]" : "text-white/40"} group-hover:text-[#C9A96E]`}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </div>
  );
};

export function DashboardLayout({ children, title, subtitle }: { children: ReactNode; title?: string; subtitle?: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const { usuario } = useAutenticacion();
  const isActive = (path: string) => location.pathname === path;
  const nombreUsuario = usuario ? `${usuario.nombre} ${usuario.apellido ?? ""}`.trim() : "Usuario";
  const isAdmin = (usuario?.roles ?? []).includes("admin");

  useEffect(() => {
    obtenerNoLeidas()
      .then((data) => setUnreadCount(data.unread_count))
      .catch(() => {});
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex bg-[#F4F1EC]">
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-[260px] z-40 bg-gradient-to-b from-[#111829] to-[#1B2B5E]">
        <SidebarContent isActive={isActive} setSidebarOpen={setSidebarOpen} nombreUsuario={nombreUsuario} unreadCount={unreadCount} isAdmin={isAdmin} />
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-[260px] h-full bg-gradient-to-b from-[#111829] to-[#1B2B5E] shadow-2xl">
            <SidebarContent isActive={isActive} setSidebarOpen={setSidebarOpen} nombreUsuario={nombreUsuario} unreadCount={unreadCount} isAdmin={isAdmin} />
          </aside>
        </div>
      )}

      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 h-16 bg-[#F4F1EC]/95 backdrop-blur-md border-b border-[#1B2B5E]/10 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[#5A6280]">
              <Menu size={20} />
            </button>
            {title && (
              <div>
                <h1 className="text-[#1B2B5E] text-lg font-bold leading-none">{title}</h1>
                {subtitle && <p className="text-[#8A92B2] text-xs">{subtitle}</p>}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1B2B5E] to-[#4A5FA8] text-white flex items-center justify-center text-xs font-bold">
              {nombreUsuario.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
