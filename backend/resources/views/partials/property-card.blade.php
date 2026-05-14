@php
$mainImage = $property->images->firstWhere('is_main', true) ?? $property->images->first();
$imgUrl    = $mainImage?->url ?? 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80';

$typeLabels = [
    'house'      => 'Casa',
    'apartment'  => 'Departamento',
    'land'       => 'Terreno',
    'studio'     => 'Estudio',
    'commercial' => 'Local',
    'office'     => 'Oficina',
];

$priceFormatted = '$' . number_format($property->price, 0, '.', ',');
if ($property->price >= 1_000_000) {
    $priceFormatted = '$' . number_format($property->price / 1_000_000, 1, '.', ',') . 'M';
} elseif ($property->price >= 1_000) {
    $priceFormatted = '$' . number_format($property->price / 1_000, 0, '.', ',') . 'K';
}

$esFavorito = auth()->check() && in_array($property->id, $favoritedIds ?? []);
@endphp

<article class="group relative flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
         style="background:white;border-radius:20px;border:1px solid rgba(27,43,94,0.07);box-shadow:0 4px 20px rgba(27,43,94,0.06)">

    {{-- Image --}}
    <a href="{{ route('propiedad.show', $property->id) }}" class="block relative overflow-hidden" style="height:220px">
        <img src="{{ $imgUrl }}" alt="{{ $property->title }}"
             class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">

        {{-- Badges --}}
        <div class="absolute top-3 left-3 flex gap-2">
            <span class="px-2.5 py-1 rounded-lg text-xs font-semibold"
                  style="background:{{ $property->listing_type === 'sale' ? 'rgba(27,43,94,0.9)' : 'rgba(42,122,78,0.9)' }};color:white;backdrop-filter:blur(4px)">
                {{ $property->listing_type === 'sale' ? 'Venta' : 'Renta' }}
            </span>
            @if(isset($typeLabels[$property->type]))
            <span class="px-2.5 py-1 rounded-lg text-xs font-semibold"
                  style="background:rgba(0,0,0,0.5);color:rgba(255,255,255,0.9);backdrop-filter:blur(4px)">
                {{ $typeLabels[$property->type] }}
            </span>
            @endif
        </div>

        {{-- Favorite button --}}
        @auth
        <button data-prop="{{ $property->id }}" data-active="{{ $esFavorito ? '1' : '0' }}"
                onclick="toggleFavoriteCard(event, this)"
                class="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                style="background:rgba(255,255,255,0.92);backdrop-filter:blur(8px)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="{{ $esFavorito ? '#E06B6B' : 'none' }}"
                 stroke="{{ $esFavorito ? '#E06B6B' : '#9CA3AF' }}" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
        </button>
        @endauth
    </a>

    {{-- Body --}}
    <div class="flex flex-col flex-1 p-5">
        <div class="flex items-start justify-between gap-2 mb-1">
            <a href="{{ route('propiedad.show', $property->id) }}"
               class="font-semibold line-clamp-2 hover:text-[#4A5FA8] transition-colors"
               style="color:#1B2B5E;font-size:15px;line-height:1.4">
                {{ $property->title }}
            </a>
        </div>

        <p class="text-xs mb-3 flex items-center gap-1" style="color:#8A92B2">
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/><circle cx="12" cy="11" r="3"/></svg>
            {{ $property->city }}@if($property->state), {{ $property->state }}@endif
        </p>

        {{-- Specs --}}
        <div class="flex items-center gap-3 mb-4 text-xs" style="color:#6B7280">
            @if($property->bedrooms !== null)
            <span class="flex items-center gap-1">
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M3 12V7a4 4 0 014-4h10a4 4 0 014 4v5M3 12h18M3 12v5M21 12v5M3 17h18"/></svg>
                {{ $property->bedrooms }} hab
            </span>
            @endif
            @if($property->bathrooms !== null)
            <span class="flex items-center gap-1">
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M4 12h16M4 12a2 2 0 00-2 2v4h20v-4a2 2 0 00-2-2M4 12V6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v4"/></svg>
                {{ $property->bathrooms }} baños
            </span>
            @endif
            <span class="flex items-center gap-1">
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
                {{ number_format($property->area) }} m²
            </span>
        </div>

        <div class="mt-auto flex items-center justify-between pt-3" style="border-top:1px solid rgba(27,43,94,0.07)">
            <div>
                <p class="font-bold" style="color:#C9A96E;font-size:18px">{{ $priceFormatted }}</p>
                @if($property->listing_type === 'rent')
                <p class="text-xs" style="color:#8A92B2">/mes</p>
                @endif
            </div>
            <a href="{{ route('propiedad.show', $property->id) }}"
               class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:shadow-md"
               style="background:linear-gradient(135deg,#1B2B5E,#4A5FA8);color:white">
                Ver más
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
            </a>
        </div>
    </div>
</article>
