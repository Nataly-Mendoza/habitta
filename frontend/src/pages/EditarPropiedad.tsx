import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  obtenerPropiedad,
  actualizarPropiedad,
  subirImagenesPropiedad,
  eliminarImagenPropiedad,
  setMainImage,
  type DatosPropiedad,
  type Propiedad,
  type PropiedadImagen,
} from "../services/propiedades";
import { DashboardLayout } from "../components/layout/DashboardLayout";

const esquema = z.object({
  title: z.string().min(10, "Mínimo 10 caracteres"),
  description: z.string().optional(),
  type: z.enum(["house", "apartment", "land", "studio", "commercial", "office"]),
  listing_type: z.enum(["sale", "rent"]),
  price: z.coerce.number().min(1, "Precio requerido"),
  location: z.string().min(5, "Dirección requerida"),
  city: z.string().min(2, "Ciudad requerida"),
  state: z.string().optional(),
  area: z.coerce.number().min(1, "Área requerida"),
  bedrooms: z.coerce.number().min(0).optional(),
  bathrooms: z.coerce.number().min(0).optional(),
  floor: z.coerce.number().min(0).optional(),
  year_built: z.coerce.number().min(1900).max(2026).optional(),
  has_water: z.boolean().default(false),
  has_electricity: z.boolean().default(false),
  has_drainage: z.boolean().default(false),
  has_garage: z.boolean().default(false),
  has_garden: z.boolean().default(false),
  has_pool: z.boolean().default(false),
  has_security: z.boolean().default(false),
  has_gym: z.boolean().default(false),
  has_elevator: z.boolean().default(false),
});

type FormData = z.infer<typeof esquema>;

const AMENIDADES = [
  { key: "has_water", icon: "💧", label: "Agua potable" },
  { key: "has_electricity", icon: "⚡", label: "Electricidad" },
  { key: "has_drainage", icon: "🚿", label: "Drenaje" },
  { key: "has_garage", icon: "🚗", label: "Estacionamiento" },
  { key: "has_garden", icon: "🌿", label: "Jardín" },
  { key: "has_pool", icon: "🏊", label: "Alberca" },
  { key: "has_security", icon: "🔒", label: "Seguridad" },
  { key: "has_gym", icon: "💪", label: "Gimnasio" },
  { key: "has_elevator", icon: "🛗", label: "Elevador" },
] as const;

function buildDefaults(p: Propiedad): FormData {
  return {
    title: p.title,
    description: p.description ?? undefined,
    type: p.type,
    listing_type: p.listing_type,
    price: p.price,
    location: p.location,
    city: p.city,
    state: p.state ?? undefined,
    area: p.area,
    bedrooms: p.bedrooms ?? undefined,
    bathrooms: p.bathrooms ?? undefined,
    floor: p.floor ?? undefined,
    year_built: p.year_built ?? undefined,
    has_water: p.has_water,
    has_electricity: p.has_electricity,
    has_drainage: p.has_drainage,
    has_garage: p.has_garage,
    has_garden: p.has_garden,
    has_pool: p.has_pool,
    has_security: p.has_security,
    has_gym: p.has_gym,
    has_elevator: p.has_elevator,
  };
}

interface NuevaImagen {
  file: File;
  preview: string;
}

export function EditarPropiedad() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagenes, setImagenes] = useState<PropiedadImagen[]>([]);
  const [nuevasImagenes, setNuevasImagenes] = useState<NuevaImagen[]>([]);
  const [eliminando, setEliminando] = useState<number | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(esquema) as any,
  });

  useEffect(() => {
    if (!id) return;
    obtenerPropiedad(Number(id))
      .then((p) => {
        reset(buildDefaults(p));
        const sorted = [...(p.images ?? [])].sort((a, b) =>
          b.is_main === a.is_main ? 0 : b.is_main ? 1 : -1
        );
        setImagenes(sorted);
      })
      .catch(() => navigate("/panel/propiedades"))
      .finally(() => setCargando(false));
  }, [id]);

  const handleArchivos = (files: FileList | null) => {
    if (!files) return;
    const nuevas: NuevaImagen[] = Array.from(files).slice(0, 20 - imagenes.length - nuevasImagenes.length).map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
    }));
    setNuevasImagenes((prev) => [...prev, ...nuevas]);
  };

  const eliminarExistente = async (imgId: number) => {
    if (!id) return;
    setEliminando(imgId);
    try {
      await eliminarImagenPropiedad(Number(id), imgId);
      setImagenes((prev) => {
        const next = prev.filter((i) => i.id !== imgId);
        if (next.length > 0 && !next.some((i) => i.is_main)) {
          next[0] = { ...next[0], is_main: true };
        }
        return next;
      });
    } catch {
      setError("No se pudo eliminar la imagen.");
    } finally {
      setEliminando(null);
    }
  };

  const marcarMainExistente = async (imgId: number) => {
    if (!id) return;
    try {
      await setMainImage(Number(id), imgId);
      setImagenes((prev) => prev.map((i) => ({ ...i, is_main: i.id === imgId })));
    } catch {
      setError("No se pudo cambiar la imagen principal.");
    }
  };

  const quitarNueva = (i: number) => {
    setNuevasImagenes((prev) => prev.filter((_, idx) => idx !== i));
  };

  const onSubmit = async (datos: FormData) => {
    setGuardando(true);
    setError(null);
    try {
      await actualizarPropiedad(Number(id), datos as Partial<DatosPropiedad>);

      if (nuevasImagenes.length > 0) {
        await subirImagenesPropiedad(Number(id), nuevasImagenes.map((n) => n.file));
        setNuevasImagenes([]);
      }

      navigate("/panel/propiedades");
    } catch (e: any) {
      setError(e.response?.data?.message ?? "Error al actualizar la propiedad.");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: "#1B2B5E" }} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: "#1B2B5E" }}>Editar propiedad</h1>
          <p className="text-sm mt-1" style={{ color: "#8A92B2" }}>Actualiza los datos de tu publicación</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

          {/* Información básica */}
          <div className="rounded-2xl border p-6 space-y-4" style={{ background: "white", borderColor: "rgba(27,43,94,0.08)" }}>
            <h2 className="font-semibold" style={{ color: "#1B2B5E" }}>Información básica</h2>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>Título *</label>
              <input {...register("title")} className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={{ background: "#F8F9FF", border: "1.5px solid rgba(27,43,94,0.12)", color: "#1B2B5E" }} />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>Tipo *</label>
                <select {...register("type")} className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={{ background: "#F8F9FF", border: "1.5px solid rgba(27,43,94,0.12)", color: "#1B2B5E" }}>
                  <option value="house">Casa</option>
                  <option value="apartment">Departamento</option>
                  <option value="land">Terreno</option>
                  <option value="studio">Estudio</option>
                  <option value="commercial">Local Comercial</option>
                  <option value="office">Oficina</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>Operación *</label>
                <select {...register("listing_type")} className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={{ background: "#F8F9FF", border: "1.5px solid rgba(27,43,94,0.12)", color: "#1B2B5E" }}>
                  <option value="sale">Venta</option>
                  <option value="rent">Renta</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>Precio (MXN) *</label>
              <input {...register("price")} type="number" min="0" className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={{ background: "#F8F9FF", border: "1.5px solid rgba(27,43,94,0.12)", color: "#1B2B5E" }} />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>Dirección *</label>
              <input {...register("location")} className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={{ background: "#F8F9FF", border: "1.5px solid rgba(27,43,94,0.12)", color: "#1B2B5E" }} />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>Ciudad *</label>
                <input {...register("city")} className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={{ background: "#F8F9FF", border: "1.5px solid rgba(27,43,94,0.12)", color: "#1B2B5E" }} />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>Estado</label>
                <input {...register("state")} className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={{ background: "#F8F9FF", border: "1.5px solid rgba(27,43,94,0.12)", color: "#1B2B5E" }} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>Descripción</label>
              <textarea {...register("description")} rows={4} className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none" style={{ background: "#F8F9FF", border: "1.5px solid rgba(27,43,94,0.12)", color: "#1B2B5E" }} />
            </div>
          </div>

          {/* Detalles */}
          <div className="rounded-2xl border p-6 space-y-4" style={{ background: "white", borderColor: "rgba(27,43,94,0.08)" }}>
            <h2 className="font-semibold" style={{ color: "#1B2B5E" }}>Detalles</h2>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>Área (m²) *</label>
              <input {...register("area")} type="number" min="1" className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={{ background: "#F8F9FF", border: "1.5px solid rgba(27,43,94,0.12)", color: "#1B2B5E" }} />
              {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>Recámaras</label>
                <input {...register("bedrooms")} type="number" min="0" className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={{ background: "#F8F9FF", border: "1.5px solid rgba(27,43,94,0.12)", color: "#1B2B5E" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>Baños</label>
                <input {...register("bathrooms")} type="number" min="0" className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={{ background: "#F8F9FF", border: "1.5px solid rgba(27,43,94,0.12)", color: "#1B2B5E" }} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>Piso</label>
                <input {...register("floor")} type="number" min="0" className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={{ background: "#F8F9FF", border: "1.5px solid rgba(27,43,94,0.12)", color: "#1B2B5E" }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>Año construcción</label>
                <input {...register("year_built")} type="number" min="1900" max="2026" className="w-full rounded-xl px-4 py-3 text-sm outline-none" style={{ background: "#F8F9FF", border: "1.5px solid rgba(27,43,94,0.12)", color: "#1B2B5E" }} />
              </div>
            </div>
          </div>

          {/* Amenidades */}
          <div className="rounded-2xl border p-6" style={{ background: "white", borderColor: "rgba(27,43,94,0.08)" }}>
            <h2 className="font-semibold mb-4" style={{ color: "#1B2B5E" }}>Servicios y amenidades</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AMENIDADES.map(({ key, icon, label }) => (
                <label key={key} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition hover:bg-[rgba(27,43,94,0.03)]"
                  style={{ border: "1.5px solid rgba(27,43,94,0.1)" }}>
                  <input type="checkbox" {...register(key as keyof FormData)}
                    style={{ accentColor: "#1B2B5E", width: 16, height: 16 }} />
                  <span>{icon}</span>
                  <span className="text-sm font-medium" style={{ color: "#3A4570" }}>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Imágenes actuales */}
          {imagenes.length > 0 && (
            <div className="rounded-2xl border p-6" style={{ background: "white", borderColor: "rgba(27,43,94,0.08)" }}>
              <h2 className="font-semibold mb-1" style={{ color: "#1B2B5E" }}>Imágenes actuales</h2>
              <p className="text-xs mb-4" style={{ color: "#8A92B2" }}>Haz clic en una imagen para marcarla como principal.</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {imagenes.map((img) => (
                  <div
                    key={img.id}
                    className="relative rounded-xl overflow-hidden cursor-pointer group"
                    style={{
                      aspectRatio: "1",
                      border: img.is_main
                        ? "2.5px solid #C9A96E"
                        : "2px solid rgba(27,43,94,0.1)",
                    }}
                    onClick={() => !eliminando && marcarMainExistente(img.id)}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    {img.is_main && (
                      <div className="absolute bottom-0 left-0 right-0 text-center text-white text-[10px] font-bold py-0.5"
                        style={{ background: "rgba(201,169,110,0.9)" }}>
                        PRINCIPAL
                      </div>
                    )}
                    <button
                      type="button"
                      disabled={eliminando === img.id}
                      onClick={(e) => { e.stopPropagation(); eliminarExistente(img.id); }}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition"
                      style={{ background: "rgba(224,107,107,0.9)" }}
                    >
                      {eliminando === img.id ? "…" : "✕"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agregar nuevas imágenes */}
          <div className="rounded-2xl border p-6" style={{ background: "white", borderColor: "rgba(27,43,94,0.08)" }}>
            <h2 className="font-semibold mb-1" style={{ color: "#1B2B5E" }}>Agregar imágenes</h2>
            <p className="text-sm mb-4" style={{ color: "#8A92B2" }}>Sube nuevas fotos para esta propiedad. JPG, PNG, WEBP · máx. 5 MB c/u.</p>

            <label
              className="flex flex-col items-center justify-center w-full rounded-xl cursor-pointer transition hover:opacity-90 mb-4"
              style={{ border: "2px dashed rgba(27,43,94,0.2)", background: "#F8F9FF", padding: "24px 16px" }}
              onClick={() => fileInputRef.current?.click()}
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" style={{ color: "#B0B8D0", marginBottom: 8 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-sm font-semibold" style={{ color: "#1B2B5E" }}>Seleccionar fotos</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => handleArchivos(e.target.files)}
              />
            </label>

            {nuevasImagenes.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {nuevasImagenes.map((img, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden group" style={{ aspectRatio: "1", border: "2px solid rgba(27,43,94,0.1)" }}>
                    <img src={img.preview} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => quitarNueva(i)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition"
                      style={{ background: "rgba(224,107,107,0.9)" }}
                    >
                      ✕
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 text-center text-white text-[10px] font-bold py-0.5" style={{ background: "rgba(27,43,94,0.7)" }}>
                      NUEVA
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pb-8">
            <button type="submit" disabled={guardando}
              className="px-8 py-3 rounded-xl font-semibold text-sm text-white hover:opacity-90 disabled:opacity-50 transition"
              style={{ background: "linear-gradient(135deg,#1B2B5E,#4A5FA8)" }}>
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>
            <button type="button" onClick={() => navigate("/panel/propiedades")}
              className="px-6 py-3 rounded-xl text-sm font-semibold transition hover:bg-[rgba(27,43,94,0.06)]"
              style={{ color: "#6B7280", border: "1.5px solid rgba(27,43,94,0.12)" }}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
