<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Facades\Hash;

class AutenticacionTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test: Registro exitoso
     */
    public function test_registro_exitoso(): void
    {
        $datos = [
            'nombre' => 'Juan',
            'apellido' => 'Pérez',
            'email' => 'juan@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'telefono' => '+5255912345678',
        ];

        $response = $this->post('/api/auth/registro', $datos);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'token',
            'usuario' => [
                'id',
                'nombre',
                'apellido',
                'email',
            ],
        ]);
    }

    /**
     * Test: Registro con email duplicado
     */
    public function test_registro_con_email_duplicado(): void
    {
        User::create([
            'nombre' => 'Existente',
            'apellido' => 'Usuario',
            'email' => 'duplicado@example.com',
            'password' => Hash::make('Password123!'),
        ]);

        $datos = [
            'nombre' => 'Otro',
            'apellido' => 'Usuario',
            'email' => 'duplicado@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ];

        $response = $this->postJson('/api/auth/registro', $datos);

        $response->assertStatus(422);
    }

    /**
     * Test: Login exitoso
     */
    public function test_login_exitoso(): void
    {
        User::create([
            'nombre' => 'Propietario',
            'apellido' => 'Test',
            'email' => 'prop@habitta.mx',
            'password' => Hash::make('Prop123!'),
        ]);

        $response = $this->post('/api/auth/login', [
            'email' => 'prop@habitta.mx',
            'password' => 'Prop123!',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'token',
            'usuario' => [
                'id',
                'email',
            ],
        ]);
    }

    /**
     * Test: Login fallido - contraseña incorrecta
     */
    public function test_login_fallido_contraseña_incorrecta(): void
    {
        User::create([
            'nombre' => 'Propietario',
            'apellido' => 'Test',
            'email' => 'prop@habitta.mx',
            'password' => Hash::make('CorrectPass!'),
        ]);

        $response = $this->post('/api/auth/login', [
            'email' => 'prop@habitta.mx',
            'password' => 'IncorrectPass!',
        ]);

        $response->assertStatus(401);
    }

    /**
     * Test: Login fallido - usuario no existe
     */
    public function test_login_fallido_usuario_no_existe(): void
    {
        $response = $this->post('/api/auth/login', [
            'email' => 'noexiste@test.com',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(401);
    }

    /**
     * Test: Logout exitoso
     */
    public function test_logout_exitoso(): void
    {
        $usuario = User::create([
            'nombre' => 'Propietario',
            'apellido' => 'Test',
            'email' => 'prop@habitta.mx',
            'password' => Hash::make('Prop123!'),
        ]);

        $token = $usuario->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->post('/api/auth/logout');

        $response->assertStatus(204);
    }

    /**
     * Test: Obtener usuario autenticado
     */
    public function test_obtener_usuario_autenticado(): void
    {
        $usuario = User::create([
            'nombre' => 'Propietario',
            'apellido' => 'Test',
            'email' => 'prop@habitta.mx',
            'password' => Hash::make('Prop123!'),
        ]);

        $token = $usuario->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->get('/api/auth/usuario');

        $response->assertStatus(200);
        $response->assertJson([
            'id' => $usuario->id,
            'email' => 'prop@habitta.mx',
        ]);
    }
}
