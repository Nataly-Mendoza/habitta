<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Habitta') — Encuentra tu propiedad ideal</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        navy: '#1B2B5E',
                        'navy-light': '#4A5FA8',
                        gold: '#C9A96E',
                        cream: '#F8F4EE',
                    }
                }
            }
        }
    </script>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    </style>
    @stack('styles')
</head>
<body class="bg-[#F8F4EE] min-h-screen flex flex-col">

{{-- NAVBAR --}}
<header class="sticky top-0 z-50 w-full" style="background:rgba(255,255,255,0.92);backdrop-filter:blur(20px);border-bottom:1px solid rgba(27,43,94,0.08)">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {{-- Logo --}}
        <a href="{{ route('inicio') }}" class="flex items-center gap-2 shrink-0">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center" style="background:linear-gradient(135deg,#1B2B5E,#4A5FA8)">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V21H3V9.5z" stroke="white" stroke-width="2" fill="white" fill-opacity=".2"/></svg>
            </div>
            <span class="text-xl font-semibold tracking-tight" style="color:#1B2B5E;letter-spacing:-.5px">Habitta</span>
        </a>

        {{-- Nav desktop --}}
        <nav class="hidden md:flex items-center gap-1">
            @foreach([['Comprar',route('catalogo').'?listing_type=sale'],['Rentar',route('catalogo').'?listing_type=rent'],['Publicar',auth()->check()?route('panel.propiedades.crear'):route('registro')],['Explorar',route('catalogo')]] as [$label,$path])
            <a href="{{ $path }}" class="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-[rgba(27,43,94,0.06)] hover:text-[#1B2B5E]" style="color:#5A6280">{{ $label }}</a>
            @endforeach
        </nav>

        {{-- Right --}}
        <div class="flex items-center gap-2">
            @auth
                <a href="{{ route('panel.chat.index') }}" class="hidden md:flex w-9 h-9 items-center justify-center rounded-xl hover:bg-[rgba(27,43,94,0.06)]" style="color:#5A6280">
                    <svg width="19" height="19" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                </a>
                <div class="relative ml-1 group">
                    <button class="flex items-center gap-2 pl-1 pr-3 py-1 rounded-2xl hover:bg-[rgba(27,43,94,0.06)]">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white text-xs" style="background:linear-gradient(135deg,#1B2B5E,#4A5FA8)">
                            {{ strtoupper(substr(auth()->user()->nombre, 0, 1)) }}
                        </div>
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="color:#5A6280"><path d="M19 9l-7 7-7-7"/></svg>
                    </button>
                    <div class="absolute right-0 top-12 w-56 rounded-2xl overflow-hidden z-50 hidden group-hover:block" style="background:white;border:1px solid rgba(27,43,94,0.1);box-shadow:0 8px 32px rgba(27,43,94,0.12)">
                        <div class="px-4 py-3" style="border-bottom:1px solid rgba(27,43,94,0.08)">
                            <p class="text-sm font-semibold" style="color:#1B2B5E">{{ auth()->user()->nombre }} {{ auth()->user()->apellido }}</p>
                            <p class="text-xs" style="color:#8A92B2">{{ auth()->user()->email }}</p>
                        </div>
                        <a href="{{ route('panel.index') }}" class="flex items-center gap-3 px-4 py-2.5 hover:bg-[rgba(27,43,94,0.04)] text-sm" style="color:#3A4570">Panel</a>
                        <a href="{{ route('panel.propiedades.index') }}" class="flex items-center gap-3 px-4 py-2.5 hover:bg-[rgba(27,43,94,0.04)] text-sm" style="color:#3A4570">Mis propiedades</a>
                        <a href="{{ route('panel.chat.index') }}" class="flex items-center gap-3 px-4 py-2.5 hover:bg-[rgba(27,43,94,0.04)] text-sm" style="color:#3A4570">Mensajes</a>
                        <div style="border-top:1px solid rgba(27,43,94,0.08)">
                            <form action="{{ route('logout') }}" method="POST">
                                @csrf
                                <button type="submit" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[rgba(220,80,80,0.06)]" style="color:#E06B6B">Cerrar sesión</button>
                            </form>
                        </div>
                    </div>
                </div>
            @else
                <a href="{{ route('login') }}" class="px-4 py-2 rounded-xl text-sm font-medium hover:bg-[rgba(27,43,94,0.06)]" style="color:#1B2B5E">Iniciar sesión</a>
                <a href="{{ route('registro') }}" class="px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 shadow-sm" style="background:linear-gradient(135deg,#1B2B5E,#4A5FA8);color:white">Registrarse</a>
            @endauth
        </div>
    </div>
</header>

{{-- CONTENT --}}
<main class="flex-1">
    @if(session('exito'))
        <div class="max-w-7xl mx-auto px-6 pt-4">
            <div class="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm">{{ session('exito') }}</div>
        </div>
    @endif
    @yield('content')
</main>

{{-- FOOTER --}}
<footer style="background:linear-gradient(135deg,#111829 0%,#1B2B5E 100%)" class="text-white mt-16">
    <div class="max-w-[1400px] mx-auto px-6 pt-16 pb-8">

        {{-- Main grid --}}
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

            {{-- Brand --}}
            <div class="md:col-span-1">
                <div class="flex items-center gap-2 mb-5">
                    <div class="w-9 h-9 rounded-xl flex items-center justify-center"
                         style="background:rgba(255,255,255,0.15);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.2)">
                        <svg width="17" height="17" fill="none" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V21H3V9.5z" stroke="white" stroke-width="2" fill="rgba(255,255,255,0.1)"/></svg>
                    </div>
                    <span class="text-xl font-semibold" style="letter-spacing:-.5px">Habitta</span>
                </div>
                <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7">
                    La plataforma inmobiliaria premium que conecta a las personas con sus hogares ideales en México.
                </p>
                <div class="flex items-center gap-3 mt-6">
                    @foreach(['IG','TW','LI','FB'] as $s)
                    <a href="#"
                       class="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/20"
                       style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.7);font-size:11px;font-weight:600">
                        {{ $s }}
                    </a>
                    @endforeach
                </div>
            </div>

            {{-- Explorar --}}
            <div>
                <p class="uppercase font-semibold mb-5" style="color:rgba(255,255,255,0.9);font-size:13px;letter-spacing:.08em">Explorar</p>
                <ul class="space-y-3">
                    <li><a href="{{ route('catalogo') }}?listing_type=sale"  style="color:rgba(255,255,255,0.5);font-size:14px" class="transition hover:text-white">Propiedades en venta</a></li>
                    <li><a href="{{ route('catalogo') }}?listing_type=rent"  style="color:rgba(255,255,255,0.5);font-size:14px" class="transition hover:text-white">Propiedades en renta</a></li>
                    <li><a href="{{ route('catalogo') }}?type=house"         style="color:rgba(255,255,255,0.5);font-size:14px" class="transition hover:text-white">Casas</a></li>
                    <li><a href="{{ route('catalogo') }}?type=apartment"     style="color:rgba(255,255,255,0.5);font-size:14px" class="transition hover:text-white">Departamentos</a></li>
                    <li><a href="{{ route('catalogo') }}"                    style="color:rgba(255,255,255,0.5);font-size:14px" class="transition hover:text-white">Amueblar con IA</a></li>
                </ul>
            </div>

            {{-- Compañía --}}
            <div>
                <p class="uppercase font-semibold mb-5" style="color:rgba(255,255,255,0.9);font-size:13px;letter-spacing:.08em">Compañía</p>
                <ul class="space-y-3">
                    @foreach(['Acerca de Habitta','Nuestros agentes','Carreras','Blog','Prensa','Política de privacidad'] as $item)
                    <li><a href="#" style="color:rgba(255,255,255,0.5);font-size:14px" class="transition hover:text-white">{{ $item }}</a></li>
                    @endforeach
                </ul>
            </div>

            {{-- Contacto + Newsletter --}}
            <div>
                <p class="uppercase font-semibold mb-5" style="color:rgba(255,255,255,0.9);font-size:13px;letter-spacing:.08em">Contacto</p>
                <ul class="space-y-4 mb-6">
                    <li class="flex items-start gap-3">
                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="shrink-0 mt-0.5" style="color:#C9A96E"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/><circle cx="12" cy="11" r="3"/></svg>
                        <span style="color:rgba(255,255,255,0.5);font-size:14px;line-height:1.5">Av. Presidente Masaryk 123, Polanco, CDMX</span>
                    </li>
                    <li class="flex items-start gap-3">
                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="shrink-0 mt-0.5" style="color:#C9A96E"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                        <span style="color:rgba(255,255,255,0.5);font-size:14px">hola@habitta.mx</span>
                    </li>
                    <li class="flex items-start gap-3">
                        <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="shrink-0 mt-0.5" style="color:#C9A96E"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                        <span style="color:rgba(255,255,255,0.5);font-size:14px">+52 55 1234 5678</span>
                    </li>
                </ul>

                <p class="font-medium mb-3" style="color:rgba(255,255,255,0.7);font-size:13px">Recibe novedades</p>
                <div class="flex gap-2">
                    <input type="email" placeholder="Tu correo"
                           class="flex-1 px-3 py-2 rounded-xl outline-none"
                           style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:white;font-size:13px">
                    <button class="px-4 py-2 rounded-xl font-medium transition hover:opacity-90 shrink-0"
                            style="background:linear-gradient(135deg,#C9A96E,#B8924A);color:white;font-size:13px">
                        Suscribir
                    </button>
                </div>
            </div>
        </div>

        {{-- Bottom bar --}}
        <div class="pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
             style="border-top:1px solid rgba(255,255,255,0.08)">
            <p style="color:rgba(255,255,255,0.35);font-size:13px">
                © {{ date('Y') }} Habitta. Todos los derechos reservados.
            </p>
            <div class="flex items-center gap-5">
                @foreach(['Términos de servicio','Privacidad','Cookies'] as $item)
                <a href="#" style="color:rgba(255,255,255,0.35);font-size:13px" class="transition hover:text-white">{{ $item }}</a>
                @endforeach
            </div>
        </div>
    </div>
</footer>

@stack('scripts')
<script>
async function toggleFavoriteCard(e, btn) {
    e.preventDefault();
    e.stopPropagation();
    const id    = btn.dataset.prop;
    const token = document.querySelector('meta[name="csrf-token"]')?.content ?? '';
    try {
        const res  = await fetch(`/favoritos/${id}`, {
            method: 'POST',
            headers: { 'X-CSRF-TOKEN': token, 'Accept': 'application/json' },
        });
        const data = await res.json();
        const svg  = btn.querySelector('svg');
        svg.setAttribute('fill',   data.favorited ? '#E06B6B' : 'none');
        svg.setAttribute('stroke', data.favorited ? '#E06B6B' : '#9CA3AF');
        btn.dataset.active = data.favorited ? '1' : '0';
    } catch (_) {}
}
</script>
</body>
</html>
