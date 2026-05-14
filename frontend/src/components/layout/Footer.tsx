import { Link } from "react-router-dom";
import { Home, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer style={{ background: "linear-gradient(135deg, #111829 0%, #1B2B5E 100%)", color: "white" }}>
      <div className="max-w-[1400px] mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <div
                style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
              >
                <Home size={17} color="white" />
              </div>
              <span style={{ letterSpacing: "-0.5px" }} className="text-xl font-semibold">Habitta</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", lineHeight: "1.7" }}>
              La plataforma inmobiliaria premium que conecta a las personas con sus hogares ideales en México.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {["IG", "TW", "LI", "FB"].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", fontSize: "11px", fontWeight: "600" }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-[rgba(255,255,255,0.2)]"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Explorar */}
          <div>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "13px", letterSpacing: "0.08em" }} className="uppercase font-semibold mb-5">
              Explorar
            </p>
            <ul className="space-y-3">
              {[
                { label: "Propiedades en venta", path: "/catalogo?listing_type=sale" },
                { label: "Propiedades en renta", path: "/catalogo?listing_type=rent" },
                { label: "Casas", path: "/catalogo?type=house" },
                { label: "Departamentos", path: "/catalogo?type=apartment" },
                { label: "Amueblar con IA", path: "/catalogo" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}
                    className="transition-all hover:text-white hover:opacity-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Compañía */}
          <div>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "13px", letterSpacing: "0.08em" }} className="uppercase font-semibold mb-5">
              Compañía
            </p>
            <ul className="space-y-3">
              {["Acerca de Habitta", "Nuestros agentes", "Carreras", "Blog", "Prensa", "Política de privacidad"].map((item) => (
                <li key={item}>
                  <a href="#" style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }} className="transition-all hover:text-white">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "13px", letterSpacing: "0.08em" }} className="uppercase font-semibold mb-5">
              Contacto
            </p>
            <ul className="space-y-4">
              {[
                { icon: <MapPin size={15} />, text: "Av. Presidente Masaryk 123, Polanco, CDMX" },
                { icon: <Mail size={15} />, text: "hola@habitta.mx" },
                { icon: <Phone size={15} />, text: "+52 55 1234 5678" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: "#C9A96E", marginTop: "2px" }}>{item.icon}</span>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", lineHeight: "1.5" }}>{item.text}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }} className="mb-3 font-medium">Recibe novedades</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Tu correo"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "white", fontSize: "13px" }}
                  className="flex-1 px-3 py-2 rounded-xl outline-none placeholder:text-[rgba(255,255,255,0.3)] focus:border-[rgba(201,169,110,0.5)]"
                />
                <button
                  style={{ background: "linear-gradient(135deg, #C9A96E, #B8924A)", color: "white", fontSize: "13px" }}
                  className="px-4 py-2 rounded-xl font-medium transition-all hover:opacity-90 shrink-0"
                >
                  Suscribir
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px" }}>
            © {new Date().getFullYear()} Habitta. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-5">
            {["Términos de servicio", "Privacidad", "Cookies"].map((item) => (
              <a key={item} href="#" style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px" }} className="hover:text-white transition-all">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
