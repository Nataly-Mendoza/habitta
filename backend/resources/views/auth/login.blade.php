@extends('layouts.app')
@section('title', 'Iniciar sesión')

@push('styles')
<style>
    body { background: #F8F4EE !important; }
    .login-input { transition: border-color .15s; }
    .login-input:focus { border-color: rgba(27,43,94,0.35) !important; outline: none; }
    .login-input::placeholder { color: #C0C8D8; }
</style>
@endpush

@section('content')
<div class="min-h-screen flex" style="min-height:100vh">

    {{-- ─── Left panel: image + copy ─────────────────────────────────────── --}}
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden" style="min-height:100vh">
        <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80"
             alt="Propiedad de lujo" class="w-full h-full object-cover absolute inset-0">
        {{-- gradient overlay --}}
        <div class="absolute inset-0" style="background:linear-gradient(135deg,rgba(17,24,41,0.88) 0%,rgba(27,43,94,0.72) 100%)"></div>
        {{-- gold glow --}}
        <div class="absolute" style="width:400px;height:400px;border-radius:50%;bottom:-100px;right:-80px;background:rgba(201,169,110,0.15);filter:blur(80px)"></div>

        <div class="relative flex flex-col justify-between h-full p-12 w-full">
            {{-- Logo --}}
            <a href="{{ route('inicio') }}" class="flex items-center gap-2.5 w-fit">
                <div class="w-10 h-10 rounded-2xl flex items-center justify-center"
                     style="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25)">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V21H3V9.5z" stroke="white" stroke-width="2" fill="rgba(255,255,255,0.1)"/></svg>
                </div>
                <span style="color:white;font-size:22px;font-weight:700;letter-spacing:-.5px">Habitta</span>
            </a>

            {{-- Content --}}
            <div>
                <p class="font-semibold uppercase mb-4" style="color:#C9A96E;font-size:13px;letter-spacing:.1em">✦ Bienvenido</p>
                <h2 class="mb-4" style="color:white;font-size:36px;font-weight:700;letter-spacing:-.5px;line-height:1.2">
                    Tu hogar ideal<br>te espera
                </h2>
                <p style="color:rgba(255,255,255,0.6);font-size:16px;line-height:1.7;max-width:380px">
                    Inicia sesión para acceder a tus propiedades guardadas, gestionar anuncios y conectar con agentes.
                </p>
                <div class="flex items-center gap-8 mt-8">
                    @foreach([['12K+','Propiedades'],['8.5K+','Clientes'],['5★','Calificación']] as [$val,$lbl])
                    <div>
                        <p style="color:#C9A96E;font-size:22px;font-weight:700">{{ $val }}</p>
                        <p style="color:rgba(255,255,255,0.5);font-size:12px">{{ $lbl }}</p>
                    </div>
                    @endforeach
                </div>
            </div>

            {{-- Testimonial --}}
            <div class="p-5" style="background:rgba(255,255,255,0.08);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.15);border-radius:20px">
                <p style="color:rgba(255,255,255,0.85);font-size:14px;line-height:1.7;font-style:italic">
                    "Habitta nos ayudó a encontrar nuestro departamento ideal en solo 2 semanas. ¡La plataforma es excepcional!"
                </p>
                <div class="flex items-center gap-3 mt-4">
                    <div class="flex items-center justify-center font-semibold shrink-0"
                         style="background:linear-gradient(135deg,#C9A96E,#B8924A);color:white;width:36px;height:36px;border-radius:50%;font-size:12px">SL</div>
                    <div>
                        <p style="color:white;font-size:13px;font-weight:600">Sophie Laurent</p>
                        <p style="color:rgba(255,255,255,0.5);font-size:12px">París, Francia</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {{-- ─── Right panel: form ──────────────────────────────────────────────── --}}
    <div class="flex-1 flex items-center justify-center px-6 py-12" style="background:#F8F4EE">
        <div class="w-full" style="max-width:420px">

            {{-- Mobile logo --}}
            <a href="{{ route('inicio') }}" class="flex items-center gap-2 mb-8 lg:hidden">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center"
                     style="background:linear-gradient(135deg,#1B2B5E,#4A5FA8)">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V21H3V9.5z" stroke="white" stroke-width="2"/></svg>
                </div>
                <span style="color:#1B2B5E;font-size:20px;font-weight:700">Habitta</span>
            </a>

            {{-- Card --}}
            <div class="p-8" style="background:white;border-radius:28px;box-shadow:0 8px 40px rgba(27,43,94,0.1);border:1px solid rgba(27,43,94,0.08)">

                <div class="mb-7">
                    <h1 style="color:#1B2B5E;font-size:28px;font-weight:700;letter-spacing:-.5px">Bienvenido</h1>
                    <p style="color:#8A92B2;font-size:14px;margin-top:6px">Inicia sesión en tu cuenta Habitta</p>
                </div>

                {{-- Errors --}}
                @if($errors->any())
                <div class="p-3 mb-5" style="background:rgba(224,107,107,0.08);border:1px solid rgba(224,107,107,0.25);border-radius:12px">
                    @foreach($errors->all() as $e)
                    <p style="color:#E06B6B;font-size:13px">{{ $e }}</p>
                    @endforeach
                </div>
                @endif

                <form action="{{ route('login') }}" method="POST" class="space-y-4">
                    @csrf

                    {{-- Email --}}
                    <div>
                        <label class="block mb-1.5" style="color:#3A4570;font-size:13px;font-weight:500">Correo electrónico</label>
                        <div class="relative">
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                                 class="absolute" style="left:14px;top:50%;transform:translateY(-50%);color:#B0B8D0;pointer-events:none">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                            </svg>
                            <input type="email" name="email" value="{{ old('email') }}" required autocomplete="email"
                                   class="login-input w-full"
                                   placeholder="usuario@habitta.mx"
                                   style="border:1.5px solid {{ $errors->has('email') ? 'rgba(224,107,107,0.4)' : 'rgba(27,43,94,0.1)' }};border-radius:14px;padding:12px 14px 12px 42px;font-size:14px;color:#1B2B5E;background:rgba(27,43,94,0.02)">
                        </div>
                    </div>

                    {{-- Password --}}
                    <div>
                        <div class="flex justify-between items-center mb-1.5">
                            <label style="color:#3A4570;font-size:13px;font-weight:500">Contraseña</label>
                            <span style="color:#C9A96E;font-size:13px;font-weight:500">¿Olvidaste tu contraseña?</span>
                        </div>
                        <div class="relative">
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                                 class="absolute" style="left:14px;top:50%;transform:translateY(-50%);color:#B0B8D0;pointer-events:none">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                <path stroke-linecap="round" stroke-linejoin="round" d="M7 11V7a5 5 0 0110 0v4"/>
                            </svg>
                            <input type="password" name="password" id="passwordInput" required autocomplete="current-password"
                                   class="login-input w-full"
                                   placeholder="••••••••"
                                   style="border:1.5px solid {{ $errors->has('password') ? 'rgba(224,107,107,0.4)' : 'rgba(27,43,94,0.1)' }};border-radius:14px;padding:12px 42px 12px 42px;font-size:14px;color:#1B2B5E;background:rgba(27,43,94,0.02)">
                            <button type="button" onclick="togglePwd()" id="eyeBtn"
                                    class="absolute" style="right:14px;top:50%;transform:translateY(-50%);color:#B0B8D0;background:none;border:none;cursor:pointer;padding:0">
                                <svg id="eyeOpen" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                                </svg>
                                <svg id="eyeClosed" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="display:none">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {{-- Submit --}}
                    <button type="submit"
                            class="flex items-center justify-center gap-3 w-full py-3.5 font-semibold text-sm text-white transition-all hover:opacity-90 hover:shadow-lg"
                            style="background:linear-gradient(135deg,#1B2B5E,#4A5FA8);border-radius:14px;border:none;cursor:pointer">
                        Iniciar sesión
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </button>
                </form>

                {{-- Divider --}}
                <div class="relative my-5">
                    <div style="border-top:1px solid rgba(27,43,94,0.1)"></div>
                    <span class="absolute px-3" style="background:white;color:#8A92B2;font-size:12px;top:-9px;left:50%;transform:translateX(-50%);white-space:nowrap">o continúa con</span>
                </div>

                {{-- OAuth placeholders (not functional — no OAuth configured) --}}
                <div class="grid grid-cols-2 gap-3">
                    @foreach([['Google','G'],['Apple','🍎']] as [$lbl,$ico])
                    <button type="button"
                            class="flex items-center justify-center gap-2 py-3 font-medium transition-all hover:bg-[rgba(27,43,94,0.03)]"
                            style="border:1.5px solid rgba(27,43,94,0.1);border-radius:12px;color:#3A4570;font-size:13px;cursor:default;background:white">
                        <span>{{ $ico }}</span> {{ $lbl }}
                    </button>
                    @endforeach
                </div>

                <p style="color:#8A92B2;font-size:13px;text-align:center;margin-top:20px">
                    ¿No tienes cuenta?
                    <a href="{{ route('registro') }}" class="hover:underline" style="color:#1B2B5E;font-weight:600">Crear cuenta</a>
                </p>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
function togglePwd() {
    var inp = document.getElementById('passwordInput');
    var eyeOpen = document.getElementById('eyeOpen');
    var eyeClosed = document.getElementById('eyeClosed');
    if (inp.type === 'password') {
        inp.type = 'text';
        eyeOpen.style.display = 'none';
        eyeClosed.style.display = 'block';
    } else {
        inp.type = 'password';
        eyeOpen.style.display = 'block';
        eyeClosed.style.display = 'none';
    }
}
</script>
@endpush

@endsection
