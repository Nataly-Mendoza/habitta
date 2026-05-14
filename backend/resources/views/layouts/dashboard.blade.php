<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Panel') — Habitta</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>body { font-family: system-ui, -apple-system, sans-serif; }</style>
    @stack('styles')
</head>
<body class="min-h-screen flex" style="background:#F4F1EC">

{{-- SIDEBAR --}}
<aside class="hidden lg:flex flex-col fixed left-0 top-0 h-full w-[260px] z-40" style="background:linear-gradient(to bottom,#111829,#1B2B5E)">
    <div class="px-6 h-16 flex items-center" style="border-bottom:1px solid rgba(255,255,255,0.1)">
        <a href="{{ route('inicio') }}" class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center" style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2)">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V21H3V9.5z" stroke="white" stroke-width="2"/></svg>
            </div>
            <span class="text-lg font-semibold text-white tracking-tight">Habitta</span>
        </a>
    </div>

    {{-- User card --}}
    <div class="px-4 py-5">
        <div class="rounded-2xl p-4" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12)">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white shrink-0" style="background:linear-gradient(135deg,#C9A96E,#B8924A);font-size:14px">
                    {{ strtoupper(substr(auth()->user()->nombre, 0, 1)) }}
                </div>
                <div class="min-w-0">
                    <p class="text-white text-sm font-semibold truncate">{{ auth()->user()->nombre }} {{ auth()->user()->apellido }}</p>
                    <p class="truncate" style="color:rgba(255,255,255,0.5);font-size:12px">Miembro</p>
                </div>
            </div>
        </div>
    </div>

    {{-- Nav --}}
    <nav class="px-4 flex-1 mt-6 space-y-1">
        @php
        $puedePublicar = auth()->user()->hasAnyRole(['propietario', 'admin']);
        $navItems = array_values(array_filter([
            ['label' => 'Panel',            'route' => 'panel.index',              'icon' => 'M3 3h7v7H3zM3 13h7v7H3zM13 3h7v7h-7zM13 13h7v7h-7z'],
            ['label' => 'Mis propiedades',  'route' => 'panel.propiedades.index',  'icon' => 'M3 9.5L12 3l9 6.5V21H3V9.5z'],
            $puedePublicar ? ['label' => 'Publicar', 'route' => 'panel.propiedades.crear', 'icon' => 'M12 5v14M5 12h14'] : null,
            ['label' => 'Mensajes',         'route' => 'panel.chat.index',         'icon' => 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z'],
        ]));
        $adminItems = auth()->user()->hasRole('admin') ? [
            ['label' => 'Usuarios',         'route' => 'admin.users',              'icon' => 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75'],
            ['label' => 'Todas las props.', 'route' => 'admin.properties',         'icon' => 'M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z'],
        ] : [];
        @endphp
        @foreach($navItems as $item)
        @php $active = request()->routeIs($item['route']); @endphp
        <a href="{{ route($item['route']) }}"
           class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all {{ $active ? 'bg-white/15 text-white border border-white/20' : 'text-white/60 hover:bg-white/10 hover:text-white' }}">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                 class="{{ $active ? 'text-[#C9A96E]' : 'text-white/40' }}">
                <path stroke-linecap="round" stroke-linejoin="round" d="{{ $item['icon'] }}"/>
            </svg>
            <span class="text-sm font-medium">{{ $item['label'] }}</span>
        </a>
        @endforeach

        @if(!empty($adminItems))
        <div class="mt-4 pt-4" style="border-top:1px solid rgba(255,255,255,0.1)">
            <p class="px-4 mb-2 text-xs font-semibold uppercase tracking-widest" style="color:rgba(201,169,110,0.7)">Admin</p>
            @foreach($adminItems as $item)
            @php $active = request()->routeIs($item['route']); @endphp
            <a href="{{ route($item['route']) }}"
               class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all {{ $active ? 'bg-white/15 text-white border border-white/20' : 'text-white/60 hover:bg-white/10 hover:text-white' }}">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                     class="{{ $active ? 'text-[#C9A96E]' : 'text-white/40' }}">
                    <path stroke-linecap="round" stroke-linejoin="round" d="{{ $item['icon'] }}"/>
                </svg>
                <span class="text-sm font-medium">{{ $item['label'] }}</span>
            </a>
            @endforeach
        </div>
        @endif
    </nav>

    {{-- Logout --}}
    <div class="px-4 py-4" style="border-top:1px solid rgba(255,255,255,0.1)">
        <form action="{{ route('logout') }}" method="POST">
            @csrf
            <button type="submit" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white text-sm font-medium transition-all">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                Cerrar sesión
            </button>
        </form>
    </div>
</aside>

{{-- MAIN --}}
<div class="flex-1 lg:ml-[260px] flex flex-col min-h-screen">
    <header class="sticky top-0 z-30 h-16 flex items-center justify-between px-6" style="background:rgba(244,241,236,0.95);backdrop-filter:blur(8px);border-bottom:1px solid rgba(27,43,94,0.1)">
        <h1 class="text-lg font-bold" style="color:#1B2B5E">@yield('page-title', 'Panel')</h1>
        <div class="flex items-center gap-3">
            {{-- Notification bell --}}
            <a href="{{ route('panel.chat.index') }}" class="relative p-2 rounded-full hover:bg-blue-900/10 transition" id="notif-bell-link">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="color:#1B2B5E">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
                <span id="notif-badge" class="hidden absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold px-0.5" style="font-size:10px"></span>
            </a>
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style="background:linear-gradient(135deg,#1B2B5E,#4A5FA8)">
                {{ strtoupper(substr(auth()->user()->nombre, 0, 1)) }}
            </div>
        </div>
    </header>

    <main class="p-6 flex-1">
        @if(session('exito'))
            <div class="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm">{{ session('exito') }}</div>
        @endif
        @if($errors->any())
            <div class="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                <ul class="list-disc list-inside space-y-1">
                    @foreach($errors->all() as $e)<li>{{ $e }}</li>@endforeach
                </ul>
            </div>
        @endif
        @yield('content')
    </main>
</div>

@stack('scripts')
<script>
(function () {
    var badge = document.getElementById('notif-badge');
    if (!badge) return;

    function fetchUnread() {
        fetch('{{ route("panel.chat.unread-count") }}', {
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'same-origin',
        })
        .then(function (r) { return r.json(); })
        .then(function (data) {
            var count = data.unread_count || 0;
            if (count > 0) {
                badge.textContent = count > 99 ? '99+' : count;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        })
        .catch(function () {});
    }

    fetchUnread();
    setInterval(fetchUnread, 12000);
})();
</script>
</body>
</html>
