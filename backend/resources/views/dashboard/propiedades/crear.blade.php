@extends('layouts.dashboard')
@section('title', 'Publicar propiedad')
@section('page-title', 'Publicar propiedad')

@section('content')
<div class="max-w-3xl">
    <form action="{{ route('panel.propiedades.store') }}" method="POST" enctype="multipart/form-data" class="space-y-6">
        @csrf

        {{-- Básico --}}
        <div class="rounded-2xl p-6" style="background:white;border:1px solid rgba(27,43,94,0.08)">
            <h2 class="font-semibold mb-5" style="color:#1B2B5E;font-size:16px">Información básica</h2>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1.5" style="color:#374151">Título de la propiedad *</label>
                    <input type="text" name="title" value="{{ old('title') }}"
                           class="w-full rounded-xl px-4 py-3 text-sm outline-none"
                           style="background:#F8F9FF;border:1.5px solid rgba(27,43,94,0.12);color:#1B2B5E"
                           placeholder="Ej: Casa moderna en Polanco con jardín" required minlength="10">
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-1.5" style="color:#374151">Tipo de propiedad *</label>
                        <select name="type" class="w-full rounded-xl px-4 py-3 text-sm outline-none" style="background:#F8F9FF;border:1.5px solid rgba(27,43,94,0.12);color:#1B2B5E" required>
                            <option value="">Selecciona tipo</option>
                            @foreach(['house'=>'Casa','apartment'=>'Departamento','land'=>'Terreno','studio'=>'Estudio','commercial'=>'Local comercial','office'=>'Oficina'] as $v => $l)
                            <option value="{{ $v }}" {{ old('type') === $v ? 'selected' : '' }}>{{ $l }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1.5" style="color:#374151">Operación *</label>
                        <select name="listing_type" class="w-full rounded-xl px-4 py-3 text-sm outline-none" style="background:#F8F9FF;border:1.5px solid rgba(27,43,94,0.12);color:#1B2B5E" required>
                            <option value="">Selecciona</option>
                            <option value="sale" {{ old('listing_type') === 'sale' ? 'selected' : '' }}>Venta</option>
                            <option value="rent" {{ old('listing_type') === 'rent' ? 'selected' : '' }}>Renta</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium mb-1.5" style="color:#374151">Descripción</label>
                    <textarea name="description" rows="4"
                              class="w-full rounded-xl px-4 py-3 text-sm outline-none resize-y"
                              style="background:#F8F9FF;border:1.5px solid rgba(27,43,94,0.12);color:#1B2B5E"
                              placeholder="Describe los detalles, características únicas, entorno…">{{ old('description') }}</textarea>
                </div>
            </div>
        </div>

        {{-- Ubicación --}}
        <div class="rounded-2xl p-6" style="background:white;border:1px solid rgba(27,43,94,0.08)">
            <h2 class="font-semibold mb-5" style="color:#1B2B5E;font-size:16px">Ubicación</h2>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1.5" style="color:#374151">Dirección / Colonia *</label>
                    <input type="text" name="location" value="{{ old('location') }}"
                           class="w-full rounded-xl px-4 py-3 text-sm outline-none"
                           style="background:#F8F9FF;border:1.5px solid rgba(27,43,94,0.12);color:#1B2B5E"
                           placeholder="Av. Presidente Masaryk 123, Polanco" required minlength="5">
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium mb-1.5" style="color:#374151">Ciudad *</label>
                        <input type="text" name="city" value="{{ old('city') }}"
                               class="w-full rounded-xl px-4 py-3 text-sm outline-none"
                               style="background:#F8F9FF;border:1.5px solid rgba(27,43,94,0.12);color:#1B2B5E"
                               placeholder="Ciudad de México" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1.5" style="color:#374151">Estado</label>
                        <input type="text" name="state" value="{{ old('state') }}"
                               class="w-full rounded-xl px-4 py-3 text-sm outline-none"
                               style="background:#F8F9FF;border:1.5px solid rgba(27,43,94,0.12);color:#1B2B5E"
                               placeholder="CDMX">
                    </div>
                </div>
            </div>
        </div>

        {{-- Precio + Características --}}
        <div class="rounded-2xl p-6" style="background:white;border:1px solid rgba(27,43,94,0.08)">
            <h2 class="font-semibold mb-5" style="color:#1B2B5E;font-size:16px">Precio y características</h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                <div class="col-span-2 sm:col-span-1">
                    <label class="block text-sm font-medium mb-1.5" style="color:#374151">Precio (MXN) *</label>
                    <input type="number" name="price" value="{{ old('price') }}" min="1"
                           class="w-full rounded-xl px-4 py-3 text-sm outline-none"
                           style="background:#F8F9FF;border:1.5px solid rgba(27,43,94,0.12);color:#1B2B5E"
                           placeholder="0" required>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1.5" style="color:#374151">Área (m²) *</label>
                    <input type="number" name="area" value="{{ old('area') }}" min="1"
                           class="w-full rounded-xl px-4 py-3 text-sm outline-none"
                           style="background:#F8F9FF;border:1.5px solid rgba(27,43,94,0.12);color:#1B2B5E"
                           placeholder="120" required>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1.5" style="color:#374151">Año de construcción</label>
                    <input type="number" name="year_built" value="{{ old('year_built') }}" min="1900" max="{{ date('Y') }}"
                           class="w-full rounded-xl px-4 py-3 text-sm outline-none"
                           style="background:#F8F9FF;border:1.5px solid rgba(27,43,94,0.12);color:#1B2B5E"
                           placeholder="{{ date('Y') }}">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1.5" style="color:#374151">Habitaciones</label>
                    <input type="number" name="bedrooms" value="{{ old('bedrooms') }}" min="0"
                           class="w-full rounded-xl px-4 py-3 text-sm outline-none"
                           style="background:#F8F9FF;border:1.5px solid rgba(27,43,94,0.12);color:#1B2B5E"
                           placeholder="3">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1.5" style="color:#374151">Baños</label>
                    <input type="number" name="bathrooms" value="{{ old('bathrooms') }}" min="0"
                           class="w-full rounded-xl px-4 py-3 text-sm outline-none"
                           style="background:#F8F9FF;border:1.5px solid rgba(27,43,94,0.12);color:#1B2B5E"
                           placeholder="2">
                </div>
            </div>
        </div>

        {{-- Amenidades --}}
        <div class="rounded-2xl p-6" style="background:white;border:1px solid rgba(27,43,94,0.08)">
            <h2 class="font-semibold mb-5" style="color:#1B2B5E;font-size:16px">Amenidades</h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                @foreach([
                    ['has_water',      '💧', 'Agua'],
                    ['has_electricity','⚡', 'Electricidad'],
                    ['has_drainage',   '🚿', 'Drenaje'],
                    ['has_garage',     '🚗', 'Garage'],
                    ['has_garden',     '🌿', 'Jardín'],
                    ['has_pool',       '🏊', 'Alberca'],
                    ['has_security',   '🔒', 'Seguridad'],
                    ['has_gym',        '💪', 'Gimnasio'],
                    ['has_elevator',   '🛗', 'Elevador'],
                ] as [$field, $icon, $label])
                <label class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition hover:bg-[rgba(27,43,94,0.04)]"
                       style="border:1.5px solid rgba(27,43,94,0.1)">
                    <input type="checkbox" name="{{ $field }}" value="1" class="rounded"
                           style="accent-color:#1B2B5E;width:16px;height:16px"
                           {{ old($field) ? 'checked' : '' }}>
                    <span class="text-base">{{ $icon }}</span>
                    <span class="text-sm font-medium" style="color:#3A4570">{{ $label }}</span>
                </label>
                @endforeach
            </div>
        </div>

        {{-- Imágenes --}}
        <div class="rounded-2xl p-6" style="background:white;border:1px solid rgba(27,43,94,0.08)">
            <h2 class="font-semibold mb-2" style="color:#1B2B5E;font-size:16px">Imágenes</h2>
            <p class="text-sm mb-4" style="color:#8A92B2">Sube hasta 20 fotos. La primera imagen será la principal. Formatos: JPG, PNG, WEBP (máx. 5 MB cada una).</p>

            <label for="imagenesInput"
                   class="flex flex-col items-center justify-center w-full rounded-xl cursor-pointer transition hover:opacity-90"
                   style="border:2px dashed rgba(27,43,94,0.2);background:#F8F9FF;padding:32px 16px">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" style="color:#B0B8D0;margin-bottom:10px">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                </svg>
                <p class="text-sm font-semibold" style="color:#1B2B5E">Haz clic para seleccionar fotos</p>
                <p class="text-xs mt-1" style="color:#8A92B2">o arrastra y suelta aquí</p>
                <input id="imagenesInput" type="file" name="images[]" multiple accept="image/jpeg,image/png,image/webp" class="hidden"
                       onchange="previsualizarImagenes(this)">
            </label>

            <div id="previewGrid" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4"></div>
        </div>

        {{-- Actions --}}
        <div class="flex items-center gap-3">
            <button type="submit"
                    class="px-8 py-3 rounded-xl font-semibold text-sm text-white hover:opacity-90 transition hover:shadow-lg"
                    style="background:linear-gradient(135deg,#C9A96E,#B8924A)">
                Publicar propiedad
            </button>
            <a href="{{ route('panel.propiedades.index') }}"
               class="px-6 py-3 rounded-xl text-sm font-semibold transition hover:bg-[rgba(27,43,94,0.06)]"
               style="color:#6B7280;border:1.5px solid rgba(27,43,94,0.12)">
                Cancelar
            </a>
        </div>
    </form>
</div>
@endsection

@push('scripts')
<script>
function previsualizarImagenes(input) {
    const grid = document.getElementById('previewGrid');
    grid.innerHTML = '';
    Array.from(input.files).slice(0, 20).forEach((file, i) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const div = document.createElement('div');
            div.className = 'relative rounded-xl overflow-hidden';
            div.style.cssText = 'aspect-ratio:1;border:2px solid rgba(27,43,94,0.1)';
            div.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover">
                ${i === 0 ? '<div class="absolute bottom-0 left-0 right-0 text-center text-white text-[10px] font-bold py-1" style="background:rgba(201,169,110,0.9)">PRINCIPAL</div>' : ''}`;
            grid.appendChild(div);
        };
        reader.readAsDataURL(file);
    });
}
</script>
@endpush
