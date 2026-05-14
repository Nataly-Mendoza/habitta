@extends('layouts.app')
@section('title', 'Crear cuenta')

@section('content')
<div class="min-h-[calc(100vh-64px)] flex">

    {{-- Left panel: image --}}
    <div class="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80"
             alt="Propiedad de lujo" class="w-full h-full object-cover">
        <div class="absolute inset-0" style="background:linear-gradient(135deg,rgba(17,24,41,0.88) 0%,rgba(27,43,94,0.72) 100%)"></div>
        <div class="absolute inset-0 flex flex-col justify-between p-12">
            <a href="{{ route('inicio') }}" class="flex items-center gap-2">
                <div class="w-10 h-10 rounded-2xl flex items-center justify-center" style="background:rgba(255,255,255,0.15);border:1px solid rgba(255,255,255,0.25)">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V21H3V9.5z" stroke="white" stroke-width="2"/></svg>
                </div>
                <span style="color:white;font-size:22px;font-weight:700;letter-spacing:-.5px">Habitta</span>
            </a>

            <div>
                <p class="uppercase font-semibold mb-4" style="color:#C9A96E;font-size:13px;letter-spacing:.1em">✦ Únete a Habitta</p>
                <h2 class="font-bold mb-4" style="color:white;font-size:36px;letter-spacing:-.5px;line-height:1.2">
                    Comienza tu viaje<br>hacia tu hogar ideal
                </h2>
                <p style="color:rgba(255,255,255,0.6);font-size:15px;line-height:1.7;max-width:360px">
                    Únete a 8.5K+ clientes satisfechos que encontraron su propiedad ideal con Habitta.
                </p>
                <div class="space-y-3 mt-8">
                    @foreach(["Acceso a 12,000+ anuncios exclusivos","Visualización con IA de ambientes","Mensajería directa con propietarios","Alertas de precio y análisis de mercado"] as $b)
                    <div class="flex items-center gap-3">
                        <div class="flex items-center justify-center w-6 h-6 rounded-full shrink-0" style="background:linear-gradient(135deg,#C9A96E,#B8924A)">
                            <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>
                        </div>
                        <span style="color:rgba(255,255,255,0.75);font-size:14px">{{ $b }}</span>
                    </div>
                    @endforeach
                </div>
            </div>

            <div class="flex items-center gap-6">
                @foreach([['12K+','Propiedades'],['8.5K+','Clientes'],['4.9★','Calificación']] as $i => $s)
                <div class="{{ $i < 2 ? 'pr-6' : '' }}" style="{{ $i < 2 ? 'border-right:1px solid rgba(255,255,255,0.15)' : '' }}">
                    <p class="font-bold" style="color:#C9A96E;font-size:20px">{{ $s[0] }}</p>
                    <p style="color:rgba(255,255,255,0.45);font-size:12px">{{ $s[1] }}</p>
                </div>
                @endforeach
            </div>
        </div>
    </div>

    {{-- Right panel: form --}}
    <div class="flex-1 flex items-center justify-center px-6 py-10 overflow-y-auto" style="background:#F8F4EE">
        <div class="w-full max-w-[440px]">

            {{-- Mobile logo --}}
            <a href="{{ route('inicio') }}" class="flex items-center gap-2 mb-8 lg:hidden">
                <div class="w-9 h-9 rounded-xl flex items-center justify-center" style="background:linear-gradient(135deg,#1B2B5E,#4A5FA8)">
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V21H3V9.5z" stroke="white" stroke-width="2"/></svg>
                </div>
                <span style="color:#1B2B5E;font-size:20px;font-weight:700">Habitta</span>
            </a>

            <div class="p-8 rounded-[28px]" style="background:white;box-shadow:0 8px 40px rgba(27,43,94,0.1);border:1px solid rgba(27,43,94,0.08)">

                <div class="mb-6">
                    <h1 style="color:#1B2B5E;font-size:26px;font-weight:700;letter-spacing:-.5px">Crear cuenta</h1>
                    <p style="color:#8A92B2;font-size:14px;margin-top:6px">Únete a Habitta — es gratis, rápido y seguro</p>
                </div>

                @if($errors->any())
                <div class="mb-5 p-3 rounded-xl" style="background:rgba(224,107,107,0.08);border:1px solid rgba(224,107,107,0.25)">
                    @foreach($errors->all() as $e)
                    <p style="color:#E06B6B;font-size:13px">{{ $e }}</p>
                    @endforeach
                </div>
                @endif

                <form action="{{ route('registro') }}" method="POST" class="space-y-4">
                    @csrf

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block mb-1.5" style="color:#3A4570;font-size:13px;font-weight:500">Nombre <span style="color:#E06B6B">*</span></label>
                            <input type="text" name="nombre" value="{{ old('nombre') }}"
                                   class="w-full rounded-[14px] outline-none placeholder:text-[#C0C8D8] transition-colors"
                                   style="border:1.5px solid rgba(27,43,94,0.1);padding:11px 14px;font-size:14px;color:#1B2B5E;background:rgba(27,43,94,0.02)"
                                   placeholder="Juan" required>
                        </div>
                        <div>
                            <label class="block mb-1.5" style="color:#3A4570;font-size:13px;font-weight:500">Apellido <span style="color:#E06B6B">*</span></label>
                            <input type="text" name="apellido" value="{{ old('apellido') }}"
                                   class="w-full rounded-[14px] outline-none placeholder:text-[#C0C8D8] transition-colors"
                                   style="border:1.5px solid rgba(27,43,94,0.1);padding:11px 14px;font-size:14px;color:#1B2B5E;background:rgba(27,43,94,0.02)"
                                   placeholder="García" required>
                        </div>
                    </div>

                    <div>
                        <label class="block mb-1.5" style="color:#3A4570;font-size:13px;font-weight:500">Correo electrónico <span style="color:#E06B6B">*</span></label>
                        <input type="email" name="email" value="{{ old('email') }}"
                               class="w-full rounded-[14px] outline-none placeholder:text-[#C0C8D8] transition-colors"
                               style="border:1.5px solid rgba(27,43,94,0.1);padding:11px 14px;font-size:14px;color:#1B2B5E;background:rgba(27,43,94,0.02)"
                               placeholder="tu@correo.com" required>
                    </div>

                    <div>
                        <label class="block mb-1.5" style="color:#3A4570;font-size:13px;font-weight:500">
                            Teléfono <span style="color:#8A92B2;font-weight:400">(opcional)</span>
                        </label>
                        <input type="tel" name="telefono" value="{{ old('telefono') }}"
                               class="w-full rounded-[14px] outline-none placeholder:text-[#C0C8D8] transition-colors"
                               style="border:1.5px solid rgba(27,43,94,0.1);padding:11px 14px;font-size:14px;color:#1B2B5E;background:rgba(27,43,94,0.02)"
                               placeholder="+52 55 1234 5678">
                    </div>

                    {{-- Password with strength indicator --}}
                    <div>
                        <label class="block mb-1.5" style="color:#3A4570;font-size:13px;font-weight:500">Contraseña <span style="color:#E06B6B">*</span></label>
                        <div class="relative">
                            <input type="password" name="password" id="passwordInput"
                                   class="w-full rounded-[14px] outline-none placeholder:text-[#C0C8D8] transition-colors"
                                   style="border:1.5px solid rgba(27,43,94,0.1);padding:11px 42px 11px 14px;font-size:14px;color:#1B2B5E;background:rgba(27,43,94,0.02)"
                                   placeholder="Crea una contraseña fuerte" required
                                   oninput="actualizarFortaleza(this.value)">
                            <button type="button" onclick="togglePassword('passwordInput','eyeIcon1')"
                                    class="absolute right-3 top-1/2 -translate-y-1/2" style="color:#B0B8D0">
                                <svg id="eyeIcon1" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                                </svg>
                            </button>
                        </div>

                        {{-- Strength bar --}}
                        <div id="strengthContainer" class="mt-2 hidden">
                            <div class="flex gap-1 mb-1">
                                <div id="bar0" class="flex-1 h-[3px] rounded-full transition-all" style="background:#E5E7EB"></div>
                                <div id="bar1" class="flex-1 h-[3px] rounded-full transition-all" style="background:#E5E7EB"></div>
                                <div id="bar2" class="flex-1 h-[3px] rounded-full transition-all" style="background:#E5E7EB"></div>
                            </div>
                            <div class="flex flex-wrap gap-3 mt-2">
                                <div class="flex items-center gap-1.5">
                                    <div id="req-len" class="w-3.5 h-3.5 rounded-full flex items-center justify-center" style="background:rgba(27,43,94,0.06)">
                                        <svg id="check-len" class="hidden" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#2A7A4E" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>
                                    </div>
                                    <span id="label-len" class="text-[11px]" style="color:#8A92B2">Al menos 8 caracteres</span>
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <div id="req-upper" class="w-3.5 h-3.5 rounded-full flex items-center justify-center" style="background:rgba(27,43,94,0.06)">
                                        <svg id="check-upper" class="hidden" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#2A7A4E" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>
                                    </div>
                                    <span id="label-upper" class="text-[11px]" style="color:#8A92B2">Una mayúscula</span>
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <div id="req-num" class="w-3.5 h-3.5 rounded-full flex items-center justify-center" style="background:rgba(27,43,94,0.06)">
                                        <svg id="check-num" class="hidden" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#2A7A4E" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>
                                    </div>
                                    <span id="label-num" class="text-[11px]" style="color:#8A92B2">Un número</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {{-- Confirm password --}}
                    <div>
                        <label class="block mb-1.5" style="color:#3A4570;font-size:13px;font-weight:500">Confirmar contraseña <span style="color:#E06B6B">*</span></label>
                        <div class="relative">
                            <input type="password" name="password_confirmation" id="passwordConfirm"
                                   class="w-full rounded-[14px] outline-none placeholder:text-[#C0C8D8] transition-colors"
                                   style="border:1.5px solid rgba(27,43,94,0.1);padding:11px 42px 11px 14px;font-size:14px;color:#1B2B5E;background:rgba(27,43,94,0.02)"
                                   placeholder="Repite tu contraseña" required>
                            <button type="button" onclick="togglePassword('passwordConfirm','eyeIcon2')"
                                    class="absolute right-3 top-1/2 -translate-y-1/2" style="color:#B0B8D0">
                                <svg id="eyeIcon2" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <button type="submit"
                            class="w-full flex items-center justify-center gap-3 py-3.5 rounded-[14px] font-semibold text-sm text-white transition-all hover:opacity-90 hover:shadow-lg mt-2"
                            style="background:linear-gradient(135deg,#1B2B5E,#4A5FA8)">
                        Crear cuenta
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                </form>

                <p class="text-center mt-5" style="color:#8A92B2;font-size:13px">
                    ¿Ya tienes cuenta?
                    <a href="{{ route('login') }}" class="font-semibold hover:underline" style="color:#1B2B5E">Inicia sesión</a>
                </p>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script>
function togglePassword(inputId, iconId) {
    const inp = document.getElementById(inputId);
    const ico = document.getElementById(iconId);
    const isText = inp.type === 'text';
    inp.type = isText ? 'password' : 'text';
    ico.innerHTML = isText
        ? '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'
        : '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22"/>';
}

function actualizarFortaleza(val) {
    const container = document.getElementById('strengthContainer');
    if (!val) { container.classList.add('hidden'); return; }
    container.classList.remove('hidden');

    const checks = [
        { met: val.length >= 8,    bar: 'bar0', req: 'req-len',   chk: 'check-len',   lbl: 'label-len' },
        { met: /[A-Z]/.test(val),  bar: 'bar1', req: 'req-upper', chk: 'check-upper', lbl: 'label-upper' },
        { met: /[0-9]/.test(val),  bar: 'bar2', req: 'req-num',   chk: 'check-num',   lbl: 'label-num' },
    ];

    const score = checks.filter(c => c.met).length;
    const colors = ['#E5E7EB', '#E06B6B', '#C9A96E', '#2A7A4E'];

    checks.forEach((c, i) => {
        const bar = document.getElementById(c.bar);
        bar.style.background = i < score ? colors[score] : '#E5E7EB';

        const req = document.getElementById(c.req);
        const chk = document.getElementById(c.chk);
        const lbl = document.getElementById(c.lbl);
        req.style.background  = c.met ? 'rgba(42,122,78,0.12)' : 'rgba(27,43,94,0.06)';
        req.style.border      = c.met ? '1px solid rgba(42,122,78,0.3)' : '1px solid transparent';
        chk.classList.toggle('hidden', !c.met);
        lbl.style.color = c.met ? '#2A7A4E' : '#8A92B2';
    });
}
</script>
@endpush
@endsection
