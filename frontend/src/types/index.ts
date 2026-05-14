// Ubicación e inmuebles
export interface Ubicacion {
    id: number;
    estado: string;
    ciudad: string;
    colonia?: string;
    codigoPostal?: string;
}

export interface Propiedad {
    id: number;
    titulo: string;
    descripcion: string;
    tipo: 'casa' | 'depto' | 'local' | 'terreno' | 'oficina';
    operacion: 'venta' | 'renta';
    precio: number;
    metros_cuadrados: number;
    recamaras: number;
    banos: number;
    cochera: number;
    jardin: boolean;
    luz: boolean;
    agua: boolean;
    drenaje: boolean;
    estado_publicacion: 'activa' | 'cerrada' | 'pausada';
    motivo_cierre?: string;
    descripcion_cierre?: string;
    ubicacion_id: number;
    usuario_id: number;
    ubicacion?: string;
}

export interface FiltrosBusqueda {
  tipo?: string;
  operacion?: string;
  ubicacion?: string;
  precio_min?: number;
  precio_max?: number;
  metros_min?: number;
  metros_max?: number;
  recamaras?: string;
  pagina?: number;
  limite?: number;
}

export interface EstadisticasDashboard {
  propiedades_activas: number;
  propiedades_cerradas: number;
  conversaciones_totales: number;
  mensajes_nuevos: number;
}

// Mensajería y conversaciones
export interface Mensaje {
  id: number;
  conversacion_id: number;
  usuario: {
    id: number;
    nombre: string;
  };
  contenido: string;
  leido: boolean;
  created_at: string;
}

export interface Conversacion {
  id: number;
  propiedad: {
    id: number;
    titulo: string;
    foto_principal_url: string;
  };
  usuario_interesado: {
    id: number;
    nombre: string;
  };
  usuario_propietario: {
    id: number;
    nombre: string;
  };
  ultimo_mensaje: {
    contenido: string;
    created_at: string;
  };
  mensajes_no_leidos: number;
}
