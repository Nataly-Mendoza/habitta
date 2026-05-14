//mocks/busqueda.mock.ts
import type { Ubicacion } from '../types';
import { listadoMock } from './propiedades.mock';

export const ubicacionesMock: Ubicacion[] = [
    { id: 1, estado: 'CDMX', ciudad: 'Ciudad de México', colonia: 'Roma', codigoPostal: '06700' },
    { id: 2, estado: 'Jalisco', ciudad: 'Guadalajara', colonia: 'Chapalita', codigoPostal: '45050' },
    { id: 3, estado: 'Nuevo León', ciudad: 'Monterrey', colonia: 'San Pedro', codigoPostal: '66220' },
    { id: 4, estado: 'Puebla', ciudad: 'Puebla', colonia: 'La Paz', codigoPostal: '72160' },
    { id: 5, estado: 'Guanajuato', ciudad: 'León', colonia: 'Centro', codigoPostal: '37000' },
    { id: 6, estado: 'Querétaro', ciudad: 'Querétaro', colonia: 'Juriquilla', codigoPostal: '76230' },
    { id: 7, estado: 'Michoacán', ciudad: 'Morelia', colonia: 'Vista Bella', codigoPostal: '58130' },
    { id: 8, estado: 'Chihuahua', ciudad: 'Chihuahua', colonia: 'San Felipe', codigoPostal: '31125' },
    { id: 9, estado: 'Sonora', ciudad: 'Hermosillo', colonia: 'El Prado', codigoPostal: '83000' },
    { id: 10, estado: 'Yucatán', ciudad: 'Mérida', colonia: 'Altabrisa', codigoPostal: '97130' },
];

export { listadoMock };