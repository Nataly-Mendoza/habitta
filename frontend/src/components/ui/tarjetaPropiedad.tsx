
import { useState } from "react";
import { Link } from "react-router";
import { Bed, Bath, Maximize2, Heart, MapPin, Car, Leaf, Pencil, XCircle } from "lucide-react";
import type { Property } from "../../data/mockData";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price: number, priceUnit = "$"): string {
  if (price >= 1_000_000) return `${priceUnit}${(price / 1_000_000).toFixed(2)}M`;
  if (price >= 1_000)     return `${priceUnit}${(price / 1_000).toFixed(0)}K`;
  return `${priceUnit}${price.toLocaleString("es-MX")}`;
}

const LABEL_TIPO: Record<Property["type"], string> = {
  apartment: "Departamento",
  house:     "Casa",
  villa:     "Villa",
  studio:    "Studio",
  penthouse: "Penthouse",
};

const BADGE_TIPO_COLOR: Record<Property["type"], string> = {
  apartment: "rgba(74,95,168,0.9)",
  house:     "rgba(42,122,78,0.9)",
  villa:     "rgba(201,169,110,0.9)",
  studio:    "rgba(90,98,128,0.9)",
  penthouse: "rgba(27,43,94,0.9)",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface TarjetaPropiedadProps {
  property: Property;
  variant?: "grid" | "list";
  modoGestion?: boolean;
  onEditar?: (id: number) => void;
  onCerrar?: (id: number
  ) => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function TarjetaPropiedad({
  property,
  variant = "grid",
  modoGestion = false,
  onEditar,
  onCerrar,
}: TarjetaPropiedadProps) {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const estaCerrada = property.status === "closed";

  // ── Vista lista ──────────────────────────────────────────────────────────

  if (variant === "list") {
    return (
      <Link to={`/property/${property.id}`} className="block">
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            background: "white",
            borderRadius: "20px",
            border: "1px solid rgba(27,43,94,0.08)",
            boxShadow: hovered ? "0 12px 40px rgba(27,43,94,0.12)" : "0 2px 12px rgba(27,43,94,0.05)",
            transition: "all 0.3s ease",
            transform: hovered ? "translateY(-2px)" : "none",
            overflow: "hidden",
            opacity: estaCerrada ? 0.8 : 1,
          }}
          className="flex flex-col sm:flex-row"
        >
          <div className="relative sm:w-64 h-52 sm:h-auto shrink-0 overflow-hidden">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-500"
              style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}
            />
            <div style={{ background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent)" }} className="absolute inset-0" />
            <div className="absolute top-3 left-3 flex gap-2">
              <span style={{ background: property.listingType === "sale" ? "linear-gradient(135deg, #1B2B5E, #4A5FA8)" : "linear-gradient(135deg, #2A7A4E, #38A36B)", color: "white", fontSize: "11px" }} className="px-2.5 py-1 rounded-lg font-semibold">
                {property.listingType === "sale" ? "En Venta" : "En Renta"}
              </span>
              <span style={{ background: BADGE_TIPO_COLOR[property.type], color: "white", fontSize: "11px" }} className="px-2.5 py-1 rounded-lg font-semibold">
                {LABEL_TIPO[property.type]}
              </span>
            </div>
            <button onClick={(e) => { e.preventDefault(); setLiked(!liked); }} style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)" }} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110">
              <Heart size={14} fill={liked ? "#E06B6B" : "none"} stroke={liked ? "#E06B6B" : "#666"} />
            </button>
          </div>
          <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 style={{ color: "#1B2B5E", fontSize: "16px", fontWeight: "600", lineHeight: "1.3" }} className="flex-1">{property.title}</h3>
                <div className="text-right shrink-0">
                  <p style={{ color: "#1B2B5E", fontSize: "20px", fontWeight: "700" }}>{formatPrice(property.price, property.priceUnit)}</p>
                  {property.listingType === "rent" && <p style={{ color: "#8A92B2", fontSize: "12px" }}>/mes</p>}
                </div>
              </div>
              <div className="flex items-center gap-1.5 mb-3">
                <MapPin size={13} style={{ color: "#C9A96E" }} />
                <p style={{ color: "#8A92B2", fontSize: "13px" }}>{property.city}</p>
              </div>
              <p style={{ color: "#6A7280", fontSize: "13px", lineHeight: "1.5" }} className="line-clamp-2 mb-4">{property.description}</p>
            </div>
            <div style={{ borderTop: "1px solid rgba(27,43,94,0.06)" }} className="pt-3 flex items-center gap-5">
              {property.bedrooms > 0 && <div className="flex items-center gap-1.5"><Bed size={13} style={{ color: "#C9A96E" }} /><span style={{ color: "#5A6280", fontSize: "13px" }}>{property.bedrooms} Recám.</span></div>}
              <div className="flex items-center gap-1.5"><Bath size={13} style={{ color: "#C9A96E" }} /><span style={{ color: "#5A6280", fontSize: "13px" }}>{property.bathrooms} Baños</span></div>
              <div className="flex items-center gap-1.5"><Maximize2 size={13} style={{ color: "#C9A96E" }} /><span style={{ color: "#5A6280", fontSize: "13px" }}>{property.area} m²</span></div>
              {property.hasGarage && <div className="flex items-center gap-1.5"><Car size={13} style={{ color: "#C9A96E" }} /><span style={{ color: "#5A6280", fontSize: "13px" }}>Cochera</span></div>}
              {property.hasGarden && <div className="flex items-center gap-1.5"><Leaf size={13} style={{ color: "#C9A96E" }} /><span style={{ color: "#5A6280", fontSize: "13px" }}>Jardín</span></div>}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // ── Vista grid (default) ─────────────────────────────────────────────────

  const CardWrapper = modoGestion
    ? ({ children }: { children: React.ReactNode }) => (
        <div style={{ cursor: "default" }}>{children}</div>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <Link to={`/property/${property.id}`} className="block h-full">{children}</Link>
      );

  return (
    <CardWrapper>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "white",
          borderRadius: "20px",
          border: "1px solid rgba(27,43,94,0.08)",
          boxShadow: hovered ? "0 16px 48px rgba(27,43,94,0.14)" : "0 2px 12px rgba(27,43,94,0.05)",
          transition: "all 0.3s ease",
          transform: hovered && !modoGestion ? "translateY(-4px)" : "none",
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          opacity: estaCerrada ? 0.8 : 1,
        }}
      >
        {/* ── Foto ── */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: hovered && !modoGestion ? "scale(1.06)" : "scale(1)" }}
          />
          <div style={{ background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)" }} className="absolute inset-0" />

          {/* Overlay si está cerrada */}
          {estaCerrada && (
            <div style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }} className="absolute inset-0 flex items-center justify-center">
              <div style={{ background: "rgba(224,107,107,0.9)", color: "white", borderRadius: "12px" }} className="px-4 py-2 flex items-center gap-2">
                <XCircle size={15} />
                <span style={{ fontSize: "13px", fontWeight: "600" }}>
                  Anuncio cerrado{property.closedReason ? ` · ${property.closedReason === "sold" ? "Vendida" : property.closedReason === "rented" ? "Rentada" : "Otro"}` : ""}
                </span>
              </div>
            </div>
          )}

          {/* Badges top-left */}
          <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
            <span style={{ background: property.listingType === "sale" ? "linear-gradient(135deg, #1B2B5E, #4A5FA8)" : "linear-gradient(135deg, #2A7A4E, #38A36B)", color: "white", fontSize: "10px" }} className="px-2.5 py-1 rounded-lg font-semibold uppercase">
              {property.listingType === "sale" ? "En Venta" : "En Renta"}
            </span>
            <span style={{ background: BADGE_TIPO_COLOR[property.type], color: "white", fontSize: "10px" }} className="px-2.5 py-1 rounded-lg font-semibold">
              {LABEL_TIPO[property.type]}
            </span>
            {property.featured && (
              <span style={{ background: "linear-gradient(135deg, #C9A96E, #B8924A)", color: "white", fontSize: "10px" }} className="px-2.5 py-1 rounded-lg font-semibold uppercase">
                Destacada
              </span>
            )}
          </div>

          {/* Like / precio */}
          {!modoGestion && (
            <button onClick={(e) => { e.preventDefault(); setLiked(!liked); }} style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)" }} className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110">
              <Heart size={15} fill={liked ? "#E06B6B" : "none"} stroke={liked ? "#E06B6B" : "#666"} />
            </button>
          )}

          <div className="absolute bottom-3 left-3">
            <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderRadius: "12px", padding: "5px 12px" }}>
              <span style={{ color: "#1B2B5E", fontSize: "15px", fontWeight: "700" }}>
                {formatPrice(property.price, property.priceUnit)}
              </span>
              {property.listingType === "rent" && <span style={{ color: "#8A92B2", fontSize: "11px" }}>/mes</span>}
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-1.5 mb-2">
            <MapPin size={12} style={{ color: "#C9A96E" }} />
            <p style={{ color: "#8A92B2", fontSize: "12px" }}>{property.city}</p>
          </div>
          <h3 style={{ color: "#1B2B5E", fontSize: "15px", fontWeight: "600", lineHeight: "1.35" }} className="mb-4 flex-1">
            {property.title}
          </h3>

          {/* Stats */}
          <div style={{ borderTop: "1px solid rgba(27,43,94,0.06)" }} className="pt-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-1">
                  <Bed size={13} style={{ color: "#C9A96E" }} />
                  <span style={{ color: "#5A6280", fontSize: "12px" }}>{property.bedrooms}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Bath size={13} style={{ color: "#C9A96E" }} />
                <span style={{ color: "#5A6280", fontSize: "12px" }}>{property.bathrooms}</span>
              </div>
              <div className="flex items-center gap-1">
                <Maximize2 size={13} style={{ color: "#C9A96E" }} />
                <span style={{ color: "#5A6280", fontSize: "12px" }}>{property.area}m²</span>
              </div>
            </div>
          </div>

          {/* Botones modo gestión */}
          {modoGestion && !estaCerrada && (
            <div style={{ borderTop: "1px solid rgba(27,43,94,0.06)" }} className="mt-3 pt-3 flex items-center gap-2">
              <button
                onClick={() => onEditar?.(property.id)}
                style={{ background: "rgba(74,95,168,0.08)", color: "#4A5FA8", borderRadius: "10px", fontSize: "12px" }}
                className="flex items-center gap-1.5 px-3 py-1.5 font-semibold transition-all hover:bg-[rgba(74,95,168,0.15)]"
              >
                <Pencil size={12} /> Editar
              </button>
              <button
                onClick={() => onCerrar?.(property.id)}
                style={{ background: "rgba(224,107,107,0.08)", color: "#E06B6B", borderRadius: "10px", fontSize: "12px" }}
                className="flex items-center gap-1.5 px-3 py-1.5 font-semibold transition-all hover:bg-[rgba(224,107,107,0.15)]"
              >
                <XCircle size={12} /> Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </CardWrapper>
  );
}