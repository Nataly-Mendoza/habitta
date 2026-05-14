import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DatosLogin } from "../types/schemas";
import { esquemaLogin } from "../types/schemas";
import { Eye, EyeOff, Home, ArrowRight, Lock, Mail } from "lucide-react";
import * as servicioAutenticacion from "../services/autenticacion";
import { useAutenticacion } from "../hooks/useAutenticacion";

export function PaginaLogin() {
  const navegar = useNavigate();
  const { guardarSesion } = useAutenticacion();
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DatosLogin>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(esquemaLogin) as any,
    mode: "onBlur",
  });

  const alEnviar = async (datos: DatosLogin) => {
    setCargando(true);
    setErrorGeneral("");

    try {
      const respuesta = await servicioAutenticacion.iniciarSesion({
        email: datos.correo,
        password: datos.contrasena,
      });
      guardarSesion(respuesta.token, respuesta.usuario);
      navegar("/panel");
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.mensaje ||
        "Credenciales inválidas.";
      setErrorGeneral(msg);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo: Imagen (oculto en mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"
          alt="Propiedad de lujo"
          className="w-full h-full object-cover"
        />
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(17,24,41,0.85) 0%, rgba(27,43,94,0.7) 100%)",
          }}
          className="absolute inset-0"
        />
        <div
          style={{
            background: "rgba(201,169,110,0.15)",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            position: "absolute",
            bottom: "-100px",
            right: "-80px",
            filter: "blur(80px)",
          }}
        />

        <div className="relative p-12 flex flex-col justify-between h-full">
          {/* Logo */}
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

          {/* Contenido */}
          <div>
            <p
              style={{
                color: "#C9A96E",
                fontSize: "13px",
                letterSpacing: "0.1em",
              }}
              className="uppercase font-semibold mb-4"
            >
              ✦ Bienvenido
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
              Tu hogar ideal <br />
              te espera
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "16px",
                lineHeight: "1.7",
                maxWidth: "380px",
              }}
            >
              Inicia sesión para acceder a tus propiedades guardadas, gestionar
              anuncios y conectar con agentes.
            </p>

            <div className="flex items-center gap-8 mt-8">
              {[
                { valor: "12K+", etiqueta: "Propiedades" },
                { valor: "8.5K+", etiqueta: "Clientes" },
                { valor: "5★", etiqueta: "Calificación" },
              ].map((stat, i) => (
                <div key={i}>
                  <p style={{ color: "#C9A96E", fontSize: "22px", fontWeight: "700" }}>
                    {stat.valor}
                  </p>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>
                    {stat.etiqueta}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonio */}
          <div
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "20px",
            }}
            className="p-5"
          >
            <p
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: "14px",
                lineHeight: "1.7",
                fontStyle: "italic",
              }}
            >
              "Habitta nos ayudó a encontrar nuestro departamento ideal en París en
              solo 2 semanas. ¡La plataforma es excepcional!"
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div
                style={{
                  background: "linear-gradient(135deg, #C9A96E, #B8924A)",
                  color: "white",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  fontSize: "12px",
                }}
                className="flex items-center justify-center font-semibold"
              >
                SL
              </div>
              <div>
                <p style={{ color: "white", fontSize: "13px", fontWeight: "600" }}>
                  Sophie Laurent
                </p>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>
                  París, Francia
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel derecho: Formulario */}
      <div style={{ background: "#F8F4EE" }} className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">
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
            <div className="mb-7">
              <h1
                style={{
                  color: "#1B2B5E",
                  fontSize: "28px",
                  fontWeight: "700",
                  letterSpacing: "-0.5px",
                }}
              >
                Bienvenido
              </h1>
              <p style={{ color: "#8A92B2", fontSize: "14px", marginTop: "6px" }}>
                Inicia sesión en tu cuenta Habitta
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
              {/* Correo */}
              <div>
                <label
                  style={{ color: "#3A4570", fontSize: "13px", fontWeight: "500" }}
                  className="block mb-1.5"
                >
                  Correo
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
                    placeholder="usuario@habitta.mx"
                    {...register("correo")}
                    style={{
                      width: "100%",
                      border: errors.correo
                        ? "1.5px solid rgba(224,107,107,0.4)"
                        : "1.5px solid rgba(27,43,94,0.1)",
                      borderRadius: "14px",
                      padding: "12px 14px 12px 42px",
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

              {/* Contraseña */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    style={{
                      color: "#3A4570",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                  >
                    Contraseña
                  </label>
                  <Link
                    to="#"
                    style={{
                      color: "#C9A96E",
                      fontSize: "13px",
                      fontWeight: "500",
                    }}
                    className="hover:opacity-70 transition-all"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
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
                    placeholder="••••••••"
                    {...register("contrasena")}
                    style={{
                      width: "100%",
                      border: errors.contrasena
                        ? "1.5px solid rgba(224,107,107,0.4)"
                        : "1.5px solid rgba(27,43,94,0.1)",
                      borderRadius: "14px",
                      padding: "12px 42px 12px 42px",
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
                    className="hover:text-[#5A6280] transition-colors"
                  >
                    {mostrarContrasena ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                {errors.contrasena && (
                  <p style={{ color: "#E06B6B", fontSize: "12px", marginTop: "4px" }}>
                    {errors.contrasena.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={cargando}
                style={{
                  background: "linear-gradient(135deg, #1B2B5E, #4A5FA8)",
                  color: "white",
                  borderRadius: "14px",
                  width: "100%",
                }}
                className="flex items-center justify-center gap-3 py-3.5 font-semibold text-sm transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-60"
              >
                {cargando ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Iniciando sesión...
                  </span>
                ) : (
                  <>
                    Iniciar sesión
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
                o continúa con
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
              ¿No tienes cuenta?{" "}
              <Link
                to="/registro"
                style={{ color: "#1B2B5E", fontWeight: "600" }}
                className="hover:underline"
              >
                Crear cuenta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
