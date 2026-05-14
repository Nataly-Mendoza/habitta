@extends('layouts.app')
@section('title', 'Inicio')

@section('content')

{{-- HERO --}}
<section class="relative min-h-[88vh] flex items-center overflow-hidden">
    <div class="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80"
             alt="Hero" class="w-full h-full object-cover">
        <div class="absolute inset-0" style="background:linear-gradient(135deg,rgba(17,24,41,.82) 0%,rgba(27,43,94,.65) 50%,rgba(17,24,41,.4) 100%)"></div>
        <div class="absolute" style="background:rgba(201,169,110,0.15);width:600px;height:600px;border-radius:50%;top:-100px;right:-100px;filter:blur(80px)"></div>
    </div>

    <div class="relative max-w-[1400px] mx-auto px-6 w-full py-20">
        <div class="max-w-3xl">
            <div class="inline-flex items-center gap-2 mb-6">
                <span class="px-4 py-1.5 rounded-full font-semibold text-[13px]" style="background:rgba(201,169,110,0.25);border:1px solid rgba(201,169,110,0.4);color:#C9A96E;backdrop-filter:blur(10px)">
                    ✦ Plataforma inmobiliaria premium en México
                </span>
            </div>
            <h1 class="mb-5 font-bold leading-none" style="color:white;font-size:clamp(36px,5vw,68px);letter-spacing:-1px;line-height:1.1">
                Encuentra tu propiedad <span style="color:#C9A96E">ideal</span>
            </h1>
            <p class="mb-10" style="color:rgba(255,255,255,0.7);font-size:18px;line-height:1.7;max-width:500px">
                {{ $totalPropiedades > 0 ? $totalPropiedades.'+' : 'Miles de' }} propiedades premium en las mejores ciudades de México
            </p>
            <div class="flex items-center gap-8 mb-10">
                @foreach([['valor'=>$totalPropiedades > 0 ? $totalPropiedades.'+' : '12K+','etiqueta'=>'Propiedades'],['valor'=>'8,500+','etiqueta'=>'Clientes felices'],['valor'=>'98%','etiqueta'=>'Satisfacción']] as $stat)
                <div>
                    <p class="font-bold" style="color:#C9A96E;font-size:24px">{{ $stat['valor'] }}</p>
                    <p style="color:rgba(255,255,255,0.55);font-size:13px">{{ $stat['etiqueta'] }}</p>
                </div>
                @endforeach
            </div>
        </div>

        {{-- Buscador --}}
        <form action="{{ route('catalogo') }}" method="GET"
              class="flex flex-wrap items-center gap-3 p-4 max-w-[700px]"
              style="background:rgba(255,255,255,0.97);backdrop-filter:blur(20px);border-radius:24px;box-shadow:0 32px 80px rgba(0,0,0,0.25)">
            <div class="flex-1 flex items-center gap-3 rounded-xl px-4 py-3 min-w-[200px]" style="background:#F0F2F8">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="color:#8A92B2;flex-shrink:0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input type="text" name="q" placeholder="Ciudad, colonia, tipo de propiedad..."
                       class="bg-transparent outline-none text-sm w-full" style="color:#1B2B5E"
                       placeholder-style="color:#B0B8D0">
            </div>
            <button type="submit" class="px-6 py-3 rounded-xl font-semibold text-sm text-white whitespace-nowrap hover:opacity-90 transition"
                    style="background:linear-gradient(135deg,#1B2B5E,#4A5FA8)">Buscar</button>
            <a href="{{ route('catalogo') }}?listing_type=sale" class="px-4 py-3 rounded-xl font-semibold text-sm whitespace-nowrap hover:opacity-80 transition"
               style="color:#1B2B5E;border:1.5px solid rgba(27,43,94,0.2)">Venta</a>
            <a href="{{ route('catalogo') }}?listing_type=rent" class="px-4 py-3 rounded-xl font-semibold text-sm whitespace-nowrap hover:opacity-80 transition"
               style="color:#2A7A4E;border:1.5px solid rgba(42,122,78,0.2)">Renta</a>
        </form>
    </div>
</section>

{{-- Tipos --}}
<section class="py-12" style="background:#F8F4EE">
    <div class="max-w-[1400px] mx-auto px-6">
        <div class="flex items-center justify-center gap-3 flex-wrap">
            @foreach([['🏠 Casas','house'],['🏢 Departamentos','apartment'],['🌿 Terrenos','land'],['🏙 Estudios','studio'],['🏪 Locales','commercial'],['🏛 Oficinas','office']] as [$label,$type])
            <a href="{{ route('catalogo') }}?type={{ $type }}" class="flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-all hover:shadow-md hover:-translate-y-0.5"
               style="background:white;border:1.5px solid rgba(27,43,94,0.09);border-radius:100px;color:#3A4570;box-shadow:0 2px 8px rgba(27,43,94,0.05)">
                {{ $label }}
            </a>
            @endforeach
        </div>
    </div>
</section>

{{-- Propiedades destacadas --}}
<section class="pb-16" style="background:#F8F4EE">
    <div class="max-w-[1400px] mx-auto px-6">
        <div class="flex items-end justify-between mb-8">
            <div>
                <p class="uppercase font-semibold mb-2" style="color:#C9A96E;font-size:13px;letter-spacing:0.1em">✦ Selección curada</p>
                <h2 class="font-bold" style="color:#1B2B5E;font-size:32px;letter-spacing:-.5px">Propiedades destacadas</h2>
            </div>
            <a href="{{ route('catalogo') }}" class="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-[14px] transition-all hover:bg-[rgba(74,95,168,0.06)]"
               style="color:#4A5FA8;border:1.5px solid rgba(74,95,168,0.2)">
                Ver todas
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
            </a>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @forelse($destacadas as $p)
                @include('partials.property-card', ['property' => $p])
            @empty
                <p class="text-gray-400 col-span-3 text-center py-12">No hay propiedades aún.</p>
            @endforelse
        </div>
    </div>
</section>

{{-- Por qué Habitta --}}
<section class="py-20" style="background:linear-gradient(135deg,#F0EDE6,#E8E4DA)">
    <div class="max-w-[1400px] mx-auto px-6">
        <div class="text-center mb-14">
            <p class="uppercase font-semibold mb-3" style="color:#C9A96E;font-size:13px;letter-spacing:0.1em">✦ ¿Por qué elegirnos?</p>
            <h2 class="font-bold mb-4" style="color:#1B2B5E;font-size:36px;letter-spacing:-.5px">La diferencia Habitta</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            @foreach([
                ['⭐','Calidad premium','Cada propiedad es verificada y curada bajo nuestros altos estándares.','#C9A96E'],
                ['📈','Análisis de mercado','Datos en tiempo real para ayudarte a tomar mejores decisiones.','#4A5FA8'],
                ['🔒','Transacciones seguras','Agentes verificados que garantizan operaciones transparentes.','#2A7A4E'],
                ['🎧','Soporte experto','Expertos inmobiliarios disponibles 7 días a la semana.','#9B5FA8'],
            ] as [$icon,$title,$desc,$color])
            <div class="p-6 hover:shadow-lg transition-all hover:-translate-y-1" style="background:white;border-radius:22px;border:1px solid rgba(27,43,94,0.06);box-shadow:0 4px 20px rgba(27,43,94,0.05)">
                <div class="text-3xl mb-5">{{ $icon }}</div>
                <h3 class="font-semibold mb-2" style="color:#1B2B5E;font-size:17px">{{ $title }}</h3>
                <p style="color:#8A92B2;font-size:14px;line-height:1.6">{{ $desc }}</p>
            </div>
            @endforeach
        </div>
    </div>
</section>

{{-- Ciudades --}}
@if($ciudades->count())
<section class="py-20" style="background:#F8F4EE">
    <div class="max-w-[1400px] mx-auto px-6">
        <div class="mb-10">
            <p class="uppercase font-semibold mb-2" style="color:#C9A96E;font-size:13px;letter-spacing:0.1em">✦ Explorar por ciudad</p>
            <h2 class="font-bold" style="color:#1B2B5E;font-size:32px;letter-spacing:-.5px">Destinos populares</h2>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            @php
            $cityImages = [
                'Ciudad de México' => 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&q=80',
                'Monterrey'        => 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80',
                'Guadalajara'      => 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80',
                'Cancún'           => 'https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=800&q=80',
                'Querétaro'        => 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
                'Mérida'           => 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
            ];
            $defaultImg = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80';
            @endphp
            @foreach($ciudades as $ciudad)
            <a href="{{ route('catalogo') }}?city={{ urlencode($ciudad->city) }}"
               class="relative overflow-hidden group" style="border-radius:20px;height:160px;display:block">
                <img src="{{ $cityImages[$ciudad->city] ?? $defaultImg }}" alt="{{ $ciudad->city }}"
                     class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                <div class="absolute inset-0" style="background:linear-gradient(to top,rgba(17,24,41,.8) 0%,rgba(17,24,41,.1) 100%)"></div>
                <div class="absolute bottom-3 left-3 text-left">
                    <p class="font-semibold text-white" style="font-size:15px">{{ $ciudad->city }}</p>
                    <p style="color:rgba(255,255,255,0.65);font-size:12px">{{ $ciudad->total }} propiedades</p>
                </div>
            </a>
            @endforeach
        </div>
    </div>
</section>
@endif

{{-- CTA --}}
<section class="py-20">
    <div class="max-w-[1400px] mx-auto px-6">
        <div class="relative overflow-hidden p-12 md:p-16 text-center" style="background:linear-gradient(135deg,#111829,#1B2B5E);border-radius:28px">
            <div class="absolute" style="background:rgba(201,169,110,0.15);width:500px;height:500px;border-radius:50%;top:-150px;right:-100px;filter:blur(80px)"></div>
            <div class="relative">
                <p class="uppercase font-semibold mb-4" style="color:#C9A96E;font-size:13px;letter-spacing:0.1em">✦ Publica tu propiedad</p>
                <h2 class="font-bold mb-4 text-white" style="font-size:clamp(28px,4vw,48px);letter-spacing:-.5px">¿Listo para vender o rentar?</h2>
                <p class="mb-8 mx-auto" style="color:rgba(255,255,255,0.6);font-size:16px;max-width:480px">
                    Publica tu propiedad en Habitta y conecta con miles de compradores y arrendatarios calificados.
                </p>
                <div class="flex items-center justify-center gap-4 flex-wrap">
                    <a href="{{ auth()->check() ? route('panel.propiedades.crear') : route('registro') }}"
                       class="flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-base text-white hover:opacity-90 transition"
                       style="background:linear-gradient(135deg,#C9A96E,#B8924A)">
                        Publicar propiedad →
                    </a>
                    <a href="{{ route('catalogo') }}" class="px-8 py-4 rounded-2xl font-semibold text-base text-white transition hover:bg-white/15"
                       style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2)">
                        Explorar catálogo
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>

@endsection
