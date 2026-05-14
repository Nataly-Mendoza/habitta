import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Bed, Bath, Maximize2, Heart, MapPin, Car, Leaf } from "lucide-react";
import type { Propiedad } from "../../services/propiedades";
import { ContextoFavoritos } from "../../context/ContextoFavoritos";

interface PropertyCardProps {
  property: Propiedad;
  variant?: "grid" | "list";
}

function formatPrice(price: number) {
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(2)}M`;
  if (price >= 1_000) return `$${(price / 1_000).toFixed(0)}K`;
  return `$${price.toLocaleString("es-MX")}`;
}

const FALLBACK_IMG = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

export function PropertyCard({ property, variant = "grid" }: PropertyCardProps) {
  const { favoritedIds, toggleFavorito } = useContext(ContextoFavoritos);
  const liked = favoritedIds.has(property.id);
  const [hovered, setHovered] = useState(false);

  const imgSrc = property.main_image ?? FALLBACK_IMG;
  const location = [property.city, property.state].filter(Boolean).join(", ");
  const isRent = property.listing_type === "rent";

  if (variant === "list") {
    return (
      <Link to={`/propiedad/${property.id}`} className="block">
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
          }}
          className="flex flex-col sm:flex-row"
        >
          <div className="relative sm:w-64 h-52 sm:h-auto shrink-0 overflow-hidden">
            <img
              src={imgSrc}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-500"
              style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}
            />
            <div style={{ background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent)" }} className="absolute inset-0" />
            <div className="absolute top-3 left-3 flex gap-1.5">
              <span
                style={{
                  background: isRent ? "linear-gradient(135deg, #2A7A4E, #38A36B)" : "linear-gradient(135deg, #1B2B5E, #4A5FA8)",
                  color: "white",
                  fontSize: "11px",
                }}
                className="px-2.5 py-1 rounded-lg font-semibold uppercase tracking-wider"
              >
                {isRent ? "Renta" : "Venta"}
              </span>
            </div>
            <button
              onClick={(e) => { e.preventDefault(); toggleFavorito(property.id); }}
              style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.6)" }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
            >
              <Heart size={14} fill={liked ? "#E06B6B" : "none"} stroke={liked ? "#E06B6B" : "#666"} />
            </button>
          </div>

          <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 style={{ color: "#1B2B5E", fontSize: "16px", fontWeight: "600", lineHeight: "1.3" }} className="flex-1">
                  {property.title}
                </h3>
                <div className="text-right shrink-0">
                  <p style={{ color: "#1B2B5E", fontSize: "20px", fontWeight: "700" }}>
                    {formatPrice(property.price)}
                  </p>
                  {isRent && <p style={{ color: "#8A92B2", fontSize: "12px" }}>/mes</p>}
                </div>
              </div>
              <div className="flex items-center gap-1.5 mb-3">
                <MapPin size={13} style={{ color: "#C9A96E" }} />
                <p style={{ color: "#8A92B2", fontSize: "13px" }}>{location || "Sin ubicación"}</p>
              </div>
              {property.description && (
                <p style={{ color: "#6A7280", fontSize: "13px", lineHeight: "1.5" }} className="line-clamp-2 mb-4">
                  {property.description}
                </p>
              )}
            </div>

            <div style={{ borderTop: "1px solid rgba(27,43,94,0.06)" }} className="pt-3 flex items-center gap-5">
              {[
                ...(property.bedrooms != null ? [{ icon: <Bed size={14} />, value: `${property.bedrooms} Rec.` }] : []),
                ...(property.bathrooms != null ? [{ icon: <Bath size={14} />, value: `${property.bathrooms} Baños` }] : []),
                { icon: <Maximize2 size={14} />, value: `${property.area} m²` },
                ...(property.has_garage ? [{ icon: <Car size={14} />, value: "Garage" }] : []),
                ...(property.has_garden ? [{ icon: <Leaf size={14} />, value: "Jardín" }] : []),
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span style={{ color: "#C9A96E" }}>{feat.icon}</span>
                  <span style={{ color: "#5A6280", fontSize: "13px" }}>{feat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/propiedad/${property.id}`} className="block h-full">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "white",
          borderRadius: "20px",
          border: "1px solid rgba(27,43,94,0.08)",
          boxShadow: hovered ? "0 16px 48px rgba(27,43,94,0.14)" : "0 2px 12px rgba(27,43,94,0.05)",
          transition: "all 0.3s ease",
          transform: hovered ? "translateY(-4px)" : "none",
          overflow: "hidden",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="relative h-52 overflow-hidden">
          <img
            src={imgSrc}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
          />
          <div style={{ background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)" }} className="absolute inset-0" />

          <div className="absolute top-3 left-3 flex gap-1.5">
            <span
              style={{
                background: isRent ? "linear-gradient(135deg, #2A7A4E, #38A36B)" : "linear-gradient(135deg, #1B2B5E, #4A5FA8)",
                color: "white",
                fontSize: "10px",
              }}
              className="px-2.5 py-1 rounded-lg font-semibold uppercase tracking-wider"
            >
              {isRent ? "Renta" : "Venta"}
            </span>
            {property.status === "active" && (
              <span
                style={{ background: "linear-gradient(135deg, #C9A96E, #B8924A)", color: "white", fontSize: "10px" }}
                className="px-2.5 py-1 rounded-lg font-semibold uppercase tracking-wider"
              >
                Disponible
              </span>
            )}
          </div>

          <button
            onClick={(e) => { e.preventDefault(); toggleFavorito(property.id); }}
            style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.6)" }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
          >
            <Heart size={15} fill={liked ? "#E06B6B" : "none"} stroke={liked ? "#E06B6B" : "#666"} />
          </button>

          <div className="absolute bottom-3 left-3">
            <div style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderRadius: "12px", padding: "5px 12px" }}>
              <span style={{ color: "#1B2B5E", fontSize: "15px", fontWeight: "700" }}>
                {formatPrice(property.price)}
              </span>
              {isRent && <span style={{ color: "#8A92B2", fontSize: "11px" }}>/mes</span>}
            </div>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-1.5 mb-2">
            <MapPin size={12} style={{ color: "#C9A96E" }} />
            <p style={{ color: "#8A92B2", fontSize: "12px" }}>{location || "Sin ubicación"}</p>
          </div>
          <h3 style={{ color: "#1B2B5E", fontSize: "15px", fontWeight: "600", lineHeight: "1.35" }} className="mb-4 flex-1">
            {property.title}
          </h3>
          <div style={{ borderTop: "1px solid rgba(27,43,94,0.06)" }} className="pt-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {property.bedrooms != null && (
                <div className="flex items-center gap-1">
                  <Bed size={13} style={{ color: "#C9A96E" }} />
                  <span style={{ color: "#5A6280", fontSize: "12px" }}>{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms != null && (
                <div className="flex items-center gap-1">
                  <Bath size={13} style={{ color: "#C9A96E" }} />
                  <span style={{ color: "#5A6280", fontSize: "12px" }}>{property.bathrooms}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Maximize2 size={13} style={{ color: "#C9A96E" }} />
                <span style={{ color: "#5A6280", fontSize: "12px" }}>{property.area}m²</span>
              </div>
            </div>
            <span
              style={{ background: "rgba(27,43,94,0.06)", color: "#5A6280", fontSize: "11px", borderRadius: "8px" }}
              className="px-2.5 py-1 capitalize"
            >
              {property.type}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
