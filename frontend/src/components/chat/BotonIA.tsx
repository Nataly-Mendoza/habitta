import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { amoblarConIA } from "../../services/ia";
import { useAutenticacion } from "../../hooks/useAutenticacion";
import { ModalIA } from "./ModalIA";

interface Props {
  imageUrl: string;
  propiedadTipo: string;
}

export function BotonIA({ imageUrl, propiedadTipo }: Props) {
  const navigate = useNavigate();
  const { usuario } = useAutenticacion();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [original, setOriginal] = useState<string>();
  const [generada, setGenerada] = useState<string>();
  const [error, setError] = useState<string>();
  const [canRetry, setCanRetry] = useState(true);

  const ejecutar = async () => {
    if (!usuario) { navigate("/login"); return; }

    setModalAbierto(true);
    setCargando(true);
    setOriginal(imageUrl);
    setGenerada(undefined);
    setError(undefined);

    try {
      const res = await amoblarConIA(imageUrl);
      setGenerada(res.generated);
    } catch (e: any) {
      const msg: string = e.response?.data?.message ?? "Error al generar la imagen.";
      setError(msg);
      setCanRetry(e.response?.data?.retry ?? e.response?.status !== 422);
    } finally {
      setCargando(false);
    }
  };

  if (propiedadTipo === "land") return null;

  return (
    <>
      <button
        onClick={ejecutar}
        disabled={cargando}
        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold shadow-md transition disabled:opacity-60"
        style={{ background: "rgba(255,255,255,0.92)", color: "#1B2B5E" }}
      >
        ✨ Amueblar con IA
      </button>

      <ModalIA
        abierto={modalAbierto}
        onCerrar={() => { setModalAbierto(false); setCargando(false); }}
        cargando={cargando}
        originalUrl={original}
        generatedUrl={generada}
        error={error}
        canRetry={canRetry}
        onReintentar={ejecutar}
      />
    </>
  );
}
