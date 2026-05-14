import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Grid3X3, List, Search, Home } from "lucide-react";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { PropertyCard } from "../components/ui/PropertyCard";
import { Paginacion } from "../components/ui/paginacion";
import { obtenerPropiedades, obtenerCiudades, type Propiedad, type FiltrosPropiedades } from "../services/propiedades";

const ITEMS_PER_PAGE = 9;


export function Catalogo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [ciudades, setCiudades] = useState<{ city: string; count: number }[]>([]);

  const page = Number(searchParams.get("page") || "1");

  const buildFiltros = useCallback((): FiltrosPropiedades => {
    const filtros: FiltrosPropiedades = { page, per_page: ITEMS_PER_PAGE };

    const q = searchParams.get("q");
    if (q) filtros.q = q;

    const listingType = searchParams.get("listing_type") as "sale" | "rent" | null;
    if (listingType) filtros.listing_type = listingType;

    const type = searchParams.get("type");
    if (type) filtros.type = type;

    const city = searchParams.get("city");
    if (city) filtros.city = city;

    const priceMin = searchParams.get("price_min");
    if (priceMin) filtros.price_min = Number(priceMin);

    const priceMax = searchParams.get("price_max");
    if (priceMax) filtros.price_max = Number(priceMax);

    const areaMin = searchParams.get("area_min");
    if (areaMin) filtros.area_min = Number(areaMin);

    const bedrooms = searchParams.get("bedrooms");
    if (bedrooms) filtros.bedrooms = Number(bedrooms);

    const sort = searchParams.get("sort") as FiltrosPropiedades["sort"] | null;
    if (sort) filtros.sort = sort;

    return filtros;
  }, [searchParams, page]);

  useEffect(() => {
    obtenerCiudades().then(setCiudades).catch(() => {});
  }, []);

  useEffect(() => {
    setCargando(true);
    obtenerPropiedades(buildFiltros())
      .then((res) => {
        setPropiedades(res.data);
        setTotal(res.meta.total);
        setTotalPaginas(res.meta.last_page);
      })
      .catch(() => {
        setPropiedades([]);
        setTotal(0);
      })
      .finally(() => setCargando(false));
  }, [buildFiltros]);

  const setParam = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all" && value !== "any" && value !== "") {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => setSearchParams({});

  return (
    <div className="min-h-screen bg-[#F8F4EE]">
      <Navbar />

      {/* Barra superior */}
      <div className="bg-white border-b border-gray-100 top-16 z-30 py-4 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Buscador */}
            <div className="bg-[#F0F2F8] rounded-xl flex items-center gap-2 px-4 py-1.5 border border-transparent focus-within:border-[#1B2B5E]/20 transition-all">
              <Search size={18} className="text-[#8A92B2]" />
              <input
                type="text"
                placeholder="Buscar por título, ciudad o colonia..."
                className="bg-transparent border-none outline-none text-sm text-[#1B2B5E] w-[280px] placeholder:text-[#B0B8D0]"
                value={searchParams.get("q") || ""}
                onChange={(e) => setParam("q", e.target.value)}
              />
            </div>

            {/* Operación */}
            <div className="flex bg-[#F0F2F8] p-1 rounded-xl">
              {[
                { id: "", label: "Todo" },
                { id: "sale", label: "Venta" },
                { id: "rent", label: "Renta" },
              ].map((op) => {
                const current = searchParams.get("listing_type") || "";
                const isSelected = current === op.id;
                return (
                  <button
                    key={op.id}
                    onClick={() => setParam("listing_type", op.id)}
                    className={`px-5 py-1.5 rounded-lg text-sm font-bold transition-all ${
                      isSelected ? "bg-[#1B2B5E] text-white shadow-md" : "text-[#5A6280] hover:text-[#1B2B5E]"
                    }`}
                  >
                    {op.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contador, sort y vista */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#8A92B2]">
              {cargando ? "..." : <><strong className="text-[#1B2B5E]">{total}</strong> propiedades</>}
            </span>

            <select
              value={searchParams.get("sort") || "newest"}
              className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-[#1B2B5E] outline-none"
              onChange={(e) => setParam("sort", e.target.value)}
            >
              <option value="newest">Más recientes</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
              <option value="area_asc">Área: menor a mayor</option>
              <option value="area_desc">Área: mayor a menor</option>
            </select>

            <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-[#1B2B5E] text-white" : "text-[#8A92B2] hover:bg-gray-50"}`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-[#1B2B5E] text-white" : "text-[#8A92B2] hover:bg-gray-50"}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8">
        {/* Sidebar de filtros */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="bg-white rounded-[28px] border border-gray-100 p-6 shadow-xl shadow-blue-900/5 sticky top-44">
            <div className="flex items-center justify-between mb-8">
              <h2 className="flex items-center gap-2 font-bold text-[#1B2B5E]">
                <SlidersHorizontal size={18} className="text-[#C9A96E]" /> Filtros
              </h2>
              <button
                onClick={clearFilters}
                className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest"
              >
                Limpiar
              </button>
            </div>

            <div className="space-y-6">
              {/* Tipo de propiedad */}
              <div>
                <label className="text-[11px] font-bold text-[#1B2B5E] uppercase mb-4 block tracking-wider">
                  Tipo de propiedad
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "", label: "Todo" },
                    { id: "house", label: "Casa" },
                    { id: "apartment", label: "Depto" },
                    { id: "commercial", label: "Local" },
                    { id: "land", label: "Terreno" },
                    { id: "office", label: "Oficina" },
                  ].map((t) => {
                    const isSelected = (searchParams.get("type") || "") === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setParam("type", t.id)}
                        className={`py-3 px-2 rounded-xl text-sm font-medium transition-all border ${
                          isSelected
                            ? "bg-[#F0F2F8] border-[#1B2B5E] text-[#1B2B5E] shadow-sm"
                            : "bg-white border-gray-100 text-[#8A92B2] hover:border-gray-300"
                        }`}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ciudad */}
              <div>
                <label className="text-[11px] font-bold text-[#8A92B2] uppercase mb-2 block">Ciudad</label>
                <select
                  value={searchParams.get("city") || ""}
                  onChange={(e) => setParam("city", e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-[#1B2B5E] outline-none"
                >
                  <option value="">Todas las ciudades</option>
                  {ciudades.map((c) => (
                    <option key={c.city} value={c.city}>
                      {c.city} ({c.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Recámaras */}
              <div>
                <label className="text-[11px] font-bold text-[#1B2B5E] uppercase mb-4 block tracking-wider">
                  Recámaras
                </label>
                <div className="flex flex-wrap gap-2">
                  {["", "1", "2", "3", "4", "5"].map((val) => {
                    const isSelected = (searchParams.get("bedrooms") || "") === val;
                    return (
                      <button
                        key={val}
                        onClick={() => setParam("bedrooms", val)}
                        className={`w-11 h-11 rounded-xl text-sm font-medium transition-all border flex items-center justify-center ${
                          isSelected
                            ? "bg-[#F0F2F8] border-[#1B2B5E] text-[#1B2B5E] shadow-sm ring-1 ring-[#1B2B5E]"
                            : "bg-white border-gray-100 text-[#8A92B2] hover:border-gray-300"
                        }`}
                      >
                        {val === "" ? "Todos" : val === "5" ? "5+" : val}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Precio */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#8A92B2] uppercase mb-2 block">Precio mín</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={searchParams.get("price_min") || ""}
                    onChange={(e) => setParam("price_min", e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-[#1B2B5E] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#8A92B2] uppercase mb-2 block">Precio máx</label>
                  <input
                    type="number"
                    placeholder="Máx"
                    value={searchParams.get("price_max") || ""}
                    onChange={(e) => setParam("price_max", e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-[#1B2B5E] outline-none"
                  />
                </div>
              </div>

              {/* Área mínima */}
              <div>
                <label className="text-[11px] font-bold text-[#8A92B2] uppercase mb-2 block">Área mínima (m²)</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Ej: 100"
                    value={searchParams.get("area_min") || ""}
                    onChange={(e) => setParam("area_min", e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-[#1B2B5E] outline-none"
                  />
                  <span className="absolute right-4 top-3 text-[10px] text-[#8A92B2] font-bold">M²</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Contenido principal */}
        <div className="flex-1">
          {cargando ? (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl animate-pulse h-72 border border-gray-100" />
              ))}
            </div>
          ) : propiedades.length > 0 ? (
            <>
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                {propiedades.map((p) => (
                  <PropertyCard key={p.id} property={p} variant={viewMode} />
                ))}
              </div>
              <Paginacion paginaActual={page} totalPaginas={totalPaginas} onCambiar={handlePageChange} />
            </>
          ) : (
            <div className="bg-white rounded-[32px] p-20 text-center border border-dashed border-gray-200">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home size={32} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-[#1B2B5E] mb-2">No se encontraron propiedades</h3>
              <p className="text-gray-400 max-w-xs mx-auto mb-8">Intenta ajustar los filtros para obtener más resultados.</p>
              <button
                onClick={clearFilters}
                className="bg-[#1B2B5E] text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Restablecer filtros
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
