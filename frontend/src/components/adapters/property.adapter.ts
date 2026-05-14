import type { Property } from "../../data/mockData";
import type { Propiedad } from "../../types";

const tipoMap: Record<string, "casa" | "depto" | "local" | "terreno" | "oficina"> = {
  house: "casa",
  apartment: "depto",
  villa: "casa",
  penthouse: "casa",
  studio: "depto",
};
export function mapToPropiedad(p: Property): Propiedad {
  return {
    id: p.id,
    titulo: p.title,
    descripcion: p.description,
    tipo: tipoMap[p.type] ?? "casa",
    operacion: p.listingType === "sale" ? "venta" : "renta",
    precio: p.price,
    recamaras: p.bedrooms,
    banos: p.bathrooms,
    metros_cuadrados: p.area,
    cochera: p.hasGarage ? 1 : 0,
    jardin: p.hasGarden,
    estado_publicacion: p.status === "active" ? "activa" : "cerrada",
    ubicacion_id: 7,

    // 👇 AGREGAR ESTOS
    luz: true,
    agua: true,
    drenaje: true,
    usuario_id: 1,
  };
}