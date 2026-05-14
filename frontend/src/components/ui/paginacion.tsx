import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginacionProps {
  paginaActual: number;
  totalPaginas: number;
  onCambiar: (pagina: number) => void;
}

export const Paginacion = ({ paginaActual, totalPaginas, onCambiar }: PaginacionProps) => {
  
  // Numeros de paginas a mostrar
  const getPaginas = () => {
    const paginas: (number | string)[] = [];
    const maxBotones = 7;

    if (totalPaginas <= maxBotones) {
      for (let i = 1; i <= totalPaginas; i++) paginas.push(i);
    } else {
      // Siempre mostrar la primera pagina
      paginas.push(1);

      if (paginaActual > 4) {
        paginas.push("...");
      }

      const inicio = Math.max(2, paginaActual - 1);
      const fin = Math.min(totalPaginas - 1, paginaActual + 1);

      // Ajuste para mantener siempre el mismo número de botones si es posible
      if (paginaActual <= 4) {
        for (let i = 2; i <= 5; i++) paginas.push(i);
        paginas.push("...");
      } else if (paginaActual >= totalPaginas - 3) {
        paginas.push("...");
        for (let i = totalPaginas - 4; i <= totalPaginas - 1; i++) paginas.push(i);
      } else {
        for (let i = inicio; i <= fin; i++) paginas.push(i);
        paginas.push("...");
      }

      // Siempre mostrar la ultima pagina
      paginas.push(totalPaginas);
    }
    return paginas;
  };

  const btnEstiloBase = "flex items-center justify-center transition-all duration-200 rounded-xl border w-10 h-10 text-sm font-medium";

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      {/* Botón Anterior */}
      <button
        onClick={() => onCambiar(paginaActual - 1)}
        disabled={paginaActual === 1}
        className={`${btnEstiloBase} ${
          paginaActual === 1 
          ? "border-gray-100 text-gray-300 cursor-not-allowed" 
          : "border-gray-200 text-[#3A4570] bg-white hover:bg-gray-50 hover:border-[#1B2B5E]"
        }`}
      >
        <ChevronLeft size={17} />
      </button>

      {/* Números y Gaps */}
      {getPaginas().map((p, idx) => (
        <React.Fragment key={idx}>
          {p === "..." ? (
            <span className="w-8 text-center text-[#B0B8D0] font-bold">...</span>
          ) : (
            <button
              onClick={() => onCambiar(p as number)}
              className={`${btnEstiloBase} ${
                paginaActual === p
                  ? "bg-gradient-to-br from-[#1B2B5E] to-[#4A5FA8] text-white border-none shadow-lg shadow-blue-900/20"
                  : "bg-white border-gray-200 text-[#5A6280] hover:border-[#1B2B5E] hover:text-[#1B2B5E]"
              }`}
            >
              {p}
            </button>
          )}
        </React.Fragment>
      ))}

      {/* Botón Siguiente */}
      <button
        onClick={() => onCambiar(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
        className={`${btnEstiloBase} ${
          paginaActual === totalPaginas
          ? "border-gray-100 text-gray-300 cursor-not-allowed" 
          : "border-gray-200 text-[#3A4570] bg-white hover:bg-gray-50 hover:border-[#1B2B5E]"
        }`}
      >
        <ChevronRight size={17} />
      </button>
    </div>
  );
};
export default Paginacion;