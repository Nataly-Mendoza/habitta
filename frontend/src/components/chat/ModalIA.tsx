interface Props {
  abierto: boolean;
  onCerrar: () => void;
  cargando: boolean;
  originalUrl?: string;
  generatedUrl?: string;
  error?: string;
  onReintentar?: () => void;
  canRetry?: boolean;
}

export function ModalIA({
  abierto,
  onCerrar,
  cargando,
  originalUrl,
  generatedUrl,
  error,
  onReintentar,
  canRetry = true,
}: Props) {
  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={onCerrar}
    >
      <div
        className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "white",
          maxWidth: generatedUrl ? "1100px" : "520px",
          maxHeight: "90vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{
            background: "linear-gradient(135deg,#111829,#1B2B5E)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">✨</span>
            <div>
              <h3 className="font-semibold text-white text-base">Amueblar con IA</h3>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                Powered by Stable Diffusion · instruct-pix2pix
              </p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition hover:bg-white/10"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: "calc(90vh - 70px)" }}>

          {/* Loading */}
          {cargando && (
            <div className="flex flex-col items-center justify-center py-16 gap-5">
              <div className="relative w-16 h-16">
                <div
                  className="absolute inset-0 rounded-full animate-spin"
                  style={{ border: "3px solid rgba(201,169,110,0.2)", borderTopColor: "#C9A96E" }}
                />
                <div className="absolute inset-2 rounded-full flex items-center justify-center text-2xl">
                  🏠
                </div>
              </div>
              <div className="text-center">
                <p className="font-semibold mb-1" style={{ color: "#1B2B5E" }}>
                  Generando con IA…
                </p>
                <p className="text-sm" style={{ color: "#8A92B2" }}>
                  El modelo está amueblando el espacio. Puede tardar entre 30 y 90 segundos.
                </p>
              </div>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ background: "#C9A96E", animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {!cargando && error && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="font-semibold mb-2" style={{ color: "#1B2B5E" }}>
                No se pudo generar la imagen
              </p>
              <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: "#8A92B2" }}>
                {error}
              </p>
              {canRetry && onReintentar && (
                <button
                  onClick={onReintentar}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition"
                  style={{ background: "linear-gradient(135deg,#1B2B5E,#4A5FA8)" }}
                >
                  Reintentar
                </button>
              )}
            </div>
          )}

          {/* Split comparison result */}
          {!cargando && generatedUrl && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Original */}
                <div>
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-2"
                    style={{ background: "rgba(27,43,94,0.08)" }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ background: "#8A92B2" }} />
                    <span className="text-xs font-semibold" style={{ color: "#5A6280" }}>
                      ORIGINAL
                    </span>
                  </div>
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{ border: "2px solid rgba(27,43,94,0.1)" }}
                  >
                    <img
                      src={originalUrl}
                      alt="Imagen original"
                      className="w-full object-cover"
                      style={{ maxHeight: "400px" }}
                    />
                  </div>
                </div>

                {/* Generated */}
                <div>
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-2"
                    style={{ background: "rgba(201,169,110,0.15)" }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ background: "#C9A96E" }} />
                    <span className="text-xs font-semibold" style={{ color: "#B8924A" }}>
                      ✨ AMUEBLADO CON IA
                    </span>
                  </div>
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{
                      border: "2px solid rgba(201,169,110,0.4)",
                      boxShadow: "0 4px 20px rgba(201,169,110,0.15)",
                    }}
                  >
                    <img
                      src={generatedUrl}
                      alt="Imagen generada con IA"
                      className="w-full object-cover"
                      style={{ maxHeight: "400px" }}
                    />
                  </div>
                </div>
              </div>

              <p className="text-xs text-center" style={{ color: "#B0B8D0" }}>
                Generado con Hugging Face · instruct-pix2pix · Solo para visualización, no refleja la propiedad real
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
