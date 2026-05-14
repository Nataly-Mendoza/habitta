// Datos de usuario y propiedad para mocks
// Nota: Estos datos se pueden reemplazar cuando existan mocks/autenticacion.mock.ts y mocks/propiedades.mock.ts
const usuarioMock = {
  id: 1,
  nombre: "Emiliano Duran",
};

const usuarioPropietarioMock = {
  id: 2,
  nombre: "Jesus Espinosa",
};

const usuarioOtroPropietarioMock = {
  id: 3,
  nombre: "Nataly Gomez",
};

const propiedadMock = {
  id: 1,
  titulo: "Apartamento Moderno Centro",
  foto_principal_url: "https://picsum.photos/seed/property-1/400/300",
};

const propiedadMock2 = {
  id: 2,
  titulo: "Casa con Piscina Zona Residencial",
  foto_principal_url: "https://picsum.photos/seed/property-2/400/300",
};

const propiedadMock3 = {
  id: 3,
  titulo: "Penthouse Vista Panorámica",
  foto_principal_url: "https://picsum.photos/seed/property-3/400/300",
};

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

// Conversaciones Mock
export const conversacionesMock: Conversacion[] = [
  {
    id: 1,
    propiedad: propiedadMock,
    usuario_interesado: usuarioMock,
    usuario_propietario: usuarioPropietarioMock,
    ultimo_mensaje: {
      contenido: "¿A qué hora podemos agendar la visita?",
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    mensajes_no_leidos: 2,
  },
  {
    id: 2,
    propiedad: propiedadMock2,
    usuario_interesado: usuarioMock,
    usuario_propietario: usuarioOtroPropietarioMock,
    ultimo_mensaje: {
      contenido:
        "La propiedad está disponible desde el próximo mes",
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
    mensajes_no_leidos: 0,
  },
  {
    id: 3,
    propiedad: propiedadMock3,
    usuario_interesado: usuarioMock,
    usuario_propietario: usuarioPropietarioMock,
    ultimo_mensaje: {
      contenido:
        "Sí, me interesa conocer más detalles sobre la propiedad",
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    mensajes_no_leidos: 1,
  },
];

// Mensajes Mock (pertenecen a la conversación 1)
export const mensajesMock: Mensaje[] = [
  {
    id: 1,
    conversacion_id: 1,
    usuario: usuarioPropietarioMock,
    contenido: "¡Hola! Gracias por tu interés en la propiedad",
    leido: true,
    created_at: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: 2,
    conversacion_id: 1,
    usuario: usuarioMock,
    contenido: "Hola Carlos, me encantó la propiedad en el anuncio",
    leido: true,
    created_at: new Date(Date.now() - 10200000).toISOString(),
  },
  {
    id: 3,
    conversacion_id: 1,
    usuario: usuarioPropietarioMock,
    contenido:
      "Excelente, tengo disponibilidad mañana o el fin de semana",
    leido: true,
    created_at: new Date(Date.now() - 5400000).toISOString(),
  },
  {
    id: 4,
    conversacion_id: 1,
    usuario: usuarioMock,
    contenido: "¿A qué hora podemos agendar la visita?",
    leido: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 5,
    conversacion_id: 1,
    usuario: usuarioPropietarioMock,
    contenido:
      "Perfecto, a las 3 PM te vendría bien? Nos vemos en la entrada",
    leido: false,
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
];
