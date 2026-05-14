
import { useState, useEffect, useRef } from "react";
import { X, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { DatosCierrePropiedad } from "../../services/propiedades";

interface ModalCierreProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
  propertyId?: string;
  /** Recibe datos tipados listos para cerrarPropiedad() */
  onConfirm: (datos: DatosCierrePropiedad) => void | Promise<void>;
  isLoading?: boolean;
}


export function ModalCierre({
  isOpen,
  onClose,
  propertyTitle,
  onConfirm,
  isLoading = false,
}: ModalCierreProps) {
  const [motivo, setMotivo] = useState<"adquirida" | "otro">("adquirida");
  const [descripcion, setDescripcion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

  // Resetear al abrir
  useEffect(() => {
    if (isOpen) {
      setMotivo("adquirida");
      setDescripcion("");
      setError(null);
      setConfirmed(false);
      setTimeout(() => selectRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Cerrar con Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (motivo === "otro" && !descripcion.trim()) {
      setError("Debes describir el motivo cuando seleccionas 'Otro'.");
      return;
    }
    setError(null);

    await onConfirm({
      reason: motivo === "adquirida" ? "sold" : "other",
      note: motivo === "otro" ? descripcion.trim() : undefined,
    });

    setConfirmed(true);
    setTimeout(() => {
      onClose();
      setConfirmed(false);
    }, 1500);
  };

  // ── Estado de éxito ──────────────────────────────────────────────────────

  if (confirmed) {
    return (
      <div
        style={{ background: "rgba(15,20,40,0.75)", backdropFilter: "blur(12px)" }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <div
          style={{ background: "white", borderRadius: "28px", boxShadow: "0 40px 100px rgba(0,0,0,0.2)" }}
          className="w-full max-w-sm p-10 text-center"
        >
          <div
            style={{ background: "#2A7A4E15", border: "2px solid #2A7A4E30" }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
          >
            <CheckCircle2 size={36} style={{ color: "#2A7A4E" }} />
          </div>
          <h3 style={{ color: "#1B2B5E", fontSize: "20px", fontWeight: "600" }} className="mb-2">
            Anuncio cerrado
          </h3>
          <p style={{ color: "#8A92B2", fontSize: "14px" }}>
            La propiedad fue marcada como {motivo === "adquirida" ? "adquirida" : "cerrada"}.
          </p>
        </div>
      </div>
    );
  }

  // ── Modal principal ──────────────────────────────────────────────────────

  return (
    <div
      style={{ background: "rgba(15,20,40,0.75)", backdropFilter: "blur(12px)" }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget && !isLoading) onClose(); }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "28px",
          width: "100%",
          maxWidth: "460px",
          boxShadow: "0 40px 100px rgba(0,0,0,0.25)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{ borderBottom: "1px solid rgba(27,43,94,0.08)" }}
          className="px-7 py-5 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div
              style={{ background: "#E06B6B15", border: "1px solid #E06B6B25" }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
            >
              <AlertTriangle size={18} style={{ color: "#E06B6B" }} />
            </div>
            <div>
              <h2 style={{ color: "#1B2B5E", fontSize: "17px", fontWeight: "600" }}>Cerrar anuncio</h2>
              <p style={{ color: "#8A92B2", fontSize: "12px" }}>Esta acción desactivará tu anuncio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            style={{ background: "rgba(27,43,94,0.06)", border: "1px solid rgba(27,43,94,0.08)" }}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:bg-[rgba(27,43,94,0.1)] disabled:opacity-50"
          >
            <X size={16} style={{ color: "#5A6280" }} />
          </button>
        </div>

        {/* Body */}
        <div className="p-7">
          {/* Propiedad afectada */}
          <div
            style={{ background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.25)", borderRadius: "14px" }}
            className="p-4 mb-6"
          >
            <p style={{ color: "#8A7A5A", fontSize: "13px" }}>
              Cerrando:{" "}
              <strong style={{ color: "#1B2B5E" }}>"{propertyTitle}"</strong>
            </p>
          </div>

          {/* Select de motivo */}
          <div className="mb-5">
            <label
              style={{ color: "#3A4570", fontSize: "13px", fontWeight: "500" }}
              className="block mb-2"
              htmlFor="modal-cierre-motivo"
            >
              Motivo de cierre <span style={{ color: "#E06B6B" }}>*</span>
            </label>
            <select
              id="modal-cierre-motivo"
              ref={selectRef}
              value={motivo}
              onChange={(e) => {
                setMotivo(e.target.value as "adquirida" | "otro");
                setError(null);
              }}
              disabled={isLoading}
              style={{
                width: "100%",
                border: "1.5px solid rgba(27,43,94,0.12)",
                borderRadius: "12px",
                padding: "10px 14px",
                fontSize: "14px",
                color: "#1B2B5E",
                background: "rgba(27,43,94,0.02)",
                outline: "none",
                cursor: "pointer",
              }}
              className="focus:border-[rgba(27,43,94,0.3)] disabled:opacity-50"
            >
              <option value="adquirida">Adquirida (vendida / rentada)</option>
              <option value="otro">Otro motivo</option>
            </select>
          </div>

          {/* Textarea — solo si motivo = "otro" */}
          {motivo === "otro" && (
            <div className="mb-5">
              <label
                style={{ color: "#3A4570", fontSize: "13px", fontWeight: "500" }}
                className="block mb-2"
                htmlFor="modal-cierre-desc"
              >
                Describe el motivo <span style={{ color: "#E06B6B" }}>*</span>
              </label>
              <textarea
                id="modal-cierre-desc"
                value={descripcion}
                onChange={(e) => {
                  setDescripcion(e.target.value);
                  if (error) setError(null);
                }}
                maxLength={500}
                disabled={isLoading}
                placeholder="Ej: retiré el anuncio temporalmente para remodelación..."
                autoFocus
                style={{
                  width: "100%",
                  border: `1.5px solid ${error ? "#E06B6B" : "rgba(27,43,94,0.12)"}`,
                  borderRadius: "14px",
                  padding: "12px 14px",
                  fontSize: "13px",
                  color: "#1B2B5E",
                  background: "rgba(27,43,94,0.02)",
                  outline: "none",
                  resize: "none",
                  lineHeight: "1.6",
                }}
                className="h-28 placeholder:text-[#B0B8D0] focus:border-[rgba(27,43,94,0.3)] disabled:opacity-50"
              />
              <div className="flex items-center justify-between mt-1">
                {error && (
                  <p style={{ color: "#E06B6B", fontSize: "12px", fontWeight: "500" }}>{error}</p>
                )}
                <p style={{ color: "#B0B8D0", fontSize: "11px", marginLeft: "auto" }}>
                  {descripcion.length}/500
                </p>
              </div>
            </div>
          )}

          {/* Acciones */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              style={{ border: "1.5px solid rgba(27,43,94,0.12)", color: "#5A6280", flex: 1 }}
              className="py-3 rounded-2xl text-sm font-medium transition-all hover:bg-[rgba(27,43,94,0.04)] disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              style={{
                background: "linear-gradient(135deg, #E06B6B, #C94040)",
                color: "white",
                flex: 1,
              }}
              className="py-3 rounded-2xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isLoading && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {isLoading ? "Cerrando..." : "Confirmar cierre"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}