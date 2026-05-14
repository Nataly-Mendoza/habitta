import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { crearPropiedad, subirImagenesPropiedad, setMainImage, type DatosPropiedad } from "../services/propiedades";
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

const PASOS = ["Información básica", "Detalles", "Servicios", "Imágenes"];

interface ImagenPreview {
  file: File;
  preview: string;
  esMain: boolean;
}

export function CrearPropiedad() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [paso, setPaso] = useState(0);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagenes, setImagenes] = useState<ImagenPreview[]>([]);

  const { register, handleSubmit, formState: { errors }, trigger } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(esquema) as any,
    defaultValues: {
      listing_type: "sale",
      type: "house",
      has_water: true,
      has_electricity: true,
      has_drainage: true,
    },
  });

  const irSiguiente = async () => {
    const campos: (keyof FormData)[][] = [
      ["title", "type", "listing_type", "price", "location", "city"],
      ["area", "bedrooms", "bathrooms"],
      [],
      [],
    ];
    const valido = await trigger(campos[paso]);
    if (valido) setPaso((p) => p + 1);
  };

  const handleArchivos = (files: FileList | null) => {
    if (!files) return;
    const nuevas: ImagenPreview[] = [];
    Array.from(files).slice(0, 20 - imagenes.length).forEach((file) => {
      nuevas.push({
        file,
        preview: URL.createObjectURL(file),
        esMain: false,
      });
    });
    setImagenes((prev) => {
      const combined = [...prev, ...nuevas];
      if (!combined.some((i) => i.esMain) && combined.length > 0) {
        combined[0].esMain = true;
      }
      return combined;
    });
  };

  const marcarMain = (index: number) => {
    setImagenes((prev) => prev.map((img, i) => ({ ...img, esMain: i === index })));
  };

  const eliminarImagen = (index: number) => {
    setImagenes((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length > 0 && !next.some((i) => i.esMain)) next[0].esMain = true;
      return next;
    });
  };

  const onSubmit = async (datos: FormData) => {
    if (imagenes.length === 0) {
      setError("Debes subir al menos 1 imagen.");
      return;
    }
    setGuardando(true);
    setError(null);
    try {
      const propiedad = await crearPropiedad(datos as DatosPropiedad);

      const archivos = imagenes.map((i) => i.file);
      const subidas = await subirImagenesPropiedad(propiedad.id, archivos);

      const mainIndex = imagenes.findIndex((i) => i.esMain);
      if (mainIndex > 0 && subidas[mainIndex]) {
        await setMainImage(propiedad.id, subidas[mainIndex].id);
      }

      navigate("/panel/propiedades");
    } catch (e: any) {
      setError(e.response?.data?.message ?? "Error al publicar la propiedad.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ color: "#1B2B5E" }}>Publicar propiedad</h1>
          <p className="text-sm mt-1" style={{ color: "#8A92B2" }}>Paso {paso + 1} de {PASOS.length}</p>
          <div className="flex gap-2 mt-4">
            {PASOS.map((nombre, i) => (
              <div key={i} className="flex-1">
                <div className="h-2 rounded-full transition-all" style={{ background: i <= paso ? "linear-gradient(135deg,#1B2B5E,#4A5FA8)" : "#E5E7EB" }} />
                <p className="text-xs mt-1" style={{ color: i === paso ? "#1B2B5E" : "#9CA3AF", fontWeight: i === paso ? 600 : 400 }}>{nombre}</p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

          {/* Paso 1: Info Básica */}
          {paso === 0 && (
            <div className="rounded-2xl border p-6 space-y-4" style={{ background: "white", borderColor: "rgba(27,43,94,0.08)" }}>
              <h2 className="font-semibold" style={{ color: "#1B2B5E" }}>Información básica</h2>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>Título *</label>
                <input {...register("title")}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={{ background: "#F8F9FF", border: "1.5px solid rgba(27,43,94,0.12)", color: "#1B2B5E" }}
                  placeholder="Ej: Hermosa casa en Polanco con jardín" />
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
                <input {...register("price")} type="number" min="0"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={{ background: "#F8F9FF", border: "1.5px solid rgba(27,43,94,0.12)", color: "#1B2B5E" }}
                  placeholder="Ej: 2500000" />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#374151" }}>Dirección *</label>
                <input {...register("location")}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={{ background: "#F8F9FF", border: "1.5px solid rgba(27,43,94,0.12)", color: "#1B2B5E" }}
                  placeholder="Calle, número, colonia" />
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
                <textarea {...register("description")} rows={3}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
                  style={{ background: "#F8F9FF", border: "1.5px solid rgba(27,43,94,0.12)", color: "#1B2B5E" }}
                  placeholder="Describe las características más importantes..." />
              </div>
            </div>
          )}

          {/* Paso 2: Detalles */}
          {paso === 1 && (
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
          )}

          {/* Paso 3: Servicios */}
          {paso === 2 && (
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
          )}

          {/* Paso 4: Imágenes */}
          {paso === 3 && (
            <div className="rounded-2xl border p-6" style={{ background: "white", borderColor: "rgba(27,43,94,0.08)" }}>
              <h2 className="font-semibold mb-1" style={{ color: "#1B2B5E" }}>Imágenes</h2>
              <p className="text-sm mb-4" style={{ color: "#8A92B2" }}>
                Sube fotos de la propiedad. Haz clic en una imagen para marcarla como <strong>principal</strong>.
                Formatos: JPG, PNG, WEBP (máx. 5 MB c/u).
              </p>

              {/* Drop zone */}
              <label
                className="flex flex-col items-center justify-center w-full rounded-xl cursor-pointer transition hover:opacity-90 mb-4"
                style={{ border: "2px dashed rgba(27,43,94,0.2)", background: "#F8F9FF", padding: "28px 16px" }}
                onClick={() => fileInputRef.current?.click()}
              >
                <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" style={{ color: "#B0B8D0", marginBottom: 8 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <p className="text-sm font-semibold" style={{ color: "#1B2B5E" }}>Seleccionar fotos</p>
                <p className="text-xs mt-1" style={{ color: "#8A92B2" }}>o arrastra y suelta aquí</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleArchivos(e.target.files)}
                />
              </label>

              {imagenes.length === 0 && (
                <p className="text-center text-sm py-2" style={{ color: "#E06B6B" }}>
                  Debes subir al menos 1 imagen.
                </p>
              )}

              {imagenes.length > 0 && (
                <>
                  <p className="text-xs mb-3" style={{ color: "#8A92B2" }}>
                    Haz clic en una imagen para marcarla como principal (★)
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {imagenes.map((img, i) => (
                      <div
                        key={i}
                        className="relative rounded-xl overflow-hidden cursor-pointer group"
                        style={{
                          aspectRatio: "1",
                          border: img.esMain
                            ? "2.5px solid #C9A96E"
                            : "2px solid rgba(27,43,94,0.1)",
                        }}
                        onClick={() => marcarMain(i)}
                      >
                        <img src={img.preview} alt="" className="w-full h-full object-cover" />
                        {img.esMain && (
                          <div className="absolute bottom-0 left-0 right-0 text-center text-white text-[10px] font-bold py-0.5"
                            style={{ background: "rgba(201,169,110,0.9)" }}>
                            PRINCIPAL
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); eliminarImagen(i); }}
                          className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition"
                          style={{ background: "rgba(224,107,107,0.9)" }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-2 pb-8">
            {paso > 0 ? (
              <button type="button" onClick={() => setPaso((p) => p - 1)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium transition"
                style={{ border: "1.5px solid rgba(27,43,94,0.12)", color: "#6B7280" }}>
                ← Atrás
              </button>
            ) : <div />}

            {paso < PASOS.length - 1 ? (
              <button type="button" onClick={irSiguiente}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition"
                style={{ background: "linear-gradient(135deg,#1B2B5E,#4A5FA8)" }}>
                Siguiente →
              </button>
            ) : (
              <button type="submit" disabled={guardando || imagenes.length === 0}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition disabled:opacity-50"
                style={{ background: "linear-gradient(135deg,#C9A96E,#B8924A)" }}>
                {guardando ? "Publicando..." : "Publicar propiedad"}
              </button>
            )}
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
