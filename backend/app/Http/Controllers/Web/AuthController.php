<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AuthController extends Controller
{
    public function showLogin()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|min:8',
        ], [
            'email.required'    => 'El correo es requerido.',
            'email.email'       => 'Ingresa un correo válido.',
            'password.required' => 'La contraseña es requerida.',
            'password.min'      => 'Mínimo 8 caracteres.',
        ]);

        if (Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended(route('panel.index'));
        }

        return back()->withErrors(['email' => 'Credenciales inválidas.'])->withInput();
    }

    public function showRegistro()
    {
        return view('auth.registro');
    }

    public function registro(Request $request)
    {
        $request->validate([
            'nombre'                => 'required|string|max:100',
            'apellido'              => 'required|string|max:100',
            'email'                 => 'required|email|unique:usuarios,email',
            'password'              => 'required|min:8|confirmed',
            'telefono'              => 'nullable|string|max:20',
        ], [
            'nombre.required'        => 'El nombre es requerido.',
            'apellido.required'      => 'El apellido es requerido.',
            'email.required'         => 'El correo es requerido.',
            'email.email'            => 'Ingresa un correo válido.',
            'email.unique'           => 'Este correo ya está registrado.',
            'password.required'      => 'La contraseña es requerida.',
            'password.min'           => 'Mínimo 8 caracteres.',
            'password.confirmed'     => 'Las contraseñas no coinciden.',
        ]);

        $user = User::create([
            'nombre'         => $request->nombre,
            'apellido'       => $request->apellido,
            'email'          => $request->email,
            'password'       => Hash::make($request->password),
            'telefono'       => $request->telefono,
            'notificaciones' => true,
        ]);

        $role = Role::firstOrCreate(['name' => 'visitante_registrado', 'guard_name' => 'web']);
        $user->assignRole($role);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('panel.index');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('inicio');
    }
}
