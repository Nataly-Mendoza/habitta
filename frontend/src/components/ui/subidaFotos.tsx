

import { useState, useCallback, useRef, type DragEvent, type ChangeEvent } from "react";
import { Upload, X, Star } from "lucide-react";


interface FotoPreview {
  uid: string;
  file: File;
  preview: string;
}

interface SubidaFotosProps {
  minFotos?: number;
  maxFotos?: number;
  onChange: (archivos: File[]) => void;
  error?: string | null;
  className?: string;
}

const uid = () => Math.random().toString(36).slice(2);

// ─── Componente ───────────────────────────────────────────────────────────────

export function SubidaFotos({
  minFotos = 6,
  maxFotos = 20,
  onChange,
  error,
  className = "",
}: SubidaFotosProps) {
  const [fotos, setFotos] = useState<FotoPreview[]>([]);
  const [dragZona, setDragZona] = useState(false);
  const [draggingUid, setDraggingUid] = useState<string | null>(null);
  const [dragOverUid, setDragOverUid] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Agregar archivos ──────────────────────────────────────────────────────

  const agregar = useCallback(
    (archivos: FileList | File[]) => {
      const validos = Array.from(archivos).filter(f => f.type.startsWith("image/"));
      const espacio = maxFotos - fotos.length;
      const nuevas: FotoPreview[] = validos.slice(0, espacio).map(file => ({
        uid: uid(),
        file,
        preview: URL.createObjectURL(file),
      }));
      setFotos(prev => {
        const todas = [...prev, ...nuevas];
        onChange(todas.map(f => f.file));
        return todas;
      });
    },
    [fotos.length, maxFotos, onChange]
  );

  // ── Drop en zona ─────────────────────────────────────────────────────────

  const handleDropZona = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragZona(false);
    if (e.dataTransfer.files) agregar(e.dataTransfer.files);
  };

  // ── Eliminar ──────────────────────────────────────────────────────────────

  const eliminar = useCallback(
    (uidElim: string) => {
      setFotos(prev => {
        const siguiente = prev.filter(f => f.uid !== uidElim);
        onChange(siguiente.map(f => f.file));
        return siguiente;
      });
    },
    [onChange]
  );

  // ── Reordenar arrastrando ─────────────────────────────────────────────────

  const handleDropItem = (e: DragEvent, targetUid: string) => {
    e.preventDefault();
    if (!draggingUid || draggingUid === targetUid) {
      setDraggingUid(null);
      setDragOverUid(null);
      return;
    }
    setFotos(prev => {
      const copia = [...prev];
      const fromIdx = copia.findIndex(f => f.uid === draggingUid);
      const toIdx = copia.findIndex(f => f.uid === targetUid);
      const [movido] = copia.splice(fromIdx, 1);
      copia.splice(toIdx, 0, movido);
      onChange(copia.map(f => f.file));
      return copia;
    });
    setDraggingUid(null);
    setDragOverUid(null);
  };

  const faltantes = Math.max(0, minFotos - fotos.length);
  const lleno = fotos.length >= maxFotos;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* ── Zona de drop ── */}
      {!lleno && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragZona(true); }}
          onDragLeave={() => setDragZona(false)}
          onDrop={handleDropZona}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${
              dragZona
                ? "#1B2B5E"
                : error && fotos.length < minFotos
                ? "#E06B6B"
                : "rgba(27,43,94,0.15)"
            }`,
            borderRadius: "20px",
            background: dragZona
              ? "rgba(27,43,94,0.04)"
              : error && fotos.length < minFotos
              ? "rgba(224,107,107,0.03)"
              : "rgba(27,43,94,0.01)",
            transition: "all 0.2s",
            cursor: "pointer",
          }}
          className="p-10 text-center"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files) agregar(e.target.files);
              e.target.value = "";
            }}
          />
          <div
            style={{ background: "rgba(27,43,94,0.06)", width: "64px", height: "64px", borderRadius: "20px" }}
            className="flex items-center justify-center mx-auto mb-4"
          >
            <Upload size={28} style={{ color: dragZona ? "#1B2B5E" : "#8A92B2" }} />
          </div>
          <h3 style={{ color: "#1B2B5E", fontSize: "16px", fontWeight: "600" }} className="mb-2">
            {dragZona ? "Suelta las fotos aquí" : "Arrastra fotos o haz clic para seleccionar"}
          </h3>
          <p style={{ color: "#8A92B2", fontSize: "13px" }}>
            o{" "}
            <span style={{ color: "#4A5FA8", fontWeight: "600" }}>explorar archivos</span>
          </p>
          <p style={{ color: "#B0B8D0", fontSize: "12px", marginTop: "8px" }}>
            Mínimo {minFotos} fotos · Máx {maxFotos} · JPG, PNG, WEBP · Max 5 MB
          </p>
        </div>
      )}

      {/* ── Estado del conteo ── */}
      <div className="flex items-center justify-between">
        <p style={{ color: faltantes > 0 ? "#C9A96E" : "#2A7A4E", fontSize: "13px", fontWeight: "500" }}>
          {fotos.length} foto{fotos.length !== 1 ? "s" : ""} agregada{fotos.length !== 1 ? "s" : ""}
          {faltantes > 0 && (
            <span style={{ color: "#E06B6B" }}> · faltan {faltantes}</span>
          )}
        </p>
        {error && (
          <span style={{ color: "#E06B6B", fontSize: "12px" }}>{error}</span>
        )}
      </div>

      {/* ── Grid de previews ── */}
      {fotos.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p style={{ color: "#3A4570", fontSize: "13px", fontWeight: "500" }}>
              {fotos.length} foto{fotos.length !== 1 ? "s" : ""} seleccionada{fotos.length !== 1 ? "s" : ""}
            </p>
            {faltantes > 0 && (
              <span style={{ color: "#E06B6B", fontSize: "12px" }}>
                Agrega al menos {faltantes} más
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {fotos.map((foto, i) => (
              <div
                key={foto.uid}
                draggable
                onDragStart={() => setDraggingUid(foto.uid)}
                onDragOver={(e) => { e.preventDefault(); setDragOverUid(foto.uid); }}
                onDrop={(e) => handleDropItem(e, foto.uid)}
                onDragEnd={() => { setDraggingUid(null); setDragOverUid(null); }}
                style={{
                  borderRadius: "14px",
                  overflow: "hidden",
                  position: "relative",
                  border: dragOverUid === foto.uid
                    ? "2.5px solid #4A5FA8"
                    : i === 0
                    ? "2.5px solid #C9A96E"
                    : "2.5px solid transparent",
                  opacity: draggingUid === foto.uid ? 0.4 : 1,
                  cursor: "grab",
                  transition: "all 0.15s",
                }}
                className="group"
              >
                <img
                  src={foto.preview}
                  alt={`Foto ${i + 1}`}
                  className="w-full h-28 object-cover"
                />

                {/* Badge portada */}
                {i === 0 && (
                  <div
                    style={{ background: "rgba(27,43,94,0.85)", color: "white", fontSize: "10px", backdropFilter: "blur(8px)" }}
                    className="absolute top-2 left-2 px-2 py-1 rounded-lg font-semibold flex items-center gap-1"
                  >
                    <Star size={9} />
                    Portada
                  </div>
                )}

                {/* Número */}
                <div
                  style={{ background: "rgba(0,0,0,0.5)", color: "rgba(255,255,255,0.9)", fontSize: "11px", fontWeight: "700" }}
                  className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md"
                >
                  {i + 1}
                </div>

                {/* Botón eliminar */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); eliminar(foto.uid); }}
                  style={{ background: "rgba(224,107,107,0.9)", backdropFilter: "blur(4px)" }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  aria-label={`Eliminar foto ${i + 1}`}
                >
                  <X size={12} color="white" />
                </button>
              </div>
            ))}

            {/* Agregar más */}
            {!lleno && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                style={{ border: "2px dashed rgba(27,43,94,0.12)", borderRadius: "14px" }}
                className="h-28 flex flex-col items-center justify-center gap-2 hover:border-[rgba(27,43,94,0.3)] transition-all"
              >
                <Upload size={20} style={{ color: "#B0B8D0" }} />
                <span style={{ color: "#B0B8D0", fontSize: "11px" }}>Agregar más</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tip inicial */}
      {fotos.length === 0 && (
        <div
          style={{ background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.2)", borderRadius: "14px" }}
          className="p-4"
        >
          <p style={{ color: "#8A7A5A", fontSize: "13px" }}>
            💡 <strong>Tip:</strong> Propiedades con {minFotos}+ fotos profesionales reciben 3× más consultas.
            La primera foto será la portada del anuncio. Arrastra las fotos para reordenarlas.
          </p>
        </div>
      )}
    </div>
  );
}