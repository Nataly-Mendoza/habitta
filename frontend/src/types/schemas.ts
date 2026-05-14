import { z } from "zod";

// Esquema para login
export const esquemaLogin = z.object({
  correo: z
    .string({ message: "El correo es requerido" })
    .email({ message: "Ingresa una dirección de correo válida" }),
  contrasena: z
    .string({ message: "La contraseña es requerida" })
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
});

export type DatosLogin = z.infer<typeof esquemaLogin>;

// Esquema para registro
export const esquemaRegistro = z
  .object({
    nombre: z
      .string({ message: "El nombre es requerido" })
      .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    apellido: z
      .string({ message: "El apellido es requerido" })
      .min(2, { message: "El apellido debe tener al menos 2 caracteres" }),
    correo: z
      .string({ message: "El correo es requerido" })
      .email({ message: "Ingresa una dirección de correo válida" }),
    telefono: z
      .string()
      .optional()
      .refine(
        (value) => !value || /^[\d\s\-+()]+$/.test(value),
        { message: "El teléfono no es válido" }
      ),
    tipoUsuario: z.enum(["comprador", "propietario"], {
      message: "Selecciona un tipo de usuario válido",
    }),
    contrasena: z
      .string({ message: "La contraseña es requerida" })
      .min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
      .regex(/[A-Z]/, {
        message: "La contraseña debe contener al menos una mayúscula",
      })
      .regex(/[0-9]/, {
        message: "La contraseña debe contener al menos un número",
      }),
    confirmarContrasena: z.string({
      message: "La confirmación de contraseña es requerida",
    }),
    aceptarTerminos: z.boolean().refine((value) => value === true, {
      message: "Debes aceptar los Términos de Servicio y Política de Privacidad",
    }),
  })
  .refine((data) => data.contrasena === data.confirmarContrasena, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarContrasena"],
  });

export type DatosRegistro = z.infer<typeof esquemaRegistro>;
