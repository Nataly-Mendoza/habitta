import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Search, MapPin, Trash2 } from "lucide-react";

interface FiltrosBusquedaProps {
  onFiltrar: (filtros: Record<string, string>) => void; // O el tipo que estés usando
}

export const FiltrosBusqueda = ({ onFiltrar}: FiltrosBusquedaProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [filtros, setFiltros] = useState({
    operacion: searchParams.get("operacion") || "venta",
    tipo: searchParams.get("tipo") || "",
    ubicacion: searchParams.get("ubicacion") || "",
    precio_min: searchParams.get("precio_min") || "",
    precio_max: searchParams.get("precio_max") || "",
    metros_min: searchParams.get("metros_min") || "",
    metros_max: searchParams.get("metros_max") || "",
    recamaras: searchParams.get("recamaras") || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
    onFiltrar({ [e.target.name]: e.target.value });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });
    
    navigate(`/catalogo?${params.toString()}`);
  };

  const handleLimpiar = () => {
    setFiltros({
      operacion: "venta", tipo: "", ubicacion: "",
      precio_min: "", precio_max: "", metros_min: "",
      metros_max: "", recamaras: ""
    });
    setSearchParams({ operacion: "venta" });
    onFiltrar({});
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      {/* Selector Venta/Renta */}
      <div className="flex gap-2 mb-6">
        {["venta", "renta"].map((op) => (
          <button 
            key={op} type="button"
            onClick={() => {
              setFiltros({...filtros, operacion: op});
              onFiltrar({ operacion: op });
            }}
            style={{ 
              background: filtros.operacion === op ? "linear-gradient(135deg, #1B2B5E, #4A5FA8)" : "#F3F4F6",
              color: filtros.operacion === op ? "white" : "#8A92B2" 
            }}
            className="px-6 py-2 rounded-xl text-xs font-bold uppercase transition-all"
          >
            {op}
          </button>
        ))}
      </div>

      {/* Grid de Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tipo */}
        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
          <label htmlFor="tipo-select" className="text-[10px] font-bold text-gray-400 uppercase">Type</label>
          <select id="tipo-select" name="tipo" value={filtros.tipo} onChange={handleChange} className="w-full bg-transparent text-sm font-semibold text-[#1B2B5E] outline-none">
            <option value="">All Types</option>
            <option value="casa">Casa</option>
            <option value="depto">Departamento</option>
            <option value="local">Local</option>
            <option value="terreno">Terreno</option>
            <option value="oficina">Oficina</option>
          </select>
        </div>

        {/* Ubicación */}
        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 md:col-span-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Location</label>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-[#C9A96E]" />
            <input name="ubicacion" type="text" value={filtros.ubicacion} onChange={handleChange} placeholder="Where to?" className="w-full bg-transparent text-sm font-semibold text-[#1B2B5E] outline-none" />
          </div>
        </div>

        {/* Recámaras */}
        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Beds</label>
          <select name="recamaras" value={filtros.recamaras} onChange={handleChange} className="w-full bg-transparent text-sm font-semibold text-[#1B2B5E] outline-none">
            <option value="">Any</option>
            {[1, 2, 3, 4, "5+"].map(n => <option key={n} value={n.toString()}>{n}</option>)}
          </select>
        </div>

        {/* Precios */}
        <div style={{ border: "1.5px solid rgba(27,43,94,0.1)", borderRadius: "14px", background: "rgba(27,43,94,0.02)" }} className="p-3">
            <label className="block text-[10px] uppercase font-bold mb-1 text-[#8A92B2]">
                Min Price
            </label>
            <input 
                type="number" 
                name="precio_min"
                placeholder={filtros.operacion === "venta" ? "$500,000" : "$ 500/mo"}
                value={filtros.precio_min} 
                onChange={handleChange} 
                className="w-full bg-transparent border-none text-sm font-medium text-[#1B2B5E] outline-none placeholder:text-[#B0B8D0]"
            />
        </div>
        <div style={{ border: "1.5px solid rgba(27,43,94,0.1)", borderRadius: "14px", background: "rgba(27,43,94,0.02)" }} className="p-3">
            <label className="block text-[10px] uppercase font-bold mb-1 text-[#8A92B2]">
                Max Price
            </label>
            <input 
                type="number" 
                name="precio_max"
                placeholder={filtros.operacion === "venta" ? "$2,000,000" : "$2,000/mo"}
                value={filtros.precio_max} 
                onChange={handleChange} 
                className="w-full bg-transparent border-none text-sm font-medium text-[#1B2B5E] outline-none placeholder:text-[#B0B8D0]"
            />
        </div>

        {/* Metros */}
        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Min m²</label>
          <input name="metros_min" type="number" value={filtros.metros_min} onChange={handleChange} placeholder="0" className="w-full bg-transparent text-sm font-semibold text-[#1B2B5E] outline-none" />
        </div>
        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
          <label className="text-[10px] font-bold text-gray-400 uppercase">Max m²</label>
          <input name="metros_max" type="number" value={filtros.metros_max} onChange={handleChange} placeholder="Max" className="w-full bg-transparent text-sm font-semibold text-[#1B2B5E] outline-none" />
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 mt-4">
        <button type="button" onClick={handleLimpiar} className="px-6 py-3 rounded-xl bg-gray-100 text-gray-400 hover:text-red-500 transition-all flex items-center gap-2 font-bold text-sm">
          <Trash2 size={18} /> Clear
        </button>
        <button type="submit" style={{ background: "linear-gradient(135deg, #1B2B5E, #4A5FA8)" }} className="px-10 py-3 rounded-xl text-white font-bold flex items-center gap-2 shadow-lg hover:opacity-90">
          <Search size={18} /> Search Properties
        </button>
      </div>
    </form>
  );
};

export default FiltrosBusqueda;