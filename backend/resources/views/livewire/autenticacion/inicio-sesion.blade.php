<div class="min-h-screen flex">
    <!-- Left: Image Panel -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src="{{ asset('images/living.jpg') }}" alt="Propiedad de lujo" class="w-full h-full object-cover" />
        <div style="background: linear-gradient(135deg, rgba(17,24,41,0.85) 0%, rgba(27,43,94,0.7) 100%)" class="absolute inset-0"></div>
        <div style="background: rgba(201,169,110,0.15); width: 400px; height: 400px; border-radius: 50%; position: absolute; bottom: -100px; right: -80px; filter: blur(80px)"></div>

        <div class="relative p-12 flex flex-col justify-between h-full">
            <!-- Logo -->
            <a href="/" class="flex items-center gap-2">
                <div style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25)" class="w-10 h-10 rounded-2xl flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 19l-7-4m0 0V9m7 4l7-4" />
                    </svg>
                </div>
                <span style="color: white; font-size: 22px; font-weight: 700; letter-spacing: -0.5px">Habitta</span>
            </a>

            <!-- Content -->
            <div>
                <p style="color: #C9A96E; font-size: 13px; letter-spacing: 0.1em" class="uppercase font-semibold mb-4">✦ Bienvenido</p>
                <h2 style="color: white; font-size: 36px; font-weight: 700; letter-spacing: -0.5px; line-height: 1.2" class="mb-4">
                    Tu casa de<br />ensueño te<br />espera
                </h2>
                <p style="color: rgba(255,255,255,0.6); font-size: 16px; line-height: 1.7; max-width: 380px">
                    Inicia sesión para acceder a tus propiedades guardadas, gestionar anuncios y conectar con agentes en toda Francia.
                </p>
                <div class="flex items-center gap-8 mt-8">
                    @foreach([
                        ['valor' => '12K+', 'etiqueta' => 'Propiedades'],
                        ['valor' => '8.5K+', 'etiqueta' => 'Clientes Felices'],
                        ['valor' => '5★', 'etiqueta' => 'Calificación'],
                    ] as $stat)
                        <div>
                            <p style="color: #C9A96E; font-size: 22px; font-weight: 700">{{ $stat['valor'] }}</p>
                            <p style="color: rgba(255,255,255,0.5); font-size: 12px">{{ $stat['etiqueta'] }}</p>
                        </div>
                    @endforeach
                </div>
            </div>

            <!-- Testimonial -->
            <div style="background: rgba(255,255,255,0.08); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.15)" class="rounded-3xl p-5">
                <p style="color: rgba(255,255,255,0.85); font-size: 14px; line-height: 1.7; font-style: italic">
                    "Habitta nos ayudó a encontrar nuestro apartamento ideal en París en solo 2 semanas. ¡La plataforma es excepcional!"
                </p>
                <div class="flex items-center gap-3 mt-4">
                    <div style="background: linear-gradient(135deg, #C9A96E, #B8924A); color: white; width: 36px; height: 36px; border-radius: 50%; font-size: 12px" class="flex items-center justify-center font-semibold">SL</div>
                    <div>
                        <p style="color: white; font-size: 13px; font-weight: 600">Sophie Laurent</p>
                        <p style="color: rgba(255,255,255,0.5); font-size: 12px">París, Francia</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Right: Form -->
    <div style="background: #F8F4EE" class="flex-1 flex items-center justify-center px-6 py-12">
        <div class="w-full max-w-[420px]">
            <!-- Mobile logo -->
            <a href="/" class="flex items-center gap-2 mb-8 lg:hidden">
                <div style="background: linear-gradient(135deg, #1B2B5E, #4A5FA8)" class="w-9 h-9 rounded-xl flex items-center justify-center">
                    <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 19l-7-4m0 0V9m7 4l7-4" />
                    </svg>
                </div>
                <span style="color: #1B2B5E; font-size: 20px; font-weight: 700">Habitta</span>
            </a>

            <div style="background: white; border-radius: 28px; box-shadow: 0 8px 40px rgba(27,43,94,0.1); border: 1px solid rgba(27,43,94,0.08)" class="p-8">
                <div class="mb-7">
                    <h1 style="color: #1B2B5E; font-size: 28px; font-weight: 700; letter-spacing: -0.5px">Bienvenido</h1>
                    <p style="color: #8A92B2; font-size: 14px; margin-top: 6px">Inicia sesión en tu cuenta Habitta</p>
                </div>

                <!-- Error -->
                @if ($this->error)
                    <div style="background: rgba(224,107,107,0.08); border: 1px solid rgba(224,107,107,0.25)" class="rounded-3xl p-3 mb-5">
                        <p style="color: #E06B6B; font-size: 13px">{{ $this->error }}</p>
                    </div>
                @endif

                <form wire:submit="iniciarSesion" class="space-y-4">
                    <!-- Email -->
                    <div>
                        <label style="color: #3A4570; font-size: 13px; font-weight: 500" class="block mb-1.5">
                            Correo Electrónico
                        </label>
                        <div style="position: relative">
                            <svg style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #B0B8D0" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <input
                                type="email"
                                wire:model="correo"
                                placeholder="alexandre@example.com"
                                style="width: 100%; border: 1.5px solid rgba(27,43,94,0.1); border-radius: 14px; padding: 12px 14px 12px 42px; font-size: 14px; color: #1B2B5E; background: rgba(27,43,94,0.02); outline: none"
                                class="placeholder:text-[#C0C8D8] focus:border-[rgba(27,43,94,0.3)] transition-colors"
                            />
                        </div>
                        @error('correo')
                            <span style="color: #E06B6B; font-size: 12px" class="mt-1">{{ $message }}</span>
                        @enderror
                    </div>

                    <!-- Password -->
                    <div>
                        <div class="flex justify-between items-center mb-1.5">
                            <label style="color: #3A4570; font-size: 13px; font-weight: 500">Contraseña</label>
                            <a href="/contraseña-olvidada" style="color: #C9A96E; font-size: 13px; font-weight: 500" class="hover:opacity-70 transition-all">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>
                        <div style="position: relative">
                            <svg style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #B0B8D0" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <input
                                type="{{ $this->mostrarContraseña ? 'text' : 'password' }}"
                                wire:model="contraseña"
                                placeholder="••••••••"
                                style="width: 100%; border: 1.5px solid rgba(27,43,94,0.1); border-radius: 14px; padding: 12px 42px 12px 42px; font-size: 14px; color: #1B2B5E; background: rgba(27,43,94,0.02); outline: none"
                                class="placeholder:text-[#C0C8D8] focus:border-[rgba(27,43,94,0.3)] transition-colors"
                            />
                            <button
                                type="button"
                                wire:click="alternarVisibilidadContraseña"
                                style="position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: #B0B8D0"
                                class="hover:text-[#5A6280] transition-colors"
                            >
                                @if ($this->mostrarContraseña)
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                @else
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                @endif
                            </button>
                        </div>
                        @error('contraseña')
                            <span style="color: #E06B6B; font-size: 12px" class="mt-1">{{ $message }}</span>
                        @enderror
                    </div>

                    <button
                        type="submit"
                        wire:loading.attr="disabled"
                        style="background: linear-gradient(135deg, #1B2B5E, #4A5FA8); color: white; border-radius: 14px; width: 100%"
                        class="flex items-center justify-center gap-3 py-3.5 font-semibold text-sm transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-60"
                    >
                        <div wire:loading class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span wire:loading>Iniciando sesión...</span>
                        <span wire:loading.remove class="flex items-center gap-3">
                            Iniciar Sesión
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                    </button>
                </form>

                <div class="relative my-5">
                    <div style="border-top: 1px solid rgba(27,43,94,0.1)"></div>
                    <span style="background: white; color: #8A92B2; font-size: 12px; padding: 0 12px; position: absolute; top: -9px; left: 50%; transform: translateX(-50%)">
                        o continúa con
                    </span>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    @foreach([
                        ['etiqueta' => 'Google', 'icono' => 'G'],
                        ['etiqueta' => 'Apple', 'icono' => '🍎'],
                    ] as $proveedor)
                        <button
                            type="button"
                            style="border: 1.5px solid rgba(27,43,94,0.1); border-radius: 12px; color: #3A4570; font-size: 13px"
                            class="flex items-center justify-center gap-2 py-3 font-medium transition-all hover:bg-[rgba(27,43,94,0.03)]"
                        >
                            <span>{{ $proveedor['icono'] }}</span>
                            {{ $proveedor['etiqueta'] }}
                        </button>
                    @endforeach
                </div>

                <p style="color: #8A92B2; font-size: 13px; text-align: center; margin-top: 20px">
                    ¿No tienes cuenta?
                    <a href="/registro" style="color: #1B2B5E; font-weight: 600" class="hover:underline">
                        Crear cuenta
                    </a>
                </p>
            </div>
        </div>
    </div>
</div>
