<?php

namespace Tests\Unit;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModelosTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test: Email está en fillable
     */
    public function test_correo_en_fillable(): void
    {
        $usuario = new User();
        $this->assertContains('email', $usuario->getFillable());
    }

    /**
     * Test: Contraseña está hidden
     */
    public function test_contraseña_esta_hidden(): void
    {
        $usuario = new User();
        $this->assertContains('password', $usuario->getHidden());
    }

    /**
     * Test: Notificaciones se castea como boolean
     */
    public function test_notificaciones_castea_como_boolean(): void
    {
        $usuario = User::create([
            'nombre' => 'Test',
            'apellido' => 'User',
            'email' => 'test@test.com',
            'password' => 'password123',
            'notificaciones' => true,
        ]);

        $usuario = $usuario->fresh();
        $this->assertIsBool($usuario->notificaciones);
        $this->assertTrue($usuario->notificaciones);
    }

    /**
     * Test: Usuario puede tener roles de Spatie
     */
    public function test_usuario_puede_tener_roles(): void
    {
        Role::firstOrCreate(['name' => 'propietario', 'guard_name' => 'web']);

        $usuario = User::create([
            'nombre' => 'Juan',
            'apellido' => 'Pérez',
            'email' => 'juan@test.com',
            'password' => 'password123',
        ]);

        $usuario->assignRole('propietario');
        $this->assertTrue($usuario->hasRole('propietario'));
    }

    /**
     * Test: Usuario puede tener permisos de Spatie
     */
    public function test_usuario_puede_tener_permisos(): void
    {
        Permission::firstOrCreate(['name' => 'usar_chat', 'guard_name' => 'web']);

        $usuario = User::create([
            'nombre' => 'Maria',
            'apellido' => 'Gómez',
            'email' => 'maria@test.com',
            'password' => 'password123',
        ]);

        $usuario->givePermissionTo('usar_chat');
        $this->assertTrue($usuario->hasPermissionTo('usar_chat'));
    }
}
