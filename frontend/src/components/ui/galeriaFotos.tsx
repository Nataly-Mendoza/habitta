

import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// ─── Props ────────────────────────────────────────────────────────────────────

interface GaleriaFotosProps {
  /** Array de URLs de imágenes (mismo formato que property.images) */
  images: string[];
  title?: string;

  renderBotonIA?: React.ReactNode;
  className?: string;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function GaleriaFotos({ images, title, renderBotonIA, className = "" }: GaleriaFotosProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const total = images.length;
  const anterior = useCallback(() => setActiveImage(i => Math.max(0, i - 1)), []);
  const siguiente = useCallback(() => setActiveImage(i => Math.min(total - 1, i + 1)), [total]);

  // Navegación con teclado
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  anterior();
      if (e.key === "ArrowRight") siguiente();
      if (e.key === "Escape")     setLightboxOpen(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [anterior, siguiente]);

  if (!total) {
    return (
      <div
        style={{ background: "rgba(27,43,94,0.04)", borderRadius: "24px", border: "1px solid rgba(27,43,94,0.08)" }}
        className={`h-64 flex items-center justify-center ${className}`}
      >
        <p style={{ color: "#B0B8D0", fontSize: "14px" }}>Sin fotos disponibles</p>
      </div>
    );
  }

  return (
    <>
      <div className={`space-y-3 ${className}`} style={{ borderRadius: "24px", overflow: "hidden" }}>
        {/* ── Foto principal ── */}
        <div className="relative">
          <div
            className="relative h-[420px] overflow-hidden cursor-pointer"
            onClick={() => setLightboxOpen(true)}
          >
            <img
              src={images[activeImage]}
              alt={title ? `${title} — foto ${activeImage + 1}` : `Foto ${activeImage + 1}`}
              className="w-full h-full object-cover"
            />
            <div
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent)" }}
              className="absolute inset-0"
            />

            {/* Contador */}
            <div
              style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", borderRadius: "10px" }}
              className="absolute bottom-4 right-4 px-3 py-1.5"
            >
              <span style={{ color: "#1B2B5E", fontSize: "12px", fontWeight: "600" }}>
                {activeImage + 1} / {total}
              </span>
            </div>

            {/* Slot IA — vacío si Emiliano no pasa la prop */}
            {renderBotonIA && (
              <div className="absolute bottom-4 left-4" onClick={e => e.stopPropagation()}>
                {renderBotonIA}
              </div>
            )}

            {/* Flecha prev */}
            {activeImage > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); anterior(); }}
                style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", borderRadius: "12px", width: "40px", height: "40px" }}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center shadow-lg transition-all hover:bg-white"
                aria-label="Foto anterior"
              >
                <ChevronLeft size={20} style={{ color: "#1B2B5E" }} />
              </button>
            )}

            {/* Flecha next */}
            {activeImage < total - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); siguiente(); }}
                style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", borderRadius: "12px", width: "40px", height: "40px" }}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center shadow-lg transition-all hover:bg-white"
                aria-label="Foto siguiente"
              >
                <ChevronRight size={20} style={{ color: "#1B2B5E" }} />
              </button>
            )}
          </div>

          {/* ── Miniaturas ── */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                style={{
                  borderRadius: "14px",
                  overflow: "hidden",
                  border: activeImage === i ? "3px solid #C9A96E" : "3px solid transparent",
                  flexShrink: 0,
                  width: "100px",
                  height: "68px",
                  transition: "all 0.2s",
                  opacity: activeImage === i ? 1 : 0.65,
                }}
                className="hover:opacity-100"
                aria-label={`Ver foto ${i + 1}`}
              >
                <img src={img} alt={`Miniatura ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div
          style={{ background: "rgba(0,0,0,0.95)", backdropFilter: "blur(10px)" }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Cerrar */}
          <button
            onClick={() => setLightboxOpen(false)}
            style={{ background: "rgba(255,255,255,0.15)", position: "absolute", top: "20px", right: "20px", borderRadius: "12px", width: "44px", height: "44px" }}
            className="flex items-center justify-center text-white transition-all hover:bg-[rgba(255,255,255,0.25)]"
          >
            <X size={20} />
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); anterior(); }}
            disabled={activeImage === 0}
            style={{ background: "rgba(255,255,255,0.15)", position: "absolute", left: "20px", borderRadius: "12px", width: "44px", height: "44px" }}
            className="flex items-center justify-center text-white transition-all hover:bg-[rgba(255,255,255,0.25)] disabled:opacity-30"
          >
            <ChevronLeft size={24} />
          </button>

          <img
            src={images[activeImage]}
            alt={title ?? `Foto ${activeImage + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl"
            onClick={e => e.stopPropagation()}
          />

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); siguiente(); }}
            disabled={activeImage === total - 1}
            style={{ background: "rgba(255,255,255,0.15)", position: "absolute", right: "20px", borderRadius: "12px", width: "44px", height: "44px" }}
            className="flex items-center justify-center text-white transition-all hover:bg-[rgba(255,255,255,0.25)] disabled:opacity-30"
          >
            <ChevronRight size={24} />
          </button>

          <div style={{ position: "absolute", bottom: "20px", color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
            {activeImage + 1} / {total}
          </div>
        </div>
      )}
    </>
  );
}