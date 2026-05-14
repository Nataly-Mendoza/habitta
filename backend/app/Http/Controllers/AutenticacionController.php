<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegistroRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\ActualizarPerfilRequest;
use App\Http\Requests\CambiarContraseñaRequest;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AutenticacionController extends Controller
{
    private function usuarioArray(User $usuario): array
    {
        return [
            'id'             => $usuario->id,
            'nombre'         => $usuario->nombre,
            'apellido'       => $usuario->apellido,
            'full_name'      => $usuario->full_name,
            'email'          => $usuario->email,
            'telefono'       => $usuario->telefono,
            'foto_perfil'    => $usuario->foto_perfil,
            'notificaciones' => (bool) $usuario->notificaciones,
            'roles'          => $usuario->getRoleNames(),
        ];
    }

    /**
     * POST /api/auth/registro
     */
    public function registro(RegistroRequest $request)
    {
        $usuario = User::create([
            'nombre' => $request->nombre,
            'apellido' => $request->apellido,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'telefono' => $request->telefono ?? null,
        ]);

        $role = Role::firstOrCreate(['name' => 'visitante_registrado', 'guard_name' => 'web']);
        $usuario->assignRole($role);

        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token'   => $token,
            'usuario' => $this->usuarioArray($usuario),
        ], 201);
    }

    /**
     * POST /api/auth/login
     */
    public function iniciarSesion(LoginRequest $request)
    {
        if (!Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            return response()->json(['erro' => 'Credenciales inválidas'], 401);
        }

        $usuario = Auth::user();
        $token = $usuario->createToken('auth_token')->plainTextToken;

        return response()->json([
            'token'   => $token,
            'usuario' => $this->usuarioArray($usuario),
        ], 200);
    }

    /**
     * POST /api/auth/logout (auth:sanctum)
     */
    public function cerrarSesion()
    {
        auth()->user()->currentAccessToken()->delete();
        return response()->noContent();
    }

    /**
     * GET /api/auth/usuario (auth:sanctum)
     */
    public function obtenerPerfil()
    {
        return response()->json($this->usuarioArray(auth()->user()), 200);
    }

    /**
     * PUT /api/auth/perfil (auth:sanctum)
     */
    public function actualizarPerfil(ActualizarPerfilRequest $request)
    {
        $usuario = auth()->user();
        $usuario->update($request->validated());

        return response()->json([
            'mensaje' => 'Perfil actualizado',
            'usuario' => [
                'id' => $usuario->id,
                'nombre' => $usuario->nombre,
                'apellido' => $usuario->apellido,
                'email' => $usuario->email,
                'telefono' => $usuario->telefono,
            ],
        ], 200);
    }

    /**
     * PUT /api/auth/contraseña (auth:sanctum)
     */
    public function cambiarContraseña(CambiarContraseñaRequest $request)
    {
        $usuario = auth()->user();

        if (!Hash::check($request->contraseña_actual, $usuario->password)) {
            return response()->json(['error' => 'Contraseña actual incorrecta'], 422);
        }

        $usuario->update(['password' => Hash::make($request->contraseña_nueva)]);

        return response()->json(['mensaje' => 'Contraseña actualizada'], 200);
    }
}
