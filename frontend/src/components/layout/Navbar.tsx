import { Link, useLocation, useNavigate } from "react-router-dom";
import { MessageSquare, Home, ChevronDown, Menu, X, LogOut, Building2, Bell } from "lucide-react";
import { useState } from "react";
import { useAutenticacion } from "../../hooks/useAutenticacion";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, cerrarSesion } = useAutenticacion();
  const puedePublicar = !usuario || (usuario.roles ?? []).some((r) => r === "propietario" || r === "admin");

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await cerrarSesion();
    navigate("/login");
  };

  return (
    <header
      style={{ backgroundColor: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(27,43,94,0.08)" }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div style={{ background: "linear-gradient(135deg, #1B2B5E, #4A5FA8)" }} className="w-8 h-8 rounded-xl flex items-center justify-center">
            <Home size={16} color="white" />
          </div>
          <span style={{ color: "#1B2B5E", letterSpacing: "-0.5px" }} className="text-xl font-semibold">Habitta</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: "Comprar", path: "/catalogo?listing_type=sale" },
            { label: "Rentar", path: "/catalogo?listing_type=rent" },
            ...(puedePublicar ? [{ label: "Publicar", path: usuario ? "/panel/propiedades/crear" : "/registro" }] : []),
            { label: "Explorar", path: "/catalogo" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.path}
              style={{ color: isActive(item.path) ? "#1B2B5E" : "#5A6280", backgroundColor: isActive(item.path) ? "rgba(27,43,94,0.07)" : "transparent" }}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-[rgba(27,43,94,0.06)] hover:text-[#1B2B5E]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {usuario ? (
            <>
              <Link to="/panel/chat" className="relative w-9 h-9 hidden md:flex items-center justify-center rounded-xl hover:bg-[rgba(27,43,94,0.06)]" style={{ color: "#5A6280" }}>
                <MessageSquare size={19} />
              </Link>

              <button className="relative w-9 h-9 hidden md:flex items-center justify-center rounded-xl hover:bg-[rgba(27,43,94,0.06)]" style={{ color: "#5A6280" }}>
                <Bell size={19} />
              </button>

              {/* User Menu */}
              <div className="relative ml-1">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-2xl hover:bg-[rgba(27,43,94,0.06)]"
                >
                  <div style={{ background: "linear-gradient(135deg, #1B2B5E, #4A5FA8)", color: "white", fontSize: "12px" }} className="w-8 h-8 rounded-full flex items-center justify-center font-semibold">
                    {usuario.nombre.charAt(0)}
                  </div>
                  <ChevronDown size={14} style={{ color: "#5A6280" }} />
                </button>

                {userMenuOpen && (
                  <div style={{ backgroundColor: "white", border: "1px solid rgba(27,43,94,0.1)", boxShadow: "0 8px 32px rgba(27,43,94,0.12)" }} className="absolute right-0 top-12 w-56 rounded-2xl overflow-hidden z-50">
                    <div style={{ borderBottom: "1px solid rgba(27,43,94,0.08)" }} className="px-4 py-3">
                      <p style={{ color: "#1B2B5E" }} className="text-sm font-semibold">{usuario.nombre} {usuario.apellido}</p>
                      <p style={{ color: "#8A92B2", fontSize: "12px" }}>{usuario.email}</p>
                    </div>
                    {[
                      { label: "Panel", icon: <Building2 size={15} />, path: "/panel" },
                      { label: "Mis propiedades", icon: <Home size={15} />, path: "/panel/propiedades" },
                      { label: "Mensajes", icon: <MessageSquare size={15} />, path: "/panel/chat" },
                      ...((usuario.roles ?? []).includes("admin")
                        ? [{ label: "Admin", icon: <Building2 size={15} />, path: "/admin/users" }]
                        : []),
                    ].map((item) => (
                      <Link key={item.label} to={item.path} onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-[rgba(27,43,94,0.04)]" style={{ color: "#3A4570" }}>
                        <span style={{ color: "#8A92B2" }}>{item.icon}</span>
                        <span style={{ fontSize: "14px" }}>{item.label}</span>
                      </Link>
                    ))}
                    <div style={{ borderTop: "1px solid rgba(27,43,94,0.08)" }}>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[rgba(220,80,80,0.06)]" style={{ color: "#E06B6B" }}>
                        <LogOut size={15} />
                        <span style={{ fontSize: "14px" }}>Cerrar sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" style={{ color: "#1B2B5E" }} className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-[rgba(27,43,94,0.06)]">
                Iniciar sesión
              </Link>
              <Link to="/registro" style={{ background: "linear-gradient(135deg, #1B2B5E, #4A5FA8)", color: "white" }} className="px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 shadow-sm">
                Registrarse
              </Link>
            </div>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl" style={{ color: "#5A6280" }}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{ borderTop: "1px solid rgba(27,43,94,0.08)", backgroundColor: "rgba(255,255,255,0.98)" }} className="md:hidden px-6 pb-4 space-y-1">
          {[
            { label: "Comprar", path: "/catalogo?listing_type=sale" },
            { label: "Rentar", path: "/catalogo?listing_type=rent" },
            { label: "Explorar", path: "/catalogo" },
            ...(puedePublicar ? [{ label: "Publicar", path: usuario ? "/panel/propiedades/crear" : "/registro" }] : []),
            ...(usuario ? [
              { label: "Panel", path: "/panel" },
              { label: "Mensajes", path: "/panel/chat" },
            ] : [
              { label: "Iniciar sesión", path: "/login" },
            ]),
          ].map((item) => (
            <Link key={item.label} to={item.path} onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[rgba(27,43,94,0.06)]" style={{ color: "#3A4570" }}>
              {item.label}
            </Link>
          ))}
          {usuario && (
            <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium" style={{ color: "#E06B6B" }}>
              Cerrar sesión
            </button>
          )}
        </div>
      )}
    </header>
  );
}
