@extends('layouts.dashboard')

@section('title', 'Admin — Propiedades')
@section('page-title', 'Todas las Propiedades')

@section('content')
<div class="space-y-6">

    <div class="flex items-center justify-between">
        <div>
            <h2 class="text-xl font-bold" style="color:#1B2B5E">Propiedades del sistema</h2>
            <p class="text-sm mt-1" style="color:#8A92B2">Activas y cerradas de todos los propietarios.</p>
        </div>
        <a href="{{ route('admin.users') }}"
           class="px-4 py-2 rounded-xl text-sm font-medium text-white"
           style="background:linear-gradient(135deg,#1B2B5E,#4A5FA8)">
            Ver usuarios
        </a>
    </div>

    <div class="rounded-2xl overflow-hidden"
         style="background:white;border:1px solid rgba(27,43,94,0.08);box-shadow:0 2px 12px rgba(27,43,94,0.06)">
        <table class="w-full text-sm">
            <thead>
                <tr style="background:rgba(27,43,94,0.04);border-bottom:1px solid rgba(27,43,94,0.08)">
                    <th class="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style="color:#8A92B2">Propiedad</th>
                    <th class="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style="color:#8A92B2">Propietario</th>
                    <th class="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style="color:#8A92B2">Precio</th>
                    <th class="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style="color:#8A92B2">Estado</th>
                    <th class="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style="color:#8A92B2">Acciones</th>
                </tr>
            </thead>
            <tbody>
                @foreach($properties as $property)
                <tr class="border-b hover:bg-[rgba(27,43,94,0.02)] transition-colors"
                    id="row-{{ $property->id }}"
                    style="border-color:rgba(27,43,94,0.06)">
                    <td class="px-6 py-4">
                        <p class="font-medium" style="color:#1B2B5E">{{ $property->title }}</p>
                        <p class="text-xs mt-0.5" style="color:#8A92B2">{{ $property->city }} · {{ $property->type }}</p>
                    </td>
                    <td class="px-6 py-4" style="color:#5A6280">
                        {{ $property->owner?->nombre }} {{ $property->owner?->apellido }}
                    </td>
                    <td class="px-6 py-4 font-medium" style="color:#1B2B5E">
                        ${{ number_format($property->price, 0, '.', ',') }}
                    </td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                            style="
                                background:{{ $property->status === 'active' ? 'rgba(42,122,78,0.1)' : 'rgba(138,146,178,0.1)' }};
                                color:{{ $property->status === 'active' ? '#2A7A4E' : '#8A92B2' }}
                            ">
                            {{ $property->status === 'active' ? 'Activa' : 'Cerrada' }}
                        </span>
                        @if($property->close_reason)
                            <p class="text-xs mt-1" style="color:#8A92B2">{{ $property->close_reason }}</p>
                        @endif
                    </td>
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-2">
                            @if($property->status === 'active')
                            <button onclick="toggleCloseForm({{ $property->id }})"
                                    class="px-3 py-1.5 rounded-xl text-xs font-medium transition"
                                    style="background:rgba(201,169,110,0.12);color:#8A6230">
                                Cerrar
                            </button>
                            @endif
                            <form method="POST"
                                  action="{{ route('admin.properties.delete', $property) }}"
                                  onsubmit="return confirm('¿Eliminar permanentemente esta propiedad?')">
                                @csrf
                                @method('DELETE')
                                <button type="submit"
                                        class="px-3 py-1.5 rounded-xl text-xs font-medium transition"
                                        style="background:rgba(220,80,80,0.1);color:#DC4040">
                                    Eliminar
                                </button>
                            </form>
                        </div>
                    </td>
                </tr>

                {{-- Fila de formulario de cierre --}}
                @if($property->status === 'active')
                <tr id="close-form-{{ $property->id }}" class="hidden border-b"
                    style="border-color:rgba(27,43,94,0.06);background:rgba(201,169,110,0.04)">
                    <td colspan="5" class="px-6 py-3">
                        <form method="POST"
                              action="{{ route('admin.properties.close', $property) }}"
                              class="flex items-center gap-3">
                            @csrf
                            @method('PATCH')
                            <input type="text" name="reason"
                                   placeholder="Motivo del cierre (requerido)" required
                                   class="flex-1 text-sm rounded-xl border px-3 py-2 focus:outline-none focus:ring-2"
                                   style="border-color:rgba(27,43,94,0.2);color:#1B2B5E">
                            <button type="submit"
                                    class="px-4 py-2 rounded-xl text-xs font-medium text-white"
                                    style="background:linear-gradient(135deg,#C9A96E,#B8924A)">
                                Confirmar
                            </button>
                            <button type="button"
                                    onclick="toggleCloseForm({{ $property->id }})"
                                    class="px-3 py-2 rounded-xl text-xs font-medium"
                                    style="color:#8A92B2;background:rgba(27,43,94,0.06)">
                                Cancelar
                            </button>
                        </form>
                    </td>
                </tr>
                @endif
                @endforeach
            </tbody>
        </table>
        @if($properties->isEmpty())
            <p class="text-center py-12 text-sm" style="color:#8A92B2">No hay propiedades en el sistema.</p>
        @endif
    </div>

</div>

@push('scripts')
<script>
function toggleCloseForm(id) {
    var row = document.getElementById('close-form-' + id);
    if (row) row.classList.toggle('hidden');
}
</script>
@endpush
@endsection
