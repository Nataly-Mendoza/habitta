@extends('layouts.dashboard')
@section('title', 'Panel')
@section('page-title', 'Panel de control')

@section('content')

{{-- Stats --}}
<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
    @foreach([
        ['Propiedades activas', $stats['activas'],    'M3 9.5L12 3l9 6.5V21H3V9.5z', '#1B2B5E', '#E8EEFF'],
        ['Total de vistas',    $stats['vistas'],      'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 110 6 3 3 0 010-6z', '#2A7A4E', '#E6F5EE'],
        ['Mensajes sin leer',  $stats['noLeidos'],    'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z', '#4A5FA8', '#EEF1FF'],
        ['Consultas totales',  $stats['consultas'],   'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z', '#C9A96E', '#FDF5E7'],
    ] as [$label, $value, $icon, $color, $bg])
    <div class="rounded-2xl p-5" style="background:white;border:1px solid rgba(27,43,94,0.07);box-shadow:0 2px 12px rgba(27,43,94,0.05)">
        <div class="flex items-center justify-between mb-4">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:{{ $bg }}">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="{{ $color }}" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="{{ $icon }}"/>
                </svg>
            </div>
        </div>
        <p class="font-bold text-2xl mb-1" style="color:#1B2B5E">{{ number_format($value) }}</p>
        <p class="text-sm" style="color:#8A92B2">{{ $label }}</p>
    </div>
    @endforeach
</div>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

    {{-- Recent properties --}}
    <div class="lg:col-span-2 rounded-2xl p-5" style="background:white;border:1px solid rgba(27,43,94,0.07)">
        <div class="flex items-center justify-between mb-5">
            <h2 class="font-semibold" style="color:#1B2B5E;font-size:16px">Propiedades recientes</h2>
            <a href="{{ route('panel.propiedades.index') }}" class="text-xs font-semibold hover:underline" style="color:#4A5FA8">Ver todas →</a>
        </div>

        @forelse($recientes as $p)
        @php
        $img = ($p->images->firstWhere('is_main', true) ?? $p->images->first())?->path
               ?? 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=60';
        @endphp
        <div class="flex items-center gap-3 py-3" style="border-bottom:1px solid rgba(27,43,94,0.05)">
            <img src="{{ $img }}" alt="{{ $p->title }}" class="w-12 h-12 rounded-xl object-cover shrink-0">
            <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate" style="color:#1B2B5E">{{ $p->title }}</p>
                <p class="text-xs" style="color:#8A92B2">{{ $p->city }} · {{ $p->created_at->diffForHumans() }}</p>
            </div>
            <div class="text-right shrink-0">
                <p class="text-sm font-bold" style="color:#C9A96E">${{ number_format($p->price) }}</p>
                <span class="text-xs px-2 py-0.5 rounded-full" style="background:{{ $p->status === 'active' ? '#DCFCE7' : '#F3F4F6' }};color:{{ $p->status === 'active' ? '#15803D' : '#6B7280' }}">
                    {{ $p->status === 'active' ? 'Activa' : 'Cerrada' }}
                </span>
            </div>
        </div>
        @empty
        <p class="text-sm text-center py-8" style="color:#8A92B2">Sin propiedades aún.</p>
        @endforelse

        @if(!$recientes->count())
        <div class="text-center pt-4">
            <a href="{{ route('panel.propiedades.crear') }}"
               class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
               style="background:linear-gradient(135deg,#1B2B5E,#4A5FA8)">
                + Publicar mi primera propiedad
            </a>
        </div>
        @endif
    </div>

    {{-- Quick actions --}}
    <div class="space-y-4">
        <div class="rounded-2xl p-5" style="background:white;border:1px solid rgba(27,43,94,0.07)">
            <h2 class="font-semibold mb-4" style="color:#1B2B5E;font-size:16px">Acciones rápidas</h2>
            <div class="space-y-2">
                <a href="{{ route('panel.propiedades.crear') }}"
                   class="flex items-center gap-3 p-3 rounded-xl transition hover:shadow-md text-sm font-medium text-white"
                   style="background:linear-gradient(135deg,#1B2B5E,#4A5FA8)">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                    Publicar propiedad
                </a>
                <a href="{{ route('panel.chat.index') }}"
                   class="flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition hover:bg-[rgba(27,43,94,0.04)]"
                   style="color:#1B2B5E;border:1.5px solid rgba(27,43,94,0.1)">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                    Ver mensajes
                    @if($stats['noLeidos'] > 0)
                    <span class="ml-auto text-xs px-2 py-0.5 rounded-full text-white font-bold" style="background:#E74C3C">{{ $stats['noLeidos'] }}</span>
                    @endif
                </a>
                <a href="{{ route('catalogo') }}"
                   class="flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition hover:bg-[rgba(27,43,94,0.04)]"
                   style="color:#1B2B5E;border:1.5px solid rgba(27,43,94,0.1)">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                    Explorar catálogo
                </a>
            </div>
        </div>

        {{-- Top viewed --}}
        @if($topVistas->count())
        <div class="rounded-2xl p-5" style="background:white;border:1px solid rgba(27,43,94,0.07)">
            <h2 class="font-semibold mb-4" style="color:#1B2B5E;font-size:16px">Más visitadas</h2>
            @foreach($topVistas as $p)
            <div class="flex items-center justify-between py-2" style="border-bottom:1px solid rgba(27,43,94,0.04)">
                <p class="text-sm truncate mr-2" style="color:#3A4570;max-width:160px">{{ $p->title }}</p>
                <span class="text-xs font-semibold shrink-0" style="color:#4A5FA8">{{ number_format($p->views_count) }} vistas</span>
            </div>
            @endforeach
        </div>
        @endif
    </div>
</div>

@endsection
