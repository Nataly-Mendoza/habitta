@extends('layouts.dashboard')
@section('title', 'Mensajes')
@section('page-title', 'Mensajes')

@section('content')
<div class="max-w-3xl">
    @if($conversaciones->count())
    <div class="space-y-3">
        @foreach($conversaciones as $conv)
        @php
        $userId  = auth()->id();
        $other   = $conv->inquirer_id === $userId ? $conv->owner : $conv->inquirer;
        $unread  = $conv->messages->where('sender_id', '!=', $userId)->whereNull('read_at')->count();
        $lastMsg = $conv->lastMessage;
        $img     = ($conv->property?->images->firstWhere('is_main', true) ?? $conv->property?->images->first())?->path
                   ?? 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&q=60';
        @endphp
        <a href="{{ route('panel.chat.conversacion', $conv->id) }}"
           class="flex items-center gap-4 p-4 rounded-2xl transition-all hover:shadow-md hover:-translate-y-0.5 {{ $unread ? 'ring-2 ring-[rgba(201,169,110,0.4)]' : '' }}"
           style="background:white;border:1px solid rgba(27,43,94,0.08);box-shadow:0 2px 12px rgba(27,43,94,0.05)">

            {{-- Property thumb --}}
            <img src="{{ $img }}" alt="{{ $conv->property?->title }}"
                 class="w-14 h-14 rounded-xl object-cover shrink-0">

            {{-- Content --}}
            <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-0.5">
                    <p class="text-sm font-semibold truncate" style="color:#1B2B5E">
                        {{ $other?->nombre }} {{ $other?->apellido }}
                    </p>
                    <span class="text-xs shrink-0 ml-2" style="color:#8A92B2">
                        {{ $lastMsg?->created_at->diffForHumans() ?? '' }}
                    </span>
                </div>
                <p class="text-xs truncate mb-1" style="color:#8A92B2">
                    {{ $conv->property?->title }}
                </p>
                <p class="text-sm truncate" style="color:{{ $unread ? '#1B2B5E' : '#8A92B2' }};font-weight:{{ $unread ? '500' : '400' }}">
                    {{ $lastMsg?->content ?? 'Sin mensajes aún' }}
                </p>
            </div>

            {{-- Unread badge --}}
            @if($unread)
            <span class="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style="background:#C9A96E">{{ $unread }}</span>
            @endif
        </a>
        @endforeach
    </div>
    @else
    <div class="rounded-2xl p-12 text-center" style="background:white;border:1px solid rgba(27,43,94,0.08)">
        <div class="text-4xl mb-3">💬</div>
        <h3 class="font-semibold mb-1" style="color:#1B2B5E;font-size:18px">Sin mensajes</h3>
        <p class="text-sm mb-6" style="color:#8A92B2">Cuando contactes o te contacten sobre una propiedad, verás los mensajes aquí.</p>
        <a href="{{ route('catalogo') }}"
           class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
           style="background:linear-gradient(135deg,#1B2B5E,#4A5FA8)">
            Explorar propiedades
        </a>
    </div>
    @endif
</div>
@endsection
