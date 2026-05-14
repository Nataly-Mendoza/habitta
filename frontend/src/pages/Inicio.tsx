import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Star, TrendingUp, Shield, Headphones, ArrowRight, Search } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { PropertyCard } from "../components/ui/PropertyCard";
import { obtenerPropiedades, obtenerCiudades, type Propiedad } from "../services/propiedades";
import { useAutenticacion } from "../hooks/useAutenticacion";

const CITY_IMAGES: Record<string, string> = {
  "Ciudad de México": "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&q=80",
  "Monterrey": "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
  "Guadalajara": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
  "Cancún": "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800&q=80",
  "Querétaro": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  "Mérida": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
};
const DEFAULT_CITY_IMG = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80";

export function HomePage() {
  const navigate = useNavigate();
  const { usuario } = useAutenticacion();
  const [featuredProperties, setFeaturedProperties] = useState<Propiedad[]>([]);
  const [ciudades, setCiudades] = useState<{ city: string; count: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cargandoPropiedades, setCargandoPropiedades] = useState(true);

  useEffect(() => {
    obtenerPropiedades({ per_page: 3, sort: "newest" })
      .then((res) => setFeaturedProperties(res.data))
      .catch(() => {})
      .finally(() => setCargandoPropiedades(false));

    obtenerCiudades().then(setCiudades).catch(() => {});
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/catalogo");
    }
  };

  const totalPropiedades = ciudades.reduce((acc, c) => acc + c.count, 0);

  return (
    <div style={{ backgroundColor: "#F8F4EE", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div style={{ background: "linear-gradient(135deg, rgba(17,24,41,0.82) 0%, rgba(27,43,94,0.65) 50%, rgba(17,24,41,0.4) 100%)" }} className="absolute inset-0" />
          <div style={{ background: "rgba(201,169,110,0.15)", width: "600px", height: "600px", borderRadius: "50%", position: "absolute", top: "-100px", right: "-100px", filter: "blur(80px)" }} />
          <div style={{ background: "rgba(74,95,168,0.15)", width: "400px", height: "400px", borderRadius: "50%", position: "absolute", bottom: "-50px", left: "20%", filter: "blur(60px)" }} />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6 w-full py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <span style={{ background: "rgba(201,169,110,0.25)", border: "1px solid rgba(201,169,110,0.4)", color: "#C9A96E", fontSize: "13px", backdropFilter: "blur(10px)" }} className="px-4 py-1.5 rounded-full font-semibold">
                ✦ Plataforma inmobiliaria premium en México
              </span>
            </div>

            <h1 style={{ color: "white", fontSize: "clamp(36px, 5vw, 68px)", fontWeight: "700", lineHeight: "1.1", letterSpacing: "-1px" }} className="mb-5">
              Encuentra tu propiedad <span style={{ color: "#C9A96E" }}>ideal</span>
            </h1>

            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "18px", lineHeight: "1.7", maxWidth: "500px" }} className="mb-10">
              {totalPropiedades > 0 ? `${totalPropiedades}+` : "Miles de"} propiedades premium en las mejores ciudades de México
            </p>

            <div className="flex items-center gap-8 mb-10">
              {[
                { value: `${totalPropiedades > 0 ? totalPropiedades : "12K"}+`, label: "Propiedades" },
                { value: "8,500+", label: "Clientes felices" },
                { value: "98%", label: "Satisfacción" },
              ].map((stat, i) => (
                <div key={i}>
                  <p style={{ color: "#C9A96E", fontSize: "24px", fontWeight: "700" }}>{stat.value}</p>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px" }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Buscador */}
          <div
            style={{
              background: "rgba(255,255,255,0.97)",
              backdropFilter: "blur(20px)",
              borderRadius: "24px",
              boxShadow: "0 32px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.6)",
              maxWidth: "700px",
            }}
            className="p-4 flex items-center gap-3"
          >
            <div className="flex-1 flex items-center gap-3 bg-[#F0F2F8] rounded-xl px-4 py-3">
              <Search size={18} className="text-[#8A92B2] shrink-0" />
              <input
                type="text"
                placeholder="Ciudad, colonia, tipo de propiedad..."
                className="bg-transparent outline-none text-sm text-[#1B2B5E] w-full placeholder:text-[#B0B8D0]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              style={{ background: "linear-gradient(135deg, #1B2B5E, #4A5FA8)", color: "white" }}
              className="px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap hover:opacity-90 transition"
            >
              Buscar
            </button>
            <button
              onClick={() => navigate("/catalogo?listing_type=sale")}
              style={{ color: "#1B2B5E", border: "1.5px solid rgba(27,43,94,0.2)" }}
              className="px-4 py-3 rounded-xl font-semibold text-sm whitespace-nowrap hover:bg-[rgba(27,43,94,0.04)] transition"
            >
              Venta
            </button>
            <button
              onClick={() => navigate("/catalogo?listing_type=rent")}
              style={{ color: "#2A7A4E", border: "1.5px solid rgba(42,122,78,0.2)" }}
              className="px-4 py-3 rounded-xl font-semibold text-sm whitespace-nowrap hover:bg-[rgba(42,122,78,0.04)] transition"
            >
              Renta
            </button>
          </div>
        </div>
      </section>

      {/* Tipos de propiedad */}
      <section style={{ backgroundColor: "#F8F4EE" }} className="py-12">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {[
              { label: "🏠 Casas", type: "house" },
              { label: "🏢 Departamentos", type: "apartment" },
              { label: "🌿 Terrenos", type: "land" },
              { label: "🏙 Estudios", type: "studio" },
              { label: "🏪 Locales", type: "commercial" },
              { label: "🏛 Oficinas", type: "office" },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(`/catalogo?type=${item.type}`)}
                style={{ background: "white", border: "1.5px solid rgba(27,43,94,0.09)", borderRadius: "100px", color: "#3A4570", boxShadow: "0 2px 8px rgba(27,43,94,0.05)" }}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-all hover:shadow-md hover:border-[rgba(27,43,94,0.2)] hover:-translate-y-0.5"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Propiedades destacadas */}
      <section style={{ backgroundColor: "#F8F4EE" }} className="pb-16">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p style={{ color: "#C9A96E", fontSize: "13px", letterSpacing: "0.1em" }} className="uppercase font-semibold mb-2">✦ Selección curada</p>
              <h2 style={{ color: "#1B2B5E", fontSize: "32px", fontWeight: "700", letterSpacing: "-0.5px" }}>Propiedades destacadas</h2>
            </div>
            <button
              onClick={() => navigate("/catalogo")}
              style={{ color: "#4A5FA8", border: "1.5px solid rgba(74,95,168,0.2)", borderRadius: "14px" }}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all hover:bg-[rgba(74,95,168,0.06)]"
            >
              Ver todas <ChevronRight size={16} />
            </button>
          </div>

          {cargandoPropiedades ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl animate-pulse h-72 border border-gray-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Por qué Habitta */}
      <section style={{ background: "linear-gradient(135deg, #F0EDE6, #E8E4DA)" }} className="py-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-14">
            <p style={{ color: "#C9A96E", fontSize: "13px", letterSpacing: "0.1em" }} className="uppercase font-semibold mb-3">✦ ¿Por qué elegirnos?</p>
            <h2 style={{ color: "#1B2B5E", fontSize: "36px", fontWeight: "700", letterSpacing: "-0.5px" }} className="mb-4">La diferencia Habitta</h2>
            <p style={{ color: "#6A7280", fontSize: "16px", maxWidth: "500px", margin: "0 auto", lineHeight: "1.7" }}>
              Combinamos tecnología avanzada con conocimiento local profundo para ofrecer una experiencia inmobiliaria excepcional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <Star size={22} />, title: "Calidad premium", desc: "Cada propiedad es verificada y curada bajo nuestros altos estándares de calidad.", color: "#C9A96E" },
              { icon: <TrendingUp size={22} />, title: "Análisis de mercado", desc: "Datos en tiempo real e IA para ayudarte a tomar decisiones bien informadas.", color: "#4A5FA8" },
              { icon: <Shield size={22} />, title: "Transacciones seguras", desc: "Seguridad bancaria y agentes verificados garantizan operaciones transparentes.", color: "#2A7A4E" },
              { icon: <Headphones size={22} />, title: "Soporte experto", desc: "Expertos inmobiliarios disponibles 7 días a la semana para orientación personalizada.", color: "#9B5FA8" },
            ].map((item, i) => (
              <div
                key={i}
                style={{ background: "white", borderRadius: "22px", border: "1px solid rgba(27,43,94,0.06)", boxShadow: "0 4px 20px rgba(27,43,94,0.05)" }}
                className="p-6 group hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div style={{ background: `${item.color}15`, border: `1px solid ${item.color}25`, width: "52px", height: "52px", borderRadius: "16px" }} className="flex items-center justify-center mb-5">
                  <span style={{ color: item.color }}>{item.icon}</span>
                </div>
                <h3 style={{ color: "#1B2B5E", fontSize: "17px", fontWeight: "600" }} className="mb-2">{item.title}</h3>
                <p style={{ color: "#8A92B2", fontSize: "14px", lineHeight: "1.6" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ciudades */}
      {ciudades.length > 0 && (
        <section style={{ backgroundColor: "#F8F4EE" }} className="py-20">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p style={{ color: "#C9A96E", fontSize: "13px", letterSpacing: "0.1em" }} className="uppercase font-semibold mb-2">✦ Explorar por ciudad</p>
                <h2 style={{ color: "#1B2B5E", fontSize: "32px", fontWeight: "700", letterSpacing: "-0.5px" }}>Destinos populares</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {ciudades.slice(0, 6).map((item, i) => (
                <button
                  key={i}
                  onClick={() => navigate(`/catalogo?city=${encodeURIComponent(item.city)}`)}
                  className="relative overflow-hidden group"
                  style={{ borderRadius: "20px", height: "160px" }}
                >
                  <img
                    src={CITY_IMAGES[item.city] ?? DEFAULT_CITY_IMG}
                    alt={item.city}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div style={{ background: "linear-gradient(to top, rgba(17,24,41,0.8) 0%, rgba(17,24,41,0.1) 100%)" }} className="absolute inset-0" />
                  <div className="absolute bottom-3 left-3 text-left">
                    <p style={{ color: "white", fontWeight: "600", fontSize: "15px" }}>{item.city}</p>
                    <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "12px" }}>{item.count} propiedades</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <div
            style={{ background: "linear-gradient(135deg, #111829, #1B2B5E)", borderRadius: "28px", overflow: "hidden", position: "relative" }}
            className="p-12 md:p-16"
          >
            <div style={{ background: "rgba(201,169,110,0.15)", width: "500px", height: "500px", borderRadius: "50%", position: "absolute", top: "-150px", right: "-100px", filter: "blur(80px)" }} />
            <div style={{ background: "rgba(74,95,168,0.2)", width: "300px", height: "300px", borderRadius: "50%", position: "absolute", bottom: "-80px", left: "10%", filter: "blur(60px)" }} />
            <div className="relative text-center">
              <p style={{ color: "#C9A96E", fontSize: "13px", letterSpacing: "0.1em" }} className="uppercase font-semibold mb-4">✦ Publica tu propiedad</p>
              <h2 style={{ color: "white", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: "700", letterSpacing: "-0.5px" }} className="mb-4">
                ¿Listo para vender o rentar?
              </h2>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", maxWidth: "480px", margin: "0 auto 8px" }}>
                Publica tu propiedad en Habitta y conecta con miles de compradores y arrendatarios calificados.
              </p>
              <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
                <button
                  onClick={() => navigate(usuario ? "/panel/propiedades/crear" : "/registro")}
                  style={{ background: "linear-gradient(135deg, #C9A96E, #B8924A)", color: "white" }}
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-base transition-all hover:opacity-90 hover:shadow-xl"
                >
                  Publicar propiedad <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => navigate("/catalogo")}
                  style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}
                  className="px-8 py-4 rounded-2xl font-semibold text-base transition-all hover:bg-[rgba(255,255,255,0.15)]"
                >
                  Explorar catálogo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
