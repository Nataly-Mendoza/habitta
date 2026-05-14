@extends('layouts.app')
@section('title', 'Catálogo de propiedades')

@section('content')

{{-- Page header --}}
<div class="py-10" style="background:linear-gradient(135deg,#111829,#1B2B5E)">
    <div class="max-w-[1400px] mx-auto px-6">
        <p class="uppercase font-semibold mb-2" style="color:#C9A96E;font-size:13px;letter-spacing:0.1em">✦ Catálogo completo</p>
        <h1 class="font-bold text-white" style="font-size:clamp(28px,4vw,40px);letter-spacing:-.5px">
            {{ $propiedades->total() > 0 ? number_format($propiedades->total()) . ' propiedades disponibles' : 'Catálogo de propiedades' }}
        </h1>
    </div>
</div>

<div class="max-w-[1400px] mx-auto px-6 py-8">
    <div class="flex gap-6 lg:flex-row flex-col">

        {{-- === SIDEBAR FILTROS === --}}
        <aside class="lg:w-[280px] shrink-0">
            <form action="{{ route('catalogo') }}" method="GET"
                  class="rounded-2xl p-5 sticky top-20" style="background:white;border:1px solid rgba(27,43,94,0.08);box-shadow:0 4px 20px rgba(27,43,94,0.06)">

                <div class="flex items-center justify-between mb-5">
                    <h2 class="font-semibold" style="color:#1B2B5E;font-size:15px">Filtros</h2>
                    @if(request()->hasAny(['q','listing_type','type','city','price_min','price_max','bedrooms','area_min']))
                    <a href="{{ route('catalogo') }}" class="text-xs font-medium hover:underline" style="color:#E06B6B">Limpiar todo</a>
                    @endif
                </div>

                {{-- Búsqueda --}}
                <div class="mb-4">
                    <label class="block text-xs font-semibold uppercase mb-2" style="color:#8A92B2;letter-spacing:.05em">Búsqueda</label>
                    <div class="flex items-center gap-2 rounded-xl px-3 py-2.5" style="background:#F8F9FF;border:1.5px solid rgba(27,43,94,0.1)">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="color:#8A92B2;shrink:0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                        <input type="text" name="q" value="{{ request('q') }}"
                               class="bg-transparent outline-none text-sm flex-1" style="color:#1B2B5E"
                               placeholder="Ciudad, colonia…">
                    </div>
                </div>

                {{-- Tipo operación --}}
                <div class="mb-4">
                    <label class="block text-xs font-semibold uppercase mb-2" style="color:#8A92B2;letter-spacing:.05em">Operación</label>
                    <div class="flex gap-2">
                        @foreach([''=>'Todos','sale'=>'Venta','rent'=>'Renta'] as $val => $lbl)
                        <button type="submit" name="listing_type" value="{{ $val }}"
                                class="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                                style="{{ request('listing_type') === $val || (request('listing_type') === null && $val === '') ? 'background:linear-gradient(135deg,#1B2B5E,#4A5FA8);color:white' : 'background:#F0F2F8;color:#6B7280' }}">
                            {{ $lbl }}
                        </button>
                        @endforeach
                    </div>
                </div>

                {{-- Tipo propiedad --}}
                <div class="mb-4">
                    <label class="block text-xs font-semibold uppercase mb-2" style="color:#8A92B2;letter-spacing:.05em">Tipo</label>
                    <select name="type" class="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                            style="background:#F8F9FF;border:1.5px solid rgba(27,43,94,0.1);color:#1B2B5E">
                        <option value="">Todos los tipos</option>
                        @foreach(['house'=>'Casa','apartment'=>'Departamento','land'=>'Terreno','studio'=>'Estudio','commercial'=>'Local comercial','office'=>'Oficina'] as $val => $lbl)
                        <option value="{{ $val }}" {{ request('type') === $val ? 'selected' : '' }}>{{ $lbl }}</option>
                        @endforeach
                    </select>
                </div>

                {{-- Ciudad --}}
                <div class="mb-4">
                    <label class="block text-xs font-semibold uppercase mb-2" style="color:#8A92B2;letter-spacing:.05em">Ciudad</label>
                    <select name="city" class="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
                            style="background:#F8F9FF;border:1.5px solid rgba(27,43,94,0.1);color:#1B2B5E">
                        <option value="">Todas las ciudades</option>
                        @foreach($ciudades as $c)
                        <option value="{{ $c->city }}" {{ request('city') === $c->city ? 'selected' : '' }}>{{ $c->city }}</option>
                        @endforeach
                    </select>
                </div>

                {{-- Precio --}}
                <div class="mb-4">
                    <label class="block text-xs font-semibold uppercase mb-2" style="color:#8A92B2;letter-spacing:.05em">Precio (MXN)</label>
                    <div class="flex gap-2">
                        <input type="number" name="price_min" value="{{ request('price_min') }}"
                               class="w-full rounded-xl px-3 py-2.5 text-sm outline-none" min="0"
                               style="background:#F8F9FF;border:1.5px solid rgba(27,43,94,0.1);color:#1B2B5E"
                               placeholder="Mín">
                        <input type="number" name="price_max" value="{{ request('price_max') }}"
                               class="w-full rounded-xl px-3 py-2.5 text-sm outline-none" min="0"
                               style="background:#F8F9FF;border:1.5px solid rgba(27,43,94,0.1);color:#1B2B5E"
                               placeholder="Máx">
                    </div>
                </div>

                {{-- Habitaciones --}}
                <div class="mb-4">
                    <label class="block text-xs font-semibold uppercase mb-2" style="color:#8A92B2;letter-spacing:.05em">Habitaciones (mín)</label>
                    <div class="flex gap-2">
                        @foreach([0,1,2,3,4] as $n)
                        <button type="submit" name="bedrooms" value="{{ $n }}"
                                class="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                                style="{{ (string)request('bedrooms') === (string)$n ? 'background:#1B2B5E;color:white' : 'background:#F0F2F8;color:#6B7280' }}">
                            {{ $n === 4 ? '4+' : $n }}
                        </button>
                        @endforeach
                    </div>
                </div>

                {{-- Área mínima --}}
                <div class="mb-5">
                    <label class="block text-xs font-semibold uppercase mb-2" style="color:#8A92B2;letter-spacing:.05em">Área mínima (m²)</label>
                    <input type="number" name="area_min" value="{{ request('area_min') }}"
                           class="w-full rounded-xl px-3 py-2.5 text-sm outline-none" min="0"
                           style="background:#F8F9FF;border:1.5px solid rgba(27,43,94,0.1);color:#1B2B5E"
                           placeholder="Ej: 80">
                </div>

                <button type="submit"
                        class="w-full py-3 rounded-xl font-semibold text-sm text-white hover:opacity-90 transition"
                        style="background:linear-gradient(135deg,#1B2B5E,#4A5FA8)">
                    Aplicar filtros
                </button>
            </form>
        </aside>

        {{-- === RESULTADOS === --}}
        <div class="flex-1 min-w-0">

            {{-- Toolbar --}}
            <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
                <p class="text-sm" style="color:#8A92B2">
                    <span class="font-semibold" style="color:#1B2B5E">{{ number_format($propiedades->total()) }}</span> propiedades
                </p>
                <div class="flex items-center gap-2">
                    <label class="text-xs font-medium" style="color:#8A92B2">Ordenar:</label>
                    <form action="{{ route('catalogo') }}" method="GET" id="sortForm">
                        @foreach(request()->except('sort') as $key => $val)
                        <input type="hidden" name="{{ $key }}" value="{{ $val }}">
                        @endforeach
                        <select name="sort" onchange="document.getElementById('sortForm').submit()"
                                class="rounded-xl px-3 py-2 text-sm outline-none font-medium"
                                style="background:white;border:1.5px solid rgba(27,43,94,0.12);color:#1B2B5E">
                            @foreach(['newest'=>'Más recientes','price_asc'=>'Precio: menor','price_desc'=>'Precio: mayor','area_asc'=>'Área: menor','area_desc'=>'Área: mayor'] as $val => $lbl)
                            <option value="{{ $val }}" {{ request('sort', 'newest') === $val ? 'selected' : '' }}>{{ $lbl }}</option>
                            @endforeach
                        </select>
                    </form>
                </div>
            </div>

            {{-- Grid --}}
            @if($propiedades->count())
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
                @foreach($propiedades as $property)
                    @include('partials.property-card', ['property' => $property])
                @endforeach
            </div>

            {{-- Pagination --}}
            @if($propiedades->hasPages())
            <div class="flex items-center justify-center gap-2">
                @if($propiedades->onFirstPage())
                <span class="px-4 py-2 rounded-xl text-sm font-medium" style="background:#F0F2F8;color:#B0B8D0;cursor:not-allowed">← Anterior</span>
                @else
                <a href="{{ $propiedades->previousPageUrl() }}"
                   class="px-4 py-2 rounded-xl text-sm font-medium hover:shadow-md transition"
                   style="background:white;border:1.5px solid rgba(27,43,94,0.12);color:#1B2B5E">← Anterior</a>
                @endif

                <span class="px-5 py-2 rounded-xl text-sm font-semibold text-white"
                      style="background:linear-gradient(135deg,#1B2B5E,#4A5FA8)">
                    {{ $propiedades->currentPage() }} / {{ $propiedades->lastPage() }}
                </span>

                @if($propiedades->hasMorePages())
                <a href="{{ $propiedades->nextPageUrl() }}"
                   class="px-4 py-2 rounded-xl text-sm font-medium hover:shadow-md transition"
                   style="background:white;border:1.5px solid rgba(27,43,94,0.12);color:#1B2B5E">Siguiente →</a>
                @else
                <span class="px-4 py-2 rounded-xl text-sm font-medium" style="background:#F0F2F8;color:#B0B8D0;cursor:not-allowed">Siguiente →</span>
                @endif
            </div>
            @endif

            @else
            <div class="text-center py-24">
                <div class="text-5xl mb-4">🔍</div>
                <h3 class="font-semibold mb-2" style="color:#1B2B5E;font-size:20px">Sin resultados</h3>
                <p class="mb-6" style="color:#8A92B2;font-size:14px">No encontramos propiedades con esos filtros.</p>
                <a href="{{ route('catalogo') }}" class="px-6 py-3 rounded-xl text-sm font-semibold text-white"
                   style="background:linear-gradient(135deg,#1B2B5E,#4A5FA8)">Ver todas</a>
            </div>
            @endif
        </div>
    </div>
</div>

@endsection
