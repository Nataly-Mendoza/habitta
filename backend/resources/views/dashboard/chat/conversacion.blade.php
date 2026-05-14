@extends('layouts.dashboard')
@section('title', 'Conversación')
@section('page-title', 'Mensajes')

@section('content')
@php
$userId = auth()->id();
$other  = $conversation->inquirer_id === $userId ? $conversation->owner : $conversation->inquirer;
$img    = ($conversation->property?->images->firstWhere('is_main', true) ?? $conversation->property?->images->first())?->url
          ?? 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=60';
@endphp

<div class="max-w-3xl flex flex-col" style="height:calc(100vh - 112px)">

    {{-- Header --}}
    <div class="flex items-center gap-4 rounded-2xl p-4 mb-4" style="background:white;border:1px solid rgba(27,43,94,0.08)">
        <a href="{{ route('panel.chat.index') }}" class="p-2 rounded-xl hover:bg-[rgba(27,43,94,0.06)] transition" style="color:#5A6280">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        </a>
        <img src="{{ $img }}" alt="{{ $conversation->property?->title }}" class="w-12 h-12 rounded-xl object-cover shrink-0">
        <div class="flex-1 min-w-0">
            <p class="font-semibold text-sm" style="color:#1B2B5E">{{ $other?->nombre }} {{ $other?->apellido }}</p>
            <a href="{{ route('propiedad.show', $conversation->property_id) }}"
               class="text-xs hover:underline truncate block" style="color:#8A92B2">
                {{ $conversation->property?->title }}
            </a>
        </div>
        <a href="{{ route('propiedad.show', $conversation->property_id) }}"
           class="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition hover:shadow"
           style="background:#F8F9FF;border:1.5px solid rgba(27,43,94,0.1);color:#4A5FA8">
            Ver propiedad →
        </a>
    </div>

    {{-- Messages --}}
    <div id="messages" class="flex-1 overflow-y-auto space-y-3 mb-4 px-1">
        @forelse($mensajes as $msg)
        @php $isMe = $msg->sender_id === $userId; @endphp
        <div class="flex {{ $isMe ? 'justify-end' : 'justify-start' }}">
            <div class="max-w-[75%]">
                @if(!$isMe)
                <p class="text-xs mb-1 ml-1" style="color:#8A92B2">{{ $msg->sender?->nombre }}</p>
                @endif
                <div class="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                     style="background:{{ $isMe ? 'linear-gradient(135deg,#1B2B5E,#4A5FA8)' : 'white' }};color:{{ $isMe ? 'white' : '#1B2B5E' }};border:{{ $isMe ? 'none' : '1px solid rgba(27,43,94,0.08)' }};box-shadow:0 2px 8px rgba(27,43,94,0.07);border-radius:{{ $isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px' }}">
                    {{ $msg->content }}
                </div>
                <p class="text-xs mt-1 {{ $isMe ? 'text-right mr-1' : 'ml-1' }}" style="color:#B0B8D0">
                    {{ $msg->created_at->format('H:i') }}
                    @if($isMe && $msg->read_at) · leído @endif
                </p>
            </div>
        </div>
        @empty
        <div class="text-center py-12 text-sm" style="color:#8A92B2">Sin mensajes aún. ¡Inicia la conversación!</div>
        @endforelse
    </div>

    {{-- Compose --}}
    <form action="{{ route('panel.chat.enviar', $conversation->id) }}" method="POST"
          class="flex items-end gap-3 p-4 rounded-2xl" style="background:white;border:1px solid rgba(27,43,94,0.08)">
        @csrf
        <textarea name="content" rows="1" required maxlength="1000"
                  class="flex-1 rounded-xl px-4 py-3 text-sm outline-none resize-none"
                  style="background:#F8F9FF;border:1.5px solid rgba(27,43,94,0.12);color:#1B2B5E"
                  placeholder="Escribe un mensaje…"
                  onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();this.form.submit()}"></textarea>
        <button type="submit"
                class="flex items-center justify-center w-11 h-11 rounded-xl text-white hover:opacity-90 transition shrink-0"
                style="background:linear-gradient(135deg,#1B2B5E,#4A5FA8)">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        </button>
    </form>
</div>

@push('scripts')
<script>
    const msgs = document.getElementById('messages');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
</script>
@endpush

@endsection
