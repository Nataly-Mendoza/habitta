<?php

namespace App\Livewire\Autenticacion;

use Livewire\Component;
use Livewire\Attributes\Validate;
use Illuminate\Support\Facades\Auth;

class InicioSesion extends Component
{
    #[Validate('required|email')]
    public string $correo = '';

    #[Validate('required|min:8')]
    public string $contraseña = '';

    public bool $mostrarContraseña = false;
    public string $error = '';
    public bool $cargando = false;

    public function iniciarSesion()
    {
        $this->validate();
        $this->cargando = true;
        $this->error = '';

        try {
            if (Auth::attempt(['email' => $this->correo, 'password' => $this->contraseña])) {
                session()->regenerate();
                return $this->redirect('/panel', navigate: true);
            }

            $this->error = 'Las credenciales no coinciden con nuestros registros.';
        } catch (\Exception $e) {
            $this->error = 'Error al iniciar sesión. Intente nuevamente.';
        } finally {
            $this->cargando = false;
        }
    }

    public function alternarVisibilidadContraseña()
    {
        $this->mostrarContraseña = !$this->mostrarContraseña;
    }

    public function render()
    {
        return view('livewire.autenticacion.inicio-sesion');
    }
}
