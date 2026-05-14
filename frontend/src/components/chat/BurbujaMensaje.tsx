import type { Mensaje } from "../../types";

interface Props {
  mensaje: Mensaje;
  esMio: boolean;
}

export const BurbujaMensaje = ({ mensaje, esMio }: Props) => {
  const hora = new Date(mensaje.created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex ${esMio ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`rounded-xl px-4 py-3 max-w-xs break-words ${
          esMio
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        <p className="whitespace-pre-wrap">{mensaje.contenido}</p>
        <div className="mt-2 flex items-center justify-end gap-1 text-[0.72rem] opacity-90">
          <span>{hora}</span>
          {esMio && mensaje.leido ? <span>✓✓</span> : null}
        </div>
      </div>
    </div>
  );
};
