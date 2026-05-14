import { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Bed, Bath, Maximize, MapPin, Eye, Calendar, Zap, Droplets,
  Car, Trees, Waves, Shield, Dumbbell, Heart, Share2, MessageCircle
} from "lucide-react";
import {
  obtenerPropiedad, obtenerPropiedadesSimilares,
  type Propiedad
} from "../services/propiedades";
import { ContextoFavoritos } from "../context/ContextoFavoritos";
import { iniciarConversacion } from "../services/chat";
import { amoblarConIA } from "../services/ia";
import { useAutenticacion } from "../hooks/useAutenticacion";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { ModalIA } from "../components/chat/ModalIA";

const TIPO_LABEL: Record<string, string> = {
  house: "Casa", apartment: "Departamento", land: "Terreno",
  studio: "Estudio", commercial: "Local Comercial", office: "Oficina",
};

const OPERACION_LABEL: Record<string, string> = {
  sale: "Venta", rent: "Renta",
};

function formatPrice(price: number | undefined | null, listingType: string) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(price ?? 0)
    + (listingType === "rent" ? " /mes" : "");
}

export function DetallePropiedad() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { usuario, token } = useAutenticacion();

  const { favoritedIds, toggleFavorito } = useContext(ContextoFavoritos);

  const [propiedad, setPropiedad] = useState<Propiedad | null>(null);
  const [similares, setSimilares] = useState<Propiedad[]>([]);
  const [imagenActiva, setImagenActiva] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [enviandoMensaje, setEnviandoMensaje] = useState(false);
  const [mensajeInicial, setMensajeInicial] = useState("");
  const [mostrarModalIA, setMostrarModalIA] = useState(false);
  const [iaGenerando, setIaGenerando] = useState(false);
  const [iaOriginal, setIaOriginal] = useState<string | undefined>();
  const [iaGenerada, setIaGenerada] = useState<string | undefined>();
  const [iaError, setIaError] = useState<string | undefined>();
  const [iaCanRetry, setIaCanRetry] = useState(true);

  useEffect(() => {
    if (!id) return;
    setCargando(true);
    Promise.all([
      obtenerPropiedad(Number(id)),
      obtenerPropiedadesSimilares(Number(id)),
    ])
      .then(([prop, sims]) => {
        setPropiedad(prop);
        setSimilares(sims);
        setImagenActiva(0);
      })
      .catch(() => navigate("/"))
      .finally(() => setCargando(false));
  }, [id]);

  const favorito = propiedad ? favoritedIds.has(propiedad.id) : false;

  const handleFavorito = async () => {
    if (!token) { navigate("/login"); return; }
    await toggleFavorito(propiedad!.id);
  };

  const handleEnviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { navigate("/login"); return; }
    if (!mensajeInicial.trim()) return;
    setEnviandoMensaje(true);
    try {
      const res = await iniciarConversacion(propiedad!.id, mensajeInicial);
      navigate(`/panel/chat/${res.conversation.id}`);
    } finally {
      setEnviandoMensaje(false);
    }
  };

  const ejecutarIA = async (imageUrl: string) => {
    if (!token) { navigate("/login"); return; }
    setMostrarModalIA(true);
    setIaGenerando(true);
    setIaOriginal(imageUrl);
    setIaGenerada(undefined);
    setIaError(undefined);
    setIaCanRetry(true);
    try {
      const result = await amoblarConIA(imageUrl);
      setIaGenerada(result.generated);
    } catch (e: any) {
      const msg: string = e.response?.data?.message ?? e.message ?? "Error desconocido";
      const retry: boolean = e.response?.data?.retry ?? false;
      setIaError(msg);
      setIaCanRetry(retry || e.response?.status !== 422);
    } finally {
      setIaGenerando(false);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900" />
      </div>
    );
  }

  if (!propiedad) return null;

  const imagenesUrl = (propiedad.images ?? []).map((img) => img.url);

  return (
    <div className="min-h-screen" style={{ background: "#F8F4EE" }}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: "#8A92B2" }}>
          <Link to="/" style={{ color: "#8A92B2" }} className="hover:underline">Inicio</Link>
          <span>/</span>
          <Link to="/catalogo" style={{ color: "#8A92B2" }} className="hover:underline">Propiedades</Link>
          <span>/</span>
          <span style={{ color: "#1B2B5E" }} className="font-medium truncate max-w-xs">{propiedad.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Gallery + Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-200 aspect-video">
              {imagenesUrl.length > 0 ? (
                <img
                  src={imagenesUrl[imagenActiva]}
                  alt={propiedad.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=80"
                  alt={propiedad.title}
                  className="w-full h-full object-cover"
                />
              )}

              {/* AI Button — visible for all interior property types when logged in */}
              {token && propiedad.type !== "land" && imagenesUrl.length > 0 && (
                <button
                  onClick={() => ejecutarIA(imagenesUrl[imagenActiva])}
                  disabled={iaGenerando}
                  className="absolute bottom-4 right-4 backdrop-blur px-4 py-2 rounded-xl text-sm font-semibold shadow-lg transition flex items-center gap-2 disabled:opacity-60"
                  style={{ background: "rgba(255,255,255,0.92)", color: "#1B2B5E" }}
                >
                  ✨ Amueblar con IA
                </button>
              )}

              {/* Prompt unauthenticated users */}
              {!token && propiedad.type !== "land" && imagenesUrl.length > 0 && (
                <button
                  onClick={() => navigate("/login")}
                  className="absolute bottom-4 right-4 backdrop-blur px-4 py-2 rounded-xl text-sm font-semibold shadow-lg transition flex items-center gap-2"
                  style={{ background: "rgba(255,255,255,0.92)", color: "#8A92B2" }}
                >
                  ✨ Amueblar con IA
                </button>
              )}

              {/* Thumbnails */}
              {imagenesUrl.length > 1 && (
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {imagenesUrl.slice(0, 6).map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setImagenActiva(i)}
                      className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition ${
                        i === imagenActiva ? "border-white" : "border-transparent opacity-70"
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Header Info */}
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex gap-2 mb-2">
                    <span
                      style={{ background: propiedad.listing_type === "rent" ? "linear-gradient(135deg,#2A7A4E,#38A36B)" : "linear-gradient(135deg,#1B2B5E,#4A5FA8)", color: "white", fontSize: "11px" }}
                      className="px-3 py-1 rounded-lg font-semibold uppercase tracking-wider"
                    >
                      {OPERACION_LABEL[propiedad.listing_type]}
                    </span>
                    <span
                      style={{ background: "rgba(27,43,94,0.08)", color: "#5A6280", fontSize: "11px" }}
                      className="px-3 py-1 rounded-lg font-medium uppercase tracking-wider"
                    >
                      {TIPO_LABEL[propiedad.type]}
                    </span>
                    {propiedad.status === "closed" && (
                      <span
                        style={{ background: "rgba(224,107,107,0.12)", color: "#E06B6B", fontSize: "11px" }}
                        className="px-3 py-1 rounded-lg font-bold uppercase tracking-wider"
                      >
                        Cerrada
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold" style={{ color: "#1B2B5E" }}>{propiedad.title}</h1>
                  <div className="flex items-center gap-1 mt-1" style={{ color: "#8A92B2" }}>
                    <MapPin size={16} style={{ color: "#C9A96E" }} />
                    <span>{propiedad.location}, {propiedad.city}{propiedad.state ? `, ${propiedad.state}` : ""}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleFavorito}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{
                      background: favorito ? "rgba(224,107,107,0.12)" : "rgba(255,255,255,0.9)",
                      border: `1.5px solid ${favorito ? "#E06B6B" : "rgba(27,43,94,0.12)"}`,
                    }}
                  >
                    <Heart size={18} fill={favorito ? "#E06B6B" : "none"} stroke={favorito ? "#E06B6B" : "#8A92B2"} />
                  </button>
                  <button
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: "rgba(255,255,255,0.9)", border: "1.5px solid rgba(27,43,94,0.12)" }}
                  >
                    <Share2 size={18} style={{ color: "#8A92B2" }} />
                  </button>
                </div>
              </div>

              <div className="text-3xl font-bold mt-3" style={{ color: "#1B2B5E" }}>
                {formatPrice(propiedad.price, propiedad.listing_type)}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Eye, label: "Vistas", value: propiedad.views_count },
                { icon: Calendar, label: "Publicado", value: propiedad.created_at ? new Date(propiedad.created_at).toLocaleDateString("es-MX", { month: "short", year: "numeric" }) : "—" },
                propiedad.bedrooms != null && { icon: Bed, label: "Recámaras", value: propiedad.bedrooms },
                propiedad.bathrooms != null && { icon: Bath, label: "Baños", value: propiedad.bathrooms },
              ].filter(Boolean).map((item: any, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 text-center"
                  style={{ background: "white", border: "1px solid rgba(27,43,94,0.08)", boxShadow: "0 2px 8px rgba(27,43,94,0.04)" }}
                >
                  <item.icon className="mx-auto mb-1" size={20} style={{ color: "#C9A96E" }} />
                  <div className="font-bold" style={{ color: "#1B2B5E" }}>{item.value}</div>
                  <div className="text-xs" style={{ color: "#8A92B2" }}>{item.label}</div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="rounded-2xl p-6" style={{ background: "white", border: "1px solid rgba(27,43,94,0.08)" }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: "#1B2B5E" }}>Características</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  propiedad.area          && { icon: Maximize, label: `${propiedad.area} m²`,     color: "#1B2B5E" },
                  propiedad.has_water     && { icon: Droplets,  label: "Agua",                    color: "#4A5FA8" },
                  propiedad.has_electricity && { icon: Zap,     label: "Electricidad",            color: "#C9A96E" },
                  propiedad.has_garage    && { icon: Car,        label: "Estacionamiento",         color: "#5A6280" },
                  propiedad.has_garden    && { icon: Trees,      label: "Jardín",                  color: "#2A7A4E" },
                  propiedad.has_pool      && { icon: Waves,      label: "Alberca",                 color: "#4A5FA8" },
                  propiedad.has_security  && { icon: Shield,     label: "Seguridad",               color: "#7C5CBF" },
                  propiedad.has_gym       && { icon: Dumbbell,   label: "Gimnasio",                color: "#C9A96E" },
                ].filter(Boolean).map((feat: any, i) => (
                  <div key={i} className="flex items-center gap-2" style={{ color: "#5A6280" }}>
                    <feat.icon size={18} style={{ color: feat.color, flexShrink: 0 }} />
                    <span className="text-sm">{feat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {propiedad.description && (
              <div className="rounded-2xl p-6" style={{ background: "white", border: "1px solid rgba(27,43,94,0.08)" }}>
                <h2 className="text-lg font-bold mb-3" style={{ color: "#1B2B5E" }}>Descripción</h2>
                <p className="leading-relaxed" style={{ color: "#5A6280" }}>{propiedad.description}</p>
              </div>
            )}

            {/* Similar Properties */}
            {similares.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4" style={{ color: "#1B2B5E" }}>Propiedades similares</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {similares.map((sim) => (
                    <Link
                      key={sim.id}
                      to={`/propiedad/${sim.id}`}
                      className="rounded-xl overflow-hidden transition hover:shadow-lg"
                      style={{ background: "white", border: "1px solid rgba(27,43,94,0.08)" }}
                    >
                      <img
                        src={sim.main_image ?? "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400"}
                        alt={sim.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <div className="font-semibold text-sm truncate" style={{ color: "#1B2B5E" }}>{sim.title}</div>
                        <div className="font-bold text-sm mt-1" style={{ color: "#C9A96E" }}>
                          {formatPrice(sim.price, sim.listing_type)}
                        </div>
                        <div className="text-xs mt-1" style={{ color: "#8A92B2" }}>{sim.city}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Contact Panel */}
          <div className="space-y-4">
            {/* Owner + Contact Card */}
            {propiedad.owner && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg shrink-0"
                       style={{ background: "linear-gradient(135deg,#1B2B5E,#4A5FA8)" }}>
                    {propiedad.owner?.nombre?.[0] ?? "?"}
                  </div>
                  <div>
                    <div className="font-semibold" style={{ color: "#1B2B5E" }}>{propiedad.owner.full_name}</div>
                    <div className="text-sm" style={{ color: "#8A92B2" }}>Publicante</div>
                  </div>
                </div>

                {usuario && usuario.id === propiedad.owner.id ? (
                  <p className="text-sm text-center" style={{ color: "#8A92B2" }}>Esta es tu propiedad.</p>
                ) : usuario ? (
                  <form onSubmit={handleEnviarMensaje} className="space-y-3">
                    <textarea
                      value={mensajeInicial}
                      onChange={(e) => setMensajeInicial(e.target.value)}
                      placeholder="Hola, me interesa esta propiedad…"
                      rows={3}
                      className="w-full rounded-xl px-3 py-3 text-sm outline-none resize-none"
                      style={{ background: "#F8F9FF", border: "1.5px solid rgba(27,43,94,0.1)", color: "#1B2B5E" }}
                      required
                    />
                    <button
                      type="submit"
                      disabled={enviandoMensaje}
                      className="w-full py-3 rounded-xl font-semibold text-sm text-white hover:opacity-90 transition disabled:opacity-50"
                      style={{ background: "linear-gradient(135deg,#C9A96E,#B8924A)" }}
                    >
                      {enviandoMensaje ? "Enviando…" : "Contactar al publicante"}
                    </button>
                  </form>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white hover:opacity-90 transition"
                    style={{ background: "linear-gradient(135deg,#C9A96E,#B8924A)" }}
                  >
                    <MessageCircle size={18} />
                    Inicia sesión para contactar
                  </Link>
                )}
              </div>
            )}

            {/* Price Info */}
            <div className="bg-[#1B2B5E] text-white rounded-2xl p-6">
              <div className="text-sm opacity-80 mb-1">
                {propiedad.listing_type === "rent" ? "Renta mensual" : "Precio de venta"}
              </div>
              <div className="text-3xl font-bold">
                {formatPrice(propiedad.price, propiedad.listing_type)}
              </div>
              {propiedad.area && (
                <div className="text-sm opacity-70 mt-2">
                  ${Math.round(propiedad.price / propiedad.area).toLocaleString("es-MX")} por m²
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-2 text-sm">
                {propiedad.year_built && (
                  <>
                    <span className="opacity-70">Año de construcción</span>
                    <span className="text-right font-medium">{propiedad.year_built}</span>
                  </>
                )}
                {propiedad.floor != null && (
                  <>
                    <span className="opacity-70">Piso</span>
                    <span className="text-right font-medium">{propiedad.floor}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <ModalIA
        abierto={mostrarModalIA}
        onCerrar={() => setMostrarModalIA(false)}
        cargando={iaGenerando}
        originalUrl={iaOriginal}
        generatedUrl={iaGenerada}
        error={iaError}
        canRetry={iaCanRetry}
        onReintentar={() => iaOriginal && ejecutarIA(iaOriginal)}
      />

      <Footer />
    </div>
  );
}
