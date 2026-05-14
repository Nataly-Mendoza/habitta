<?php

namespace App\Livewire\Autenticacion;

use Livewire\Component;
use Livewire\Attributes\Validate;
use App\Models\User;
use App\Models\Rol;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class Registro extends Component
{
    #[Validate('required|string|max:255')]
    public string $nombreCompleto = '';

    #[Validate('required|email|unique:usuarios,email')]
    public string $correo = '';

    #[Validate('nullable|phone')]
    public string $telefono = '';

    #[Validate('required|min:8|regex:/[A-Z]/|regex:/[0-9]/')] //we automatas mention
    public string $contraseña = ''; //deberia replantearlo

    #[Validate('required|same:contraseña')]
    public string $confirmarContraseña = '';

    #[Validate('required|boolean')]
    public bool $aceptaTerminos = false;

    #[Validate('required|in:buscar,publicar')]
    public string $tipoUsuario = 'buscar';

    public bool $mostrarContraseña = false;
    public bool $mostrarConfirmar = false;
    public string $error = '';
    public bool $cargando = false;

    public function registrarse()
    {
        $this->validate();

        if (!$this->aceptaTerminos) {
            $this->error = 'Debe aceptar los Términos de Servicio.';
            return;
        }

        $this->cargando = true;
        $this->error = '';

        try {
            $nombre_partes = explode(' ', $this->nombreCompleto, 2);
            $nombre = $nombre_partes[0];
            $apellido = $nombre_partes[1] ?? '';

            $rolNombre = $this->tipoUsuario === 'publicar' ? 'propietario' : 'visitante_registrado';
            $rol = Rol::where('nombre', $rolNombre)->first();

            if (!$rol) {
                $this->error = 'Error en la configuración del sistema.';
                return;
            }

            $usuario = User::create([
                'nombre' => $nombre,
                'apellido' => $apellido,
                'email' => $this->correo,
                'telefono' => $this->telefono,
                'password' => Hash::make($this->contraseña),
                'rol_id' => $rol->id,
                'notificaciones' => true,
            ]);

            Auth::login($usuario);
            session()->regenerate();

            return $this->redirect('/panel', navigate: true);

        } catch (\Exception $e) {
            $this->error = 'Error al crear la cuenta. Intente nuevamente.';
        } finally {
            $this->cargando = false;
        }
    }

    public function alternarVisibilidadContraseña()
    {
        $this->mostrarContraseña = !$this->mostrarContraseña;
    }

    public function alternarVisibilidadConfirmar()
    {
        $this->mostrarConfirmar = !$this->mostrarConfirmar;
    }

    public function obtenerFuerzaContraseña()
    {
        $puntos = 0;
        if (strlen($this->contraseña) >= 8) $puntos++;
        if (preg_match('/[A-Z]/', $this->contraseña)) $puntos++;
        if (preg_match('/[0-9]/', $this->contraseña)) $puntos++;

        return $puntos;
    }

    public function render()
    {
        return view('livewire.autenticacion.registro');
    }
}
