@extends('layouts.dashboard')
@section('title', 'Mis propiedades')
@section('page-title', 'Mis propiedades')

@section('content')

{{-- Top bar --}}
<div class="flex items-center justify-between mb-6 flex-wrap gap-3">
    <form action="{{ route('panel.propiedades.index') }}" method="GET" class="flex gap-2">
        <div class="flex items-center gap-2 px-3 py-2.5 rounded-xl" style="background:white;border:1.5px solid rgba(27,43,94,0.12)">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="color:#8A92B2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" name="q" value="{{ request('q') }}" placeholder="Buscar propiedad…"
                   class="bg-transparent outline-none text-sm" style="color:#1B2B5E;width:180px">
        </div>
        <select name="status" onchange="this.form.submit()"
                class="px-3 py-2.5 rounded-xl text-sm outline-none"
                style="background:white;border:1.5px solid rgba(27,43,94,0.12);color:#1B2B5E">
            <option value="">Todos</option>
            <option value="active"  {{ request('status') === 'active'  ? 'selected' : '' }}>Activas</option>
            <option value="closed"  {{ request('status') === 'closed'  ? 'selected' : '' }}>Cerradas</option>
            <option value="pending" {{ request('status') === 'pending' ? 'selected' : '' }}>Pendientes</option>
        </select>
    </form>
    <a href="{{ route('panel.propiedades.crear') }}"
       class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition"
       style="background:linear-gradient(135deg,#1B2B5E,#4A5FA8)">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
        Nueva propiedad
    </a>
</div>

{{-- Table --}}
<div class="rounded-2xl overflow-hidden" style="background:white;border:1px solid rgba(27,43,94,0.08);box-shadow:0 4px 20px rgba(27,43,94,0.05)">
    @if($propiedades->count())
    <div class="overflow-x-auto">
        <table class="w-full text-sm">
            <thead>
                <tr style="background:#F8F9FF;border-bottom:1px solid rgba(27,43,94,0.07)">
                    <th class="text-left px-5 py-3.5 font-semibold" style="color:#8A92B2;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Propiedad</th>
                    <th class="text-left px-4 py-3.5 font-semibold hidden md:table-cell" style="color:#8A92B2;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Ciudad</th>
                    <th class="text-left px-4 py-3.5 font-semibold hidden md:table-cell" style="color:#8A92B2;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Precio</th>
                    <th class="text-left px-4 py-3.5 font-semibold hidden lg:table-cell" style="color:#8A92B2;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Vistas</th>
                    <th class="text-left px-4 py-3.5 font-semibold" style="color:#8A92B2;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Estado</th>
                    <th class="px-4 py-3.5"></th>
                </tr>
            </thead>
            <tbody class="divide-y divide-[rgba(27,43,94,0.05)]">
                @foreach($propiedades as $p)
                @php
                $img = ($p->images->firstWhere('is_main', true) ?? $p->images->first())?->url
                       ?? 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&q=60';
                @endphp
                <tr class="hover:bg-[rgba(27,43,94,0.01)] transition">
                    <td class="px-5 py-4">
                        <div class="flex items-center gap-3">
                            <img src="{{ $img }}" alt="{{ $p->title }}" class="w-12 h-10 rounded-xl object-cover shrink-0">
                            <div class="min-w-0">
                                <p class="font-medium truncate max-w-[200px]" style="color:#1B2B5E">{{ $p->title }}</p>
                                <p class="text-xs" style="color:#8A92B2">{{ $p->type }} · {{ $p->listing_type === 'sale' ? 'Venta' : 'Renta' }}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-4 py-4 hidden md:table-cell text-sm" style="color:#5A6280">{{ $p->city }}</td>
                    <td class="px-4 py-4 hidden md:table-cell font-semibold" style="color:#C9A96E">${{ number_format($p->price) }}</td>
                    <td class="px-4 py-4 hidden lg:table-cell text-sm" style="color:#8A92B2">{{ number_format($p->views_count ?? 0) }}</td>
                    <td class="px-4 py-4">
                        <span class="px-2.5 py-1 rounded-full text-xs font-semibold"
                              style="background:{{ $p->status === 'active' ? '#DCFCE7' : ($p->status === 'pending' ? '#FEF9C3' : '#F3F4F6') }};color:{{ $p->status === 'active' ? '#15803D' : ($p->status === 'pending' ? '#854D0E' : '#6B7280') }}">
                            {{ $p->status === 'active' ? 'Activa' : ($p->status === 'pending' ? 'Pendiente' : 'Cerrada') }}
                        </span>
                    </td>
                    <td class="px-4 py-4">
                        <div class="flex items-center gap-1 justify-end">
                            <a href="{{ route('propiedad.show', $p->id) }}" target="_blank"
                               class="p-2 rounded-lg hover:bg-[rgba(27,43,94,0.06)] transition" title="Ver pública" style="color:#8A92B2">
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            </a>
                            <a href="{{ route('panel.propiedades.editar', $p->id) }}"
                               class="p-2 rounded-lg hover:bg-[rgba(27,43,94,0.06)] transition" title="Editar" style="color:#4A5FA8">
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </a>
                            @if($p->status === 'active')
                            <button onclick="document.getElementById('close-{{ $p->id }}').showModal()"
                                    class="p-2 rounded-lg hover:bg-[rgba(220,80,80,0.08)] transition" title="Cerrar" style="color:#E06B6B">
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                            </button>
                            @endif
                            <form action="{{ route('panel.propiedades.destroy', $p->id) }}" method="POST"
                                  onsubmit="return confirm('¿Eliminar esta propiedad permanentemente?')">
                                @csrf @method('DELETE')
                                <button type="submit" class="p-2 rounded-lg hover:bg-[rgba(220,80,80,0.08)] transition" title="Eliminar" style="color:#E06B6B">
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                                </button>
                            </form>
                        </div>
                    </td>
                </tr>

                {{-- Close modal --}}
                @if($p->status === 'active')
                <dialog id="close-{{ $p->id }}" class="rounded-2xl p-0 shadow-2xl border-0 max-w-md w-full" style="background:white">
                    <form action="{{ route('panel.propiedades.cerrar', $p->id) }}" method="POST" class="p-6">
                        @csrf @method('PATCH')
                        <h3 class="font-bold mb-1" style="color:#1B2B5E;font-size:18px">Cerrar propiedad</h3>
                        <p class="text-sm mb-4" style="color:#8A92B2">Indica el motivo del cierre.</p>
                        <textarea name="reason" rows="3" required
                                  class="w-full rounded-xl px-3 py-3 text-sm outline-none mb-4"
                                  style="background:#F8F9FF;border:1.5px solid rgba(27,43,94,0.12);color:#1B2B5E"
                                  placeholder="Ej: Propiedad vendida, ya no disponible…"></textarea>
                        <div class="flex gap-3">
                            <button type="button" onclick="this.closest('dialog').close()"
                                    class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition"
                                    style="background:#F0F2F8;color:#6B7280">Cancelar</button>
                            <button type="submit" class="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                                    style="background:#E06B6B">Cerrar propiedad</button>
                        </div>
                    </form>
                </dialog>
                @endif
                @endforeach
            </tbody>
        </table>
    </div>

    {{-- Pagination --}}
    @if($propiedades->hasPages())
    <div class="flex items-center justify-center gap-2 p-4" style="border-top:1px solid rgba(27,43,94,0.06)">
        @if($propiedades->onFirstPage())
        <span class="px-4 py-2 rounded-xl text-sm font-medium" style="background:#F0F2F8;color:#B0B8D0;cursor:not-allowed">← Ant</span>
        @else
        <a href="{{ $propiedades->previousPageUrl() }}" class="px-4 py-2 rounded-xl text-sm font-medium transition hover:shadow" style="background:white;border:1.5px solid rgba(27,43,94,0.12);color:#1B2B5E">← Ant</a>
        @endif
        <span class="px-4 py-2 rounded-xl text-sm font-semibold text-white" style="background:#1B2B5E">{{ $propiedades->currentPage() }} / {{ $propiedades->lastPage() }}</span>
        @if($propiedades->hasMorePages())
        <a href="{{ $propiedades->nextPageUrl() }}" class="px-4 py-2 rounded-xl text-sm font-medium transition hover:shadow" style="background:white;border:1.5px solid rgba(27,43,94,0.12);color:#1B2B5E">Sig →</a>
        @else
        <span class="px-4 py-2 rounded-xl text-sm font-medium" style="background:#F0F2F8;color:#B0B8D0;cursor:not-allowed">Sig →</span>
        @endif
    </div>
    @endif

    @else
    <div class="text-center py-16">
        <div class="text-4xl mb-3">🏠</div>
        <h3 class="font-semibold mb-1" style="color:#1B2B5E;font-size:18px">Sin propiedades</h3>
        <p class="text-sm mb-5" style="color:#8A92B2">Publica tu primera propiedad en minutos.</p>
        <a href="{{ route('panel.propiedades.crear') }}"
           class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
           style="background:linear-gradient(135deg,#1B2B5E,#4A5FA8)">
            + Publicar propiedad
        </a>
    </div>
    @endif
</div>

@endsection
