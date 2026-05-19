@extends('layouts.app')
@section('title', $propiedad->title)

@section('content')
@php
$typeLabels = ['house'=>'Casa','apartment'=>'Departamento','land'=>'Terreno','studio'=>'Estudio','commercial'=>'Local','office'=>'Oficina'];
$images = $propiedad->images->sortByDesc('is_main')->values();
$mainImg = $images->firstWhere('is_main', true) ?? $images->first();
$mainImgUrl = $mainImg?->url ?? 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=80';
@endphp

{{-- Breadcrumb --}}
<div class="max-w-[1400px] mx-auto px-6 pt-6">
    <nav class="flex items-center gap-2 text-sm" style="color:#8A92B2">
        <a href="{{ route('inicio') }}" class="hover:text-[#1B2B5E] transition">Inicio</a>
        <span>/</span>
        <a href="{{ route('catalogo') }}" class="hover:text-[#1B2B5E] transition">Catálogo</a>
        <span>/</span>
        <span style="color:#1B2B5E" class="truncate max-w-[220px]">{{ $propiedad->title }}</span>
    </nav>
</div>

<div class="max-w-[1400px] mx-auto px-6 py-8">
    <div class="flex gap-8 lg:flex-row flex-col">

        {{-- LEFT: Galería + Detalles --}}
        <div class="flex-1 min-w-0">

            {{-- Hero Image --}}
            <div class="relative rounded-2xl overflow-hidden mb-4" style="height:440px">
                <img id="mainImg" src="{{ $mainImgUrl }}" alt="{{ $propiedad->title }}"
                     class="w-full h-full object-cover">
                <div class="absolute top-4 left-4 flex gap-2">
                    <span class="px-3 py-1.5 rounded-xl text-sm font-semibold"
                          style="background:{{ $propiedad->listing_type === 'sale' ? 'rgba(27,43,94,0.9)' : 'rgba(42,122,78,0.9)' }};color:white;backdrop-filter:blur(4px)">
                        {{ $propiedad->listing_type === 'sale' ? 'En Venta' : 'En Renta' }}
                    </span>
                    @if(isset($typeLabels[$propiedad->type]))
                    <span class="px-3 py-1.5 rounded-xl text-sm font-semibold"
                          style="background:rgba(0,0,0,0.5);color:white;backdrop-filter:blur(4px)">
                        {{ $typeLabels[$propiedad->type] }}
                    </span>
                    @endif
                </div>
                @if($propiedad->views_count)
                <div class="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
                     style="background:rgba(0,0,0,0.5);color:rgba(255,255,255,0.9);backdrop-filter:blur(4px)">
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    {{ number_format($propiedad->views_count) }} vistas
                </div>
                @endif
            </div>

            {{-- Thumbnails --}}
            @if($images->count() > 1)
            <div class="flex gap-2 mb-4 overflow-x-auto pb-1">
                @foreach($images as $img)
                <button onclick="swapMainImage('{{ $img->url }}')"
                        class="shrink-0 rounded-xl overflow-hidden hover:opacity-100 transition-opacity"
                        style="width:80px;height:60px;opacity:{{ $img->is_main ? '1' : '.65' }}">
                    <img src="{{ $img->url }}" alt="" class="w-full h-full object-cover">
                </button>
                @endforeach
            </div>
            @endif

            {{-- AI Button --}}
            @if($propiedad->type !== 'land')
            <div class="flex items-center gap-3 mb-6">
                @auth
                <button id="btnIA" onclick="amueblarConIA()"
                        class="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold shadow-md transition hover:opacity-90 disabled:opacity-60"
                        style="background:rgba(255,255,255,0.92);color:#1B2B5E;border:1.5px solid rgba(27,43,94,0.15)">
                    ✨ Amueblar con IA
                </button>
                @else
                <a href="{{ route('login') }}"
                   class="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold shadow-md transition hover:opacity-90"
                   style="background:rgba(255,255,255,0.92);color:#1B2B5E;border:1.5px solid rgba(27,43,94,0.15)">
                    ✨ Amueblar con IA
                </a>
                @endauth
            </div>
            @endif

            {{-- AI Modal --}}
            <div id="iaModal" class="fixed inset-0 z-[100] hidden items-center justify-center p-4"
                 style="background:rgba(0,0,0,0.75);backdrop-filter:blur(4px)"
                 onclick="cerrarModalIA()">
                <div class="relative w-full rounded-2xl overflow-hidden shadow-2xl"
                     id="iaModalInner"
                     style="background:white;max-width:1100px;max-height:90vh"
                     onclick="event.stopPropagation()">
                    <div class="flex items-center justify-between px-6 py-4"
                         style="background:linear-gradient(135deg,#111829,#1B2B5E);border-bottom:1px solid rgba(255,255,255,0.1)">
                        <div class="flex items-center gap-3">
                            <span class="text-xl">✨</span>
                            <div>
                                <h3 class="font-semibold text-white text-base">Amueblar con IA</h3>
                                <p class="text-xs" style="color:rgba(255,255,255,0.5)">Powered by Stable Diffusion · instruct-pix2pix</p>
                            </div>
                        </div>
                        <button onclick="cerrarModalIA()" class="flex items-center justify-center w-8 h-8 rounded-lg transition hover:bg-white/10" style="color:rgba(255,255,255,0.6)">
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                    <div class="p-6 overflow-y-auto" style="max-height:calc(90vh - 70px)">
                        <div id="iaLoading" class="flex-col items-center justify-center py-16 gap-5" style="display:none">
                            <div class="relative w-16 h-16 mx-auto mb-4">
                                <div class="absolute inset-0 rounded-full animate-spin" style="border:3px solid rgba(201,169,110,0.2);border-top-color:#C9A96E"></div>
                                <div class="absolute inset-2 rounded-full flex items-center justify-center text-2xl">🏠</div>
                            </div>
                            <p class="font-semibold text-center mb-1" style="color:#1B2B5E">Generando con IA…</p>
                            <p class="text-sm text-center" style="color:#8A92B2">El modelo está amueblando el espacio. Puede tardar entre 30 y 90 segundos.</p>
                            <div class="flex gap-1 justify-center mt-4">
                                <div class="w-2 h-2 rounded-full animate-bounce" style="background:#C9A96E;animation-delay:0s"></div>
                                <div class="w-2 h-2 rounded-full animate-bounce" style="background:#C9A96E;animation-delay:.15s"></div>
                                <div class="w-2 h-2 rounded-full animate-bounce" style="background:#C9A96E;animation-delay:.3s"></div>
                            </div>
                        </div>
                        <div id="iaError" style="display:none" class="text-center py-12">
                            <div class="text-4xl mb-4">⚠️</div>
                            <p class="font-semibold mb-2" style="color:#1B2B5E">No se pudo generar la imagen</p>
                            <p id="iaErrorMsg" class="text-sm mb-6 max-w-sm mx-auto" style="color:#8A92B2"></p>
                            <button id="iaRetryBtn" onclick="amueblarConIA()"
                                    class="px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition"
                                    style="background:linear-gradient(135deg,#1B2B5E,#4A5FA8)">Reintentar</button>
                        </div>
                        <div id="iaResult" style="display:none">
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-2" style="background:rgba(27,43,94,0.08)">
                                        <span class="w-2 h-2 rounded-full" style="background:#8A92B2"></span>
                                        <span class="text-xs font-semibold" style="color:#5A6280">ORIGINAL</span>
                                    </div>
                                    <div class="rounded-xl overflow-hidden" style="border:2px solid rgba(27,43,94,0.1)">
                                        <img id="iaOriginalImg" src="" alt="Original" class="w-full object-cover" style="max-height:400px">
                                    </div>
                                </div>
                                <div>
                                    <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-2" style="background:rgba(201,169,110,0.15)">
                                        <span class="w-2 h-2 rounded-full" style="background:#C9A96E"></span>
                                        <span class="text-xs font-semibold" style="color:#B8924A">✨ AMUEBLADO CON IA</span>
                                    </div>
                                    <div class="rounded-xl overflow-hidden" style="border:2px solid rgba(201,169,110,0.4);box-shadow:0 4px 20px rgba(201,169,110,0.15)">
                                        <img id="iaGeneratedImg" src="" alt="Amueblado con IA" class="w-full object-cover" style="max-height:400px">
                                    </div>
                                </div>
                            </div>
                            <p class="text-xs text-center" style="color:#B0B8D0">Generado con Hugging Face · instruct-pix2pix · Solo para visualización</p>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Title + Price --}}
            <div class="mb-5">
                <h1 class="font-bold mb-1" style="color:#1B2B5E;font-size:22px;line-height:1.3">{{ $propiedad->title }}</h1>
                <p class="font-bold mb-1" style="color:#C9A96E;font-size:28px">
                    ${{ number_format($propiedad->price) }}
                    @if($propiedad->listing_type === 'rent')<span class="text-base font-medium" style="color:#8A92B2">/mes</span>@endif
                </p>
                <p class="text-sm flex items-center gap-1" style="color:#8A92B2">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/><circle cx="12" cy="11" r="3"/></svg>
                    {{ $propiedad->location }}, {{ $propiedad->city }}@if($propiedad->state), {{ $propiedad->state }}@endif
                </p>
            </div>

            {{-- Specs strip --}}
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                @if($propiedad->area)
                <div class="rounded-2xl p-4 text-center" style="background:white;border:1px solid rgba(27,43,94,0.08)">
                    <p class="font-bold" style="color:#1B2B5E;font-size:18px">{{ number_format($propiedad->area) }} m²</p>
                    <p class="text-xs" style="color:#8A92B2">Área total</p>
                </div>
                @endif
                @if($propiedad->bedrooms !== null)
                <div class="rounded-2xl p-4 text-center" style="background:white;border:1px solid rgba(27,43,94,0.08)">
                    <p class="font-bold" style="color:#1B2B5E;font-size:18px">{{ $propiedad->bedrooms }}</p>
                    <p class="text-xs" style="color:#8A92B2">Habitaciones</p>
                </div>
                @endif
                @if($propiedad->bathrooms !== null)
                <div class="rounded-2xl p-4 text-center" style="background:white;border:1px solid rgba(27,43,94,0.08)">
                    <p class="font-bold" style="color:#1B2B5E;font-size:18px">{{ $propiedad->bathrooms }}</p>
                    <p class="text-xs" style="color:#8A92B2">Baños</p>
                </div>
                @endif
                @if($propiedad->year_built)
                <div class="rounded-2xl p-4 text-center" style="background:white;border:1px solid rgba(27,43,94,0.08)">
                    <p class="font-bold" style="color:#1B2B5E;font-size:18px">{{ $propiedad->year_built }}</p>
                    <p class="text-xs" style="color:#8A92B2">Año</p>
                </div>
                @endif
            </div>

            {{-- Description --}}
            @if($propiedad->description)
            <div class="rounded-2xl p-6 mb-6" style="background:white;border:1px solid rgba(27,43,94,0.08)">
                <h2 class="font-semibold mb-3" style="color:#1B2B5E;font-size:17px">Descripción</h2>
                <p class="text-sm leading-relaxed whitespace-pre-line" style="color:#5A6280">{{ $propiedad->description }}</p>
            </div>
            @endif

            {{-- Amenidades --}}
            @php
            $amenidades = [
                ['has_garage',     '🚗', 'Garage'],
                ['has_garden',     '🌿', 'Jardín'],
                ['has_pool',       '🏊', 'Alberca'],
                ['has_gym',        '💪', 'Gimnasio'],
                ['has_security',   '🔒', 'Seguridad'],
                ['has_elevator',   '🛗', 'Elevador'],
                ['has_water',      '💧', 'Agua'],
                ['has_electricity','⚡', 'Electricidad'],
                ['has_drainage',   '🚿', 'Drenaje'],
            ];
            $activeAmenidades = array_filter($amenidades, fn($a) => $propiedad->{$a[0]});
            @endphp
            @if(count($activeAmenidades))
            <div class="rounded-2xl p-6 mb-6" style="background:white;border:1px solid rgba(27,43,94,0.08)">
                <h2 class="font-semibold mb-4" style="color:#1B2B5E;font-size:17px">Amenidades</h2>
                <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    @foreach($activeAmenidades as [$field,$icon,$label])
                    <div class="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center" style="background:#F8F9FF;border:1px solid rgba(27,43,94,0.07)">
                        <span class="text-xl">{{ $icon }}</span>
                        <span class="text-xs font-medium" style="color:#5A6280">{{ $label }}</span>
                    </div>
                    @endforeach
                </div>
            </div>
            @endif
        </div>

        {{-- RIGHT: Precio + Contacto --}}
        <aside class="lg:w-[360px] shrink-0">
            <div class="sticky top-20 space-y-4">

                {{-- Price card --}}
                <div class="rounded-2xl p-6" style="background:white;border:1px solid rgba(27,43,94,0.08);box-shadow:0 8px 32px rgba(27,43,94,0.08)">
                    <div class="py-4 mb-4" style="border-bottom:1px solid rgba(27,43,94,0.06)">
                        <p class="font-bold" style="color:#C9A96E;font-size:30px;letter-spacing:-.5px">
                            ${{ number_format($propiedad->price) }}
                        </p>
                        @if($propiedad->listing_type === 'rent')
                        <p class="text-sm" style="color:#8A92B2">por mes</p>
                        @endif
                    </div>

                    {{-- Owner --}}
                    <div class="flex items-center gap-3 mb-5">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white shrink-0 text-sm"
                             style="background:linear-gradient(135deg,#1B2B5E,#4A5FA8)">
                            {{ strtoupper(substr($propiedad->owner->nombre, 0, 1)) }}
                        </div>
                        <div>
                            <p class="text-sm font-semibold" style="color:#1B2B5E">{{ $propiedad->owner->nombre }} {{ $propiedad->owner->apellido }}</p>
                            <p class="text-xs" style="color:#8A92B2">Publicante</p>
                        </div>
                    </div>

                    {{-- Contact form --}}
                    @auth
                        @if($conversacionId)
                            <a href="{{ route('panel.chat.conversacion', $conversacionId) }}"
                               class="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white hover:opacity-90 transition"
                               style="background:linear-gradient(135deg,#1B2B5E,#4A5FA8)">
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                                Ver conversación
                            </a>
                        @elseif($propiedad->user_id !== auth()->id())
                            <form action="{{ route('panel.chat.iniciar') }}" method="POST" class="space-y-3">
                                @csrf
                                <input type="hidden" name="property_id" value="{{ $propiedad->id }}">
                                <textarea name="initial_message" rows="3"
                                          class="w-full rounded-xl px-3 py-3 text-sm outline-none resize-none"
                                          style="background:#F8F9FF;border:1.5px solid rgba(27,43,94,0.1);color:#1B2B5E"
                                          placeholder="Hola, me interesa esta propiedad…" required></textarea>
                                <button type="submit"
                                        class="w-full py-3 rounded-xl font-semibold text-sm text-white hover:opacity-90 transition"
                                        style="background:linear-gradient(135deg,#C9A96E,#B8924A)">
                                    Contactar al publicante
                                </button>
                            </form>
                        @else
                            <p class="text-sm text-center" style="color:#8A92B2">Esta es tu propiedad.</p>
                        @endif
                    @else
                        <a href="{{ route('login') }}"
                           class="flex items-center justify-center w-full py-3 rounded-xl font-semibold text-sm text-white hover:opacity-90 transition"
                           style="background:linear-gradient(135deg,#C9A96E,#B8924A)">
                            Inicia sesión para contactar
                        </a>
                    @endauth
                </div>

                {{-- Share --}}
                <div class="rounded-2xl p-4 text-center" style="background:white;border:1px solid rgba(27,43,94,0.08)">
                    <p class="text-xs mb-2" style="color:#8A92B2">Publicado {{ $propiedad->created_at->diffForHumans() }}</p>
                </div>
            </div>
        </aside>
    </div>

    {{-- Similar properties --}}
    @if($similares->count())
    <div class="mt-12">
        <h2 class="font-bold mb-6" style="color:#1B2B5E;font-size:24px;letter-spacing:-.5px">Propiedades similares</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            @foreach($similares as $property)
                @include('partials.property-card', ['property' => $property])
            @endforeach
        </div>
    </div>
    @endif
</div>

@endsection

@push('scripts')
<script>
let iaCurrentImageUrl = '{{ $mainImgUrl }}';

function swapMainImage(url) {
    document.getElementById('mainImg').src = url;
    iaCurrentImageUrl = url;
}

function amueblarConIA() {
    const modal = document.getElementById('iaModal');
    modal.style.display = 'flex';
    document.getElementById('iaLoading').style.display = 'block';
    document.getElementById('iaError').style.display = 'none';
    document.getElementById('iaResult').style.display = 'none';

    const csrf = document.querySelector('meta[name="csrf-token"]')?.content ?? '';
    fetch('/panel/ai/furnish', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': csrf,
        },
        body: JSON.stringify({ image_url: iaCurrentImageUrl }),
    })
    .then(async (res) => {
        const data = await res.json();
        document.getElementById('iaLoading').style.display = 'none';
        if (!res.ok) {
            document.getElementById('iaErrorMsg').textContent = data.message || 'Error al generar la imagen.';
            document.getElementById('iaRetryBtn').style.display = (data.retry === false) ? 'none' : 'inline-flex';
            document.getElementById('iaError').style.display = 'block';
        } else {
            document.getElementById('iaOriginalImg').src = data.original;
            document.getElementById('iaGeneratedImg').src = data.generated;
            document.getElementById('iaResult').style.display = 'block';
        }
    })
    .catch(() => {
        document.getElementById('iaLoading').style.display = 'none';
        document.getElementById('iaErrorMsg').textContent = 'Error de conexión. Verifica tu conexión e inténtalo de nuevo.';
        document.getElementById('iaError').style.display = 'block';
    });
}

function cerrarModalIA() {
    document.getElementById('iaModal').style.display = 'none';
}
</script>
@endpush
