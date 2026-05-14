import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DatosRegistro } from "../types/schemas";
import { esquemaRegistro } from "../types/schemas";
import {
  Eye,
  EyeOff,
  Home,
  ArrowRight,
  Lock,
  Mail,
  User,
  Phone,
  Check,
} from "lucide-react";
import * as servicioAutenticacion from "../services/autenticacion";
import { useAutenticacion } from "../hooks/useAutenticacion";

const requisitosContrasena = [
  {
    id: "longitud",
    etiqueta: "Al menos 8 caracteres",
    prueba: (c: string) => c.length >= 8,
  },
  {
    id: "mayuscula",
    etiqueta: "Una mayúscula",
    prueba: (c: string) => /[A-Z]/.test(c),
  },
  {
    id: "numero",
    etiqueta: "Un número",
    prueba: (c: string) => /[0-9]/.test(c),
  },
];

export function PaginaRegistro() {
  const navegar = useNavigate();
  const { guardarSesion } = useAutenticacion();
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
  } = useForm<DatosRegistro>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(esquemaRegistro) as any,
    mode: "onBlur",
  });

  const contrasena = watch("contrasena");
  const confirmarContrasena = watch("confirmarContrasena");

  const fortalezaContrasena = requisitosContrasena.filter((r) =>
    r.prueba(contrasena || "")
  ).length;

  const colorFortaleza =
    fortalezaContrasena === 0
      ? "#E5E7EB"
      : fortalezaContrasena === 1
      ? "#E06B6B"
      : fortalezaContrasena === 2
      ? "#C9A96E"
      : "#2A7A4E";

  const alEnviar = async (datos: DatosRegistro) => {
    setCargando(true);
    setErrorGeneral("");

    try {
      const respuesta = await servicioAutenticacion.registrar({
        nombre: datos.nombre,
        apellido: datos.apellido,
        email: datos.correo,
        telefono: datos.telefono,
        password: datos.contrasena,
        password_confirmation: datos.confirmarContrasena,
      });

      guardarSesion(respuesta.token, respuesta.usuario);
      navegar("/panel");
    } catch (error: any) {
      const apiErrors = error?.response?.data?.errors;
      if (apiErrors?.email) {
        setError("correo", { message: apiErrors.email[0] });
      } else {
        setErrorGeneral(
          error?.response?.data?.message || "Error al registrarse"
        );
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo: Imagen (oculto en mobile) */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"
          alt="Propiedad de lujo"
          className="w-full h-full object-cover"
        />
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(17,24,41,0.88) 0%, rgba(27,43,94,0.72) 100%)",
          }}
          className="absolute inset-0"
        />
        <div
          style={{
            background: "rgba(201,169,110,0.12)",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            position: "absolute",
            top: "-80px",
            left: "-60px",
            filter: "blur(70px)",
          }}
        />
        <div
          style={{
            background: "rgba(74,95,168,0.15)",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            position: "absolute",
            bottom: "-60px",
            right: "-40px",
            filter: "blur(60px)",
          }}
        />

        <div className="relative p-12 flex flex-col justify-between h-full">
          <Link to="/" className="flex items-center gap-2">
            <div
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
            >
              <Home size={18} color="white" />
            </div>
            <span
              style={{
                color: "white",
                fontSize: "22px",
                fontWeight: "700",
                letterSpacing: "-0.5px",
              }}
            >
              Habitta
            </span>
          </Link>

          <div>
            <p
              style={{
                color: "#C9A96E",
                fontSize: "13px",
                letterSpacing: "0.1em",
              }}
              className="uppercase font-semibold mb-4"
            >
              ✦ Únete a Habitta
            </p>
            <h2
              style={{
                color: "white",
                fontSize: "36px",
                fontWeight: "700",
                letterSpacing: "-0.5px",
                lineHeight: "1.2",
              }}
              className="mb-4"
            >
              Comienza tu viaje <br />
              hacia tu hogar ideal
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "15px",
                lineHeight: "1.7",
                maxWidth: "360px",
              }}
            >
              Únete a 8.5K+ clientes satisfechos que encontraron su propiedad
              ideal con Habitta.
            </p>

            {/* Beneficios */}
            <div className="space-y-3 mt-8">
              {[
                "Acceso a 12,000+ anuncios exclusivos",
                "Visualización con IA de ambientes",
                "Mensajería directa con propietarios",
                "Alertas de precio y análisis de mercado",
              ].map((beneficio, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    style={{
                      background: "linear-gradient(135deg, #C9A96E, #B8924A)",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                    }}
                    className="flex items-center justify-center shrink-0"
                  >
                    <Check size={12} color="white" />
                  </div>
                  <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px" }}>
                    {beneficio}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Estadísticas */}
          <div className="flex items-center gap-6">
            {[
              { valor: "12K+", etiqueta: "Propiedades" },
              { valor: "8.5K+", etiqueta: "Clientes" },
              { valor: "4.9★", etiqueta: "Calificación" },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  borderRight: i < 2 ? "1px solid rgba(255,255,255,0.15)" : "none",
                }}
                className="pr-6"
              >
                <p
                  style={{
                    color: "#C9A96E",
                    fontSize: "20px",
                    fontWeight: "700",
                  }}
                >
                  {stat.valor}
                </p>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px" }}>
                  {stat.etiqueta}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho: Formulario */}
      <div
        style={{ background: "#F8F4EE" }}
        className="flex-1 flex items-center justify-center px-6 py-10 overflow-y-auto"
      >
        <div className="w-full max-w-[440px]">
          {/* Logo móvil */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div
              style={{
                background: "linear-gradient(135deg, #1B2B5E, #4A5FA8)",
              }}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
            >
              <Home size={16} color="white" />
            </div>
            <span
              style={{
                color: "#1B2B5E",
                fontSize: "20px",
                fontWeight: "700",
              }}
            >
              Habitta
            </span>
          </Link>

          <div
            style={{
              background: "white",
              borderRadius: "28px",
              boxShadow: "0 8px 40px rgba(27,43,94,0.1)",
              border: "1px solid rgba(27,43,94,0.08)",
            }}
            className="p-8"
          >
            <div className="mb-6">
              <h1
                style={{
                  color: "#1B2B5E",
                  fontSize: "26px",
                  fontWeight: "700",
                  letterSpacing: "-0.5px",
                }}
              >
                Crear cuenta
              </h1>
              <p style={{ color: "#8A92B2", fontSize: "14px", marginTop: "6px" }}>
                Únete a Habitta — es gratis, rápido y seguro
              </p>
            </div>

            {/* Error general */}
            {errorGeneral && (
              <div
                style={{
                  background: "rgba(224,107,107,0.08)",
                  border: "1px solid rgba(224,107,107,0.25)",
                  borderRadius: "12px",
                }}
                className="p-3 mb-5"
              >
                <p style={{ color: "#E06B6B", fontSize: "13px" }}>
                  {errorGeneral}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit(alEnviar)} className="space-y-4">
              {/* Nombre */}
              <div>
                <label
                  style={{ color: "#3A4570", fontSize: "13px", fontWeight: "500" }}
                  className="block mb-1.5"
                >
                  Nombre <span style={{ color: "#E06B6B" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <User
                    size={16}
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#B0B8D0",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Juan"
                    {...register("nombre")}
                    style={{
                      width: "100%",
                      border: errors.nombre
                        ? "1.5px solid rgba(224,107,107,0.4)"
                        : "1.5px solid rgba(27,43,94,0.1)",
                      borderRadius: "14px",
                      padding: "11px 14px 11px 42px",
                      fontSize: "14px",
                      color: "#1B2B5E",
                      background: "rgba(27,43,94,0.02)",
                      outline: "none",
                    }}
                    className="placeholder:text-[#C0C8D8] focus:border-[rgba(27,43,94,0.3)] transition-colors"
                  />
                </div>
                {errors.nombre && (
                  <p style={{ color: "#E06B6B", fontSize: "12px", marginTop: "4px" }}>
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              {/* Apellido */}
              <div>
                <label
                  style={{ color: "#3A4570", fontSize: "13px", fontWeight: "500" }}
                  className="block mb-1.5"
                >
                  Apellido <span style={{ color: "#E06B6B" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <User
                    size={16}
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#B0B8D0",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Pérez"
                    {...register("apellido")}
                    style={{
                      width: "100%",
                      border: errors.apellido
                        ? "1.5px solid rgba(224,107,107,0.4)"
                        : "1.5px solid rgba(27,43,94,0.1)",
                      borderRadius: "14px",
                      padding: "11px 14px 11px 42px",
                      fontSize: "14px",
                      color: "#1B2B5E",
                      background: "rgba(27,43,94,0.02)",
                      outline: "none",
                    }}
                    className="placeholder:text-[#C0C8D8] focus:border-[rgba(27,43,94,0.3)] transition-colors"
                  />
                </div>
                {errors.apellido && (
                  <p style={{ color: "#E06B6B", fontSize: "12px", marginTop: "4px" }}>
                    {errors.apellido.message}
                  </p>
                )}
              </div>

              {/* Correo */}
              <div>
                <label
                  style={{ color: "#3A4570", fontSize: "13px", fontWeight: "500" }}
                  className="block mb-1.5"
                >
                  Correo <span style={{ color: "#E06B6B" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <Mail
                    size={16}
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#B0B8D0",
                    }}
                  />
                  <input
                    type="email"
                    placeholder="tu@correo.com"
                    {...register("correo")}
                    style={{
                      width: "100%",
                      border: errors.correo
                        ? "1.5px solid rgba(224,107,107,0.4)"
                        : "1.5px solid rgba(27,43,94,0.1)",
                      borderRadius: "14px",
                      padding: "11px 14px 11px 42px",
                      fontSize: "14px",
                      color: "#1B2B5E",
                      background: "rgba(27,43,94,0.02)",
                      outline: "none",
                    }}
                    className="placeholder:text-[#C0C8D8] focus:border-[rgba(27,43,94,0.3)] transition-colors"
                  />
                </div>
                {errors.correo && (
                  <p style={{ color: "#E06B6B", fontSize: "12px", marginTop: "4px" }}>
                    {errors.correo.message}
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label
                  style={{ color: "#3A4570", fontSize: "13px", fontWeight: "500" }}
                  className="block mb-1.5"
                >
                  Teléfono{" "}
                  <span style={{ color: "#8A92B2", fontWeight: "400" }}>
                    (opcional)
                  </span>
                </label>
                <div style={{ position: "relative" }}>
                  <Phone
                    size={16}
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#B0B8D0",
                    }}
                  />
                  <input
                    type="tel"
                    placeholder="+33 6 00 00 00 00"
                    {...register("telefono")}
                    style={{
                      width: "100%",
                      border: errors.telefono
                        ? "1.5px solid rgba(224,107,107,0.4)"
                        : "1.5px solid rgba(27,43,94,0.1)",
                      borderRadius: "14px",
                      padding: "11px 14px 11px 42px",
                      fontSize: "14px",
                      color: "#1B2B5E",
                      background: "rgba(27,43,94,0.02)",
                      outline: "none",
                    }}
                    className="placeholder:text-[#C0C8D8] focus:border-[rgba(27,43,94,0.3)] transition-colors"
                  />
                </div>
                {errors.telefono && (
                  <p style={{ color: "#E06B6B", fontSize: "12px", marginTop: "4px" }}>
                    {errors.telefono.message}
                  </p>
                )}
              </div>

              {/* Tipo de usuario */}
              <div>
                <label
                  style={{ color: "#3A4570", fontSize: "13px", fontWeight: "500" }}
                  className="block mb-1.5"
                >
                  ¿Qué deseas hacer? <span style={{ color: "#E06B6B" }}>*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      valor: "comprador",
                      etiqueta: "Buscar propiedades",
                    },
                    {
                      valor: "propietario",
                      etiqueta: "Publicar propiedades",
                    },
                  ].map((opcion) => (
                    <label
                      key={opcion.valor}
                      style={{
                        border: "1.5px solid rgba(27,43,94,0.1)",
                        borderRadius: "12px",
                        padding: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      className="flex items-center gap-2 hover:bg-[rgba(27,43,94,0.03)]"
                    >
                      <input
                        type="radio"
                        value={opcion.valor}
                        {...register("tipoUsuario")}
                        style={{
                          cursor: "pointer",
                        }}
                      />
                      <span style={{ fontSize: "13px", color: "#3A4570" }}>
                        {opcion.etiqueta}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.tipoUsuario && (
                  <p style={{ color: "#E06B6B", fontSize: "12px", marginTop: "4px" }}>
                    {errors.tipoUsuario.message}
                  </p>
                )}
              </div>

              {/* Contraseña */}
              <div>
                <label
                  style={{ color: "#3A4570", fontSize: "13px", fontWeight: "500" }}
                  className="block mb-1.5"
                >
                  Contraseña <span style={{ color: "#E06B6B" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <Lock
                    size={16}
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#B0B8D0",
                    }}
                  />
                  <input
                    type={mostrarContrasena ? "text" : "password"}
                    placeholder="Crea una contraseña fuerte"
                    {...register("contrasena")}
                    style={{
                      width: "100%",
                      border: errors.contrasena
                        ? "1.5px solid rgba(224,107,107,0.4)"
                        : "1.5px solid rgba(27,43,94,0.1)",
                      borderRadius: "14px",
                      padding: "11px 42px 11px 42px",
                      fontSize: "14px",
                      color: "#1B2B5E",
                      background: "rgba(27,43,94,0.02)",
                      outline: "none",
                    }}
                    className="placeholder:text-[#C0C8D8] focus:border-[rgba(27,43,94,0.3)] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarContrasena(!mostrarContrasena)}
                    style={{
                      position: "absolute",
                      right: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#B0B8D0",
                    }}
                  >
                    {mostrarContrasena ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>

                {/* Fortaleza de contraseña */}
                {contrasena && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          style={{
                            height: "3px",
                            flex: 1,
                            borderRadius: "100px",
                            background:
                              i < fortalezaContrasena ? colorFortaleza : "#E5E7EB",
                            transition: "all 0.3s",
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {requisitosContrasena.map((req) => (
                        <div key={req.id} className="flex items-center gap-1.5">
                          <div
                            style={{
                              width: "14px",
                              height: "14px",
                              borderRadius: "50%",
                              background: req.prueba(contrasena)
                                ? "#2A7A4E15"
                                : "rgba(27,43,94,0.06)",
                              border: `1px solid ${
                                req.prueba(contrasena)
                                  ? "#2A7A4E40"
                                  : "transparent"
                              }`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {req.prueba(contrasena) && (
                              <Check size={8} style={{ color: "#2A7A4E" }} />
                            )}
                          </div>
                          <span
                            style={{
                              fontSize: "11px",
                              color: req.prueba(contrasena)
                                ? "#2A7A4E"
                                : "#8A92B2",
                            }}
                          >
                            {req.etiqueta}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {errors.contrasena && (
                  <p style={{ color: "#E06B6B", fontSize: "12px", marginTop: "4px" }}>
                    {errors.contrasena.message}
                  </p>
                )}
              </div>

              {/* Confirmar contraseña */}
              <div>
                <label
                  style={{ color: "#3A4570", fontSize: "13px", fontWeight: "500" }}
                  className="block mb-1.5"
                >
                  Confirmar contraseña <span style={{ color: "#E06B6B" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <Lock
                    size={16}
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#B0B8D0",
                    }}
                  />
                  <input
                    type={mostrarConfirmar ? "text" : "password"}
                    placeholder="Repite tu contraseña"
                    {...register("confirmarContrasena")}
                    style={{
                      width: "100%",
                      border:
                        confirmarContrasena &&
                        confirmarContrasena !== contrasena
                          ? "1.5px solid rgba(224,107,107,0.4)"
                          : "1.5px solid rgba(27,43,94,0.1)",
                      borderRadius: "14px",
                      padding: "11px 42px 11px 42px",
                      fontSize: "14px",
                      color: "#1B2B5E",
                      background: "rgba(27,43,94,0.02)",
                      outline: "none",
                    }}
                    className="placeholder:text-[#C0C8D8] focus:border-[rgba(27,43,94,0.3)] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                    style={{
                      position: "absolute",
                      right: "40px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#B0B8D0",
                    }}
                  >
                    {mostrarConfirmar ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                  {confirmarContrasena && confirmarContrasena === contrasena && (
                    <Check
                      size={16}
                      style={{
                        position: "absolute",
                        right: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#2A7A4E",
                      }}
                    />
                  )}
                </div>
                {errors.confirmarContrasena && (
                  <p style={{ color: "#E06B6B", fontSize: "12px", marginTop: "4px" }}>
                    {errors.confirmarContrasena.message}
                  </p>
                )}
              </div>

              {/* Términos */}
              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  {...register("aceptarTerminos")}
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    marginTop: "2px",
                  }}
                />
                <p style={{ color: "#6A7280", fontSize: "13px", lineHeight: "1.5" }}>
                  Acepto los{" "}
                  <Link
                    to="#"
                    style={{ color: "#1B2B5E", fontWeight: "600" }}
                    className="hover:underline"
                  >
                    Términos de Servicio
                  </Link>
                  {" "}y la{" "}
                  <Link
                    to="#"
                    style={{ color: "#1B2B5E", fontWeight: "600" }}
                    className="hover:underline"
                  >
                    Política de Privacidad
                  </Link>
                </p>
              </div>
              {errors.aceptarTerminos && (
                <p style={{ color: "#E06B6B", fontSize: "12px", marginTop: "-8px" }}>
                  {errors.aceptarTerminos.message}
                </p>
              )}

              <button
                type="submit"
                disabled={cargando}
                style={{
                  background: "linear-gradient(135deg, #1B2B5E, #4A5FA8)",
                  color: "white",
                  borderRadius: "14px",
                  width: "100%",
                }}
                className="flex items-center justify-center gap-3 py-3.5 font-semibold text-sm transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-60 mt-2"
              >
                {cargando ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creando cuenta...
                  </span>
                ) : (
                  <>
                    Crear cuenta
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-5">
              <div style={{ borderTop: "1px solid rgba(27,43,94,0.1)" }} />
              <span
                style={{
                  background: "white",
                  color: "#8A92B2",
                  fontSize: "12px",
                  padding: "0 12px",
                  position: "absolute",
                  top: "-9px",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                o regístrate con
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { etiqueta: "Google", icono: "G" },
                { etiqueta: "Apple", icono: "🍎" },
              ].map((proveedor) => (
                <button
                  key={proveedor.etiqueta}
                  type="button"
                  style={{
                    border: "1.5px solid rgba(27,43,94,0.1)",
                    borderRadius: "12px",
                    color: "#3A4570",
                    fontSize: "13px",
                  }}
                  className="flex items-center justify-center gap-2 py-3 font-medium transition-all hover:bg-[rgba(27,43,94,0.03)]"
                >
                  <span>{proveedor.icono}</span>
                  {proveedor.etiqueta}
                </button>
              ))}
            </div>

            <p style={{ color: "#8A92B2", fontSize: "13px", textAlign: "center", marginTop: "20px" }}>
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/login"
                style={{ color: "#1B2B5E", fontWeight: "600" }}
                className="hover:underline"
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
