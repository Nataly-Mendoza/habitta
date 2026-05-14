<div class="min-h-screen flex">
    <!-- Left: Image Panel -->
    <div class="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        <img src="{{ asset('images/penthouse.jpg') }}" alt="Propiedad de lujo" class="w-full h-full object-cover" />
        <div style="background: linear-gradient(135deg, rgba(17,24,41,0.88) 0%, rgba(27,43,94,0.72) 100%)" class="absolute inset-0"></div>
        <div style="background: rgba(201,169,110,0.12); width: 350px; height: 350px; border-radius: 50%; position: absolute; top: -80px; left: -60px; filter: blur(70px)"></div>
        <div style="background: rgba(74,95,168,0.15); width: 300px; height: 300px; border-radius: 50%; position: absolute; bottom: -60px; right: -40px; filter: blur(60px)"></div>

        <div class="relative p-12 flex flex-col justify-between h-full">
            <a href="/" class="flex items-center gap-2">
                <div style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.25)" class="w-10 h-10 rounded-2xl flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 19l-7-4m0 0V9m7 4l7-4" />
                    </svg>
                </div>
                <span style="color: white; font-size: 22px; font-weight: 700; letter-spacing: -0.5px">Habitta</span>
            </a>

            <div>
                <p style="color: #C9A96E; font-size: 13px; letter-spacing: 0.1em" class="uppercase font-semibold mb-4">✦ Únete a Habitta</p>
                <h2 style="color: white; font-size: 36px; font-weight: 700; letter-spacing: -0.5px; line-height: 1.2" class="mb-4">
                    Comienza tu viaje<br />hacia el hogar<br />perfecto
                </h2>
                <p style="color: rgba(255,255,255,0.6); font-size: 15px; line-height: 1.7; max-width: 360px">
                    Únete a 8,500+ clientes satisfechos que encontraron su propiedad de ensueño a través de Habitta.
                </p>

                <!-- Benefits -->
                <div class="space-y-3 mt-8">
                    @foreach([
                        'Acceso a 12,000+ listados exclusivos',
                        'Visualización de amueblamiento con IA',
                        'Mensajería directa con propietarios',
                        'Alertas en tiempo real y análisis de mercado',
                    ] as $beneficio)
                        <div class="flex items-center gap-3">
                            <div style="background: linear-gradient(135deg, #C9A96E, #B8924A); width: 24px; height: 24px; border-radius: 50%" class="flex items-center justify-center shrink-0">
                                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span style="color: rgba(255,255,255,0.75); font-size: 14px">{{ $beneficio }}</span>
                        </div>
                    @endforeach
                </div>
            </div>

            <!-- Trust badges -->
            <div class="flex items-center gap-6">
                @foreach([
                    ['valor' => '12K+', 'etiqueta' => 'Propiedades'],
                    ['valor' => '8.5K+', 'etiqueta' => 'Clientes'],
                    ['valor' => '4.9★', 'etiqueta' => 'Calificación'],
                ] as $stat)
                    <div style="{{ $loop->index < 2 ? 'border-right: 1px solid rgba(255,255,255,0.15)' : 'border-right: none' }}" class="pr-6">
                        <p style="color: #C9A96E; font-size: 20px; font-weight: 700">{{ $stat['valor'] }}</p>
                        <p style="color: rgba(255,255,255,0.45); font-size: 12px">{{ $stat['etiqueta'] }}</p>
                    </div>
                @endforeach
            </div>
        </div>
    </div>

    <!-- Right: Form -->
    <div style="background: #F8F4EE" class="flex-1 flex items-center justify-center px-6 py-10 overflow-y-auto">
        <div class="w-full max-w-[440px]">
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
                <div class="mb-6">
                    <h1 style="color: #1B2B5E; font-size: 26px; font-weight: 700; letter-spacing: -0.5px">Crear tu cuenta</h1>
                    <p style="color: #8A92B2; font-size: 14px; margin-top: 6px">Únete a Habitta — es gratis, rápido y seguro</p>
                </div>

                @if ($this->error)
                    <div style="background: rgba(224,107,107,0.08); border: 1px solid rgba(224,107,107,0.25)" class="rounded-3xl p-3 mb-5">
                        <p style="color: #E06B6B; font-size: 13px">{{ $this->error }}</p>
                    </div>
                @endif

                <form wire:submit="registrarse" class="space-y-4">
                    <!-- Full Name -->
                    <div>
                        <label style="color: #3A4570; font-size: 13px; font-weight: 500" class="block mb-1.5">
                            Nombre Completo
                            <span style="color: #E06B6B">*</span>
                        </label>
                        <div style="position: relative">
                            <svg style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #B0B8D0" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <input
                                type="text"
                                wire:model="nombreCompleto"
                                placeholder="Alexandre Martin"
                                style="width: 100%; border: 1.5px solid rgba(27,43,94,0.1); border-radius: 14px; padding: 11px 14px 11px 42px; font-size: 14px; color: #1B2B5E; background: rgba(27,43,94,0.02); outline: none"
                                class="placeholder:text-[#C0C8D8] focus:border-[rgba(27,43,94,0.3)] transition-colors"
                            />
                        </div>
                        @error('nombreCompleto')
                            <span style="color: #E06B6B; font-size: 12px" class="mt-1">{{ $message }}</span>
                        @enderror
                    </div>

                    <!-- Email -->
                    <div>
                        <label style="color: #3A4570; font-size: 13px; font-weight: 500" class="block mb-1.5">
                            Correo Electrónico
                            <span style="color: #E06B6B">*</span>
                        </label>
                        <div style="position: relative">
                            <svg style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #B0B8D0" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <input
                                type="email"
                                wire:model="correo"
                                placeholder="tu@correo.com"
                                style="width: 100%; border: 1.5px solid rgba(27,43,94,0.1); border-radius: 14px; padding: 11px 14px 11px 42px; font-size: 14px; color: #1B2B5E; background: rgba(27,43,94,0.02); outline: none"
                                class="placeholder:text-[#C0C8D8] focus:border-[rgba(27,43,94,0.3)] transition-colors"
                            />
                        </div>
                        @error('correo')
                            <span style="color: #E06B6B; font-size: 12px" class="mt-1">{{ $message }}</span>
                        @enderror
                    </div>

                    <!-- Phone -->
                    <div>
                        <label style="color: #3A4570; font-size: 13px; font-weight: 500" class="block mb-1.5">
                            Teléfono
                            <span style="color: #8A92B2; font-weight: 400">(opcional)</span>
                        </label>
                        <div style="position: relative">
                            <svg style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #B0B8D0" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948.684l1.498 4.493a1 1 0 00.502.756l2.048 1.029a11.042 11.042 0 01-5.516 5.516l-1.029-2.048a1 1 0 00-.756-.502l-4.493-1.498A1 1 0 005 8.28V5z" />
                            </svg>
                            <input
                                type="tel"
                                wire:model="telefono"
                                placeholder="+33 6 00 00 00 00"
                                style="width: 100%; border: 1.5px solid rgba(27,43,94,0.1); border-radius: 14px; padding: 11px 14px 11px 42px; font-size: 14px; color: #1B2B5E; background: rgba(27,43,94,0.02); outline: none"
                                class="placeholder:text-[#C0C8D8] focus:border-[rgba(27,43,94,0.3)] transition-colors"
                            />
                        </div>
                    </div>

                    <!-- Type Selector -->
                    <div>
                        <label style="color: #3A4570; font-size: 13px; font-weight: 500" class="block mb-1.5">
                            ¿Qué deseas hacer?
                            <span style="color: #E06B6B">*</span>
                        </label>
                        <div class="grid grid-cols-2 gap-3">
                            @foreach([
                                ['valor' => 'buscar', 'etiqueta' => 'Buscar propiedades'],
                                ['valor' => 'publicar', 'etiqueta' => 'Publicar propiedades'],
                            ] as $opcion)
                                <button
                                    type="button"
                                    wire:click="$set('tipoUsuario', '{{ $opcion['valor'] }}')"
                                    style="border: 2px solid {{ $tipoUsuario === $opcion['valor'] ? 'linear-gradient(135deg, #1B2B5E, #4A5FA8)' : 'rgba(27,43,94,0.1)' }}; border-radius: 12px; padding: 12px; background: {{ $tipoUsuario === $opcion['valor'] ? 'rgba(27,43,94,0.05)' : 'transparent' }}"
                                    class="text-center transition-all"
                                >
                                    <span style="color: {{ $tipoUsuario === $opcion['valor'] ? '#1B2B5E' : '#8A92B2' }}; font-size: 13px; font-weight: 500">
                                        {{ $opcion['etiqueta'] }}
                                    </span>
                                </button>
                            @endforeach
                        </div>
                        @error('tipoUsuario')
                            <span style="color: #E06B6B; font-size: 12px" class="mt-1">{{ $message }}</span>
                        @enderror
                    </div>

                    <!-- Password -->
                    <div>
                        <label style="color: #3A4570; font-size: 13px; font-weight: 500" class="block mb-1.5">
                            Contraseña
                            <span style="color: #E06B6B">*</span>
                        </label>
                        <div style="position: relative">
                            <svg style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #B0B8D0" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <input
                                type="{{ $mostrarContraseña ? 'text' : 'password' }}"
                                wire:model="contraseña"
                                placeholder="Crea una contraseña fuerte"
                                style="width: 100%; border: 1.5px solid rgba(27,43,94,0.1); border-radius: 14px; padding: 11px 42px 11px 42px; font-size: 14px; color: #1B2B5E; background: rgba(27,43,94,0.02); outline: none"
                                class="placeholder:text-[#C0C8D8] focus:border-[rgba(27,43,94,0.3)] transition-colors"
                            />
                            <button
                                type="button"
                                wire:click="alternarVisibilidadContraseña"
                                style="position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: #B0B8D0"
                                class="hover:text-[#5A6280] transition-colors"
                            >
                                @if ($mostrarContraseña)
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

                        @if ($contraseña)
                            <div class="mt-2">
                                <div class="flex gap-1 mb-1">
                                    @php
                                        $fuerzaContraseña = $this->obtenerFuerzaContraseña();
                                        $colorFuerza = match($fuerzaContraseña) {
                                            0 => '#E5E7EB',
                                            1 => '#E06B6B',
                                            2 => '#C9A96E',
                                            default => '#2A7A4E',
                                        };
                                    @endphp

                                    @foreach([0, 1, 2] as $i)
                                        <div
                                            style="height: 3px; flex: 1; border-radius: 100px; background: {{ $i < $fuerzaContraseña ? $colorFuerza : '#E5E7EB' }}; transition: all 0.3s"
                                        ></div>
                                    @endforeach
                                </div>

                                <div class="flex flex-wrap gap-3 mt-2">
                                    @foreach([
                                        ['id' => 'length', 'etiqueta' => 'Al menos 8 caracteres', 'test' => strlen($contraseña) >= 8],
                                        ['id' => 'upper', 'etiqueta' => 'Una mayúscula', 'test' => preg_match('/[A-Z]/', $contraseña)],
                                        ['id' => 'number', 'etiqueta' => 'Un número', 'test' => preg_match('/[0-9]/', $contraseña)],
                                    ] as $req)
                                        <div class="flex items-center gap-1.5">
                                            <div
                                                style="width: 14px; height: 14px; border-radius: 50%; background: {{ $req['test'] ? '#2A7A4E15' : 'rgba(27,43,94,0.06)' }}; border: 1px solid {{ $req['test'] ? '#2A7A4E40' : 'transparent' }}; display: flex; align-items: center; justify-content: center"
                                            >
                                                @if ($req['test'])
                                                    <svg class="w-2 h-2 text-[#2A7A4E]" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                                    </svg>
                                                @endif
                                            </div>
                                            <span style="font-size: 11px; color: {{ $req['test'] ? '#2A7A4E' : '#8A92B2' }}">{{ $req['etiqueta'] }}</span>
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        @endif

                        @error('contraseña')
                            <span style="color: #E06B6B; font-size: 12px" class="mt-1">{{ $message }}</span>
                        @enderror
                    </div>

                    <!-- Confirm Password -->
                    <div>
                        <label style="color: #3A4570; font-size: 13px; font-weight: 500" class="block mb-1.5">
                            Confirmar Contraseña
                            <span style="color: #E06B6B">*</span>
                        </label>
                        <div style="position: relative">
                            <svg style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #B0B8D0" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <input
                                type="{{ $mostrarConfirmar ? 'text' : 'password' }}"
                                wire:model="confirmarContraseña"
                                placeholder="Repite tu contraseña"
                                style="width: 100%; border: {{ $confirmarContraseña && $confirmarContraseña !== $contraseña ? '1.5px solid rgba(224,107,107,0.4)' : '1.5px solid rgba(27,43,94,0.1)' }}; border-radius: 14px; padding: 11px 42px 11px 42px; font-size: 14px; color: #1B2B5E; background: rgba(27,43,94,0.02); outline: none"
                                class="placeholder:text-[#C0C8D8] focus:border-[rgba(27,43,94,0.3)] transition-colors"
                            />
                            <button
                                type="button"
                                wire:click="alternarVisibilidadConfirmar"
                                style="position: absolute; right: 40px; top: 50%; transform: translateY(-50%); color: #B0B8D0"
                                class="hover:text-[#5A6280] transition-colors"
                            >
                                @if ($mostrarConfirmar)
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
                            @if ($confirmarContraseña && $confirmarContraseña === $contraseña)
                                <svg style="position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: #2A7A4E" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            @endif
                        </div>
                        @error('confirmarContraseña')
                            <span style="color: #E06B6B; font-size: 12px" class="mt-1">{{ $message }}</span>
                        @enderror
                    </div>

                    <!-- Terms -->
                    <div class="flex items-start gap-3 pt-1">
                        <button
                            type="button"
                            wire:click="$toggle('aceptaTerminos')"
                            style="width: 20px; height: 20px; border-radius: 6px; border: {{ $aceptaTerminos ? 'none' : '2px solid rgba(27,43,94,0.2)' }}; background: {{ $aceptaTerminos ? 'linear-gradient(135deg, #1B2B5E, #4A5FA8)' : 'transparent' }}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; transition: all 0.2s"
                        >
                            @if ($aceptaTerminos)
                                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                            @endif
                        </button>
                        <p style="color: #6A7280; font-size: 13px; line-height: 1.5">
                            Acepto los
                            <a href="#" style="color: #1B2B5E; font-weight: 600" class="hover:underline">Términos de Servicio</a>
                            de Habitta y la
                            <a href="#" style="color: #1B2B5E; font-weight: 600" class="hover:underline">Política de Privacidad</a>
                        </p>
                    </div>

                    <button
                        type="submit"
                        wire:loading.attr="disabled"
                        style="background: linear-gradient(135deg, #1B2B5E, #4A5FA8); color: white; border-radius: 14px; width: 100%"
                        class="flex items-center justify-center gap-3 py-3.5 font-semibold text-sm transition-all hover:opacity-90 hover:shadow-lg disabled:opacity-60 mt-2"
                    >
                        <div wire:loading class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span wire:loading>Creando cuenta...</span>
                        <span wire:loading.remove class="flex items-center gap-3">
                            Crear Cuenta
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                    </button>
                </form>

                <div class="relative my-5">
                    <div style="border-top: 1px solid rgba(27,43,94,0.1)"></div>
                    <span style="background: white; color: #8A92B2; font-size: 12px; padding: 0 12px; position: absolute; top: -9px; left: 50%; transform: translateX(-50%)">
                        o regístrate con
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
                    ¿Ya tienes cuenta?
                    <a href="/inicio-sesion" style="color: #1B2B5E; font-weight: 600" class="hover:underline">
                        Iniciar sesión
                    </a>
                </p>
            </div>
        </div>
    </div>
</div>
