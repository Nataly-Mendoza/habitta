@extends('layouts.dashboard')

@section('title', 'Admin — Usuarios')
@section('page-title', 'Gestión de Usuarios')

@section('content')
<div class="space-y-6">

    <div class="flex items-center justify-between">
        <div>
            <h2 class="text-xl font-bold" style="color:#1B2B5E">Usuarios registrados</h2>
            <p class="text-sm mt-1" style="color:#8A92B2">Administra los roles de cada miembro.</p>
        </div>
        <a href="{{ route('admin.properties') }}"
           class="px-4 py-2 rounded-xl text-sm font-medium text-white"
           style="background:linear-gradient(135deg,#1B2B5E,#4A5FA8)">
            Ver propiedades
        </a>
    </div>

    <div class="rounded-2xl overflow-hidden"
         style="background:white;border:1px solid rgba(27,43,94,0.08);box-shadow:0 2px 12px rgba(27,43,94,0.06)">
        <table class="w-full text-sm">
            <thead>
                <tr style="background:rgba(27,43,94,0.04);border-bottom:1px solid rgba(27,43,94,0.08)">
                    <th class="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style="color:#8A92B2">Usuario</th>
                    <th class="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style="color:#8A92B2">Email</th>
                    <th class="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style="color:#8A92B2">Rol actual</th>
                    <th class="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style="color:#8A92B2">Cambiar rol</th>
                </tr>
            </thead>
            <tbody>
                @foreach($users as $user)
                @php $rol = $user->getRoleNames()->first() ?? '—'; @endphp
                <tr class="border-b hover:bg-[rgba(27,43,94,0.02)] transition-colors"
                    style="border-color:rgba(27,43,94,0.06)">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0"
                                 style="background:linear-gradient(135deg,#1B2B5E,#4A5FA8)">
                                {{ strtoupper(substr($user->nombre, 0, 1)) }}
                            </div>
                            <span class="font-medium" style="color:#1B2B5E">
                                {{ $user->nombre }} {{ $user->apellido }}
                            </span>
                        </div>
                    </td>
                    <td class="px-6 py-4" style="color:#5A6280">{{ $user->email }}</td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                            style="
                                background:{{ $rol === 'admin' ? 'rgba(201,169,110,0.15)' : ($rol === 'propietario' ? 'rgba(27,43,94,0.1)' : 'rgba(138,146,178,0.1)') }};
                                color:{{ $rol === 'admin' ? '#8A6230' : ($rol === 'propietario' ? '#1B2B5E' : '#8A92B2') }}
                            ">
                            {{ $rol }}
                        </span>
                    </td>
                    <td class="px-6 py-4">
                        <form method="POST" action="{{ route('admin.users.role', $user) }}"
                              class="flex items-center gap-2">
                            @csrf
                            @method('PATCH')
                            <select name="role"
                                    class="text-sm rounded-xl border px-3 py-1.5 focus:outline-none focus:ring-2"
                                    style="border-color:rgba(27,43,94,0.2);color:#1B2B5E;background:white">
                                @foreach(['admin','propietario','visitante_registrado'] as $r)
                                    <option value="{{ $r }}" {{ $rol === $r ? 'selected' : '' }}>{{ $r }}</option>
                                @endforeach
                            </select>
                            <button type="submit"
                                    class="px-3 py-1.5 rounded-xl text-xs font-medium text-white"
                                    style="background:linear-gradient(135deg,#1B2B5E,#4A5FA8)">
                                Guardar
                            </button>
                        </form>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
        @if($users->isEmpty())
            <p class="text-center py-12 text-sm" style="color:#8A92B2">No hay usuarios registrados.</p>
        @endif
    </div>

</div>
@endsection
