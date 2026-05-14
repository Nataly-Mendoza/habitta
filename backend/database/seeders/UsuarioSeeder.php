<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UsuarioSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole     = Role::firstOrCreate(['name' => 'admin']);
        $propietario   = Role::firstOrCreate(['name' => 'propietario']);
        $visitante     = Role::firstOrCreate(['name' => 'visitante_registrado']);

        $admin = User::firstOrCreate(
            ['email' => 'admin@habitta.mx'],
            [
                'nombre'             => 'Admin',
                'apellido'           => 'Habitta',
                'password'           => Hash::make('Admin123!'),
                'telefono'           => '+525512345678',
                'notificaciones'     => true,
                'email_verified_at'  => now(),
            ]
        );
        $admin->syncRoles([$adminRole]);

        $prop = User::firstOrCreate(
            ['email' => 'prop@habitta.mx'],
            [
                'nombre'             => 'Carlos',
                'apellido'           => 'Mendoza',
                'password'           => Hash::make('Prop123!'),
                'telefono'           => '+525587654321',
                'notificaciones'     => true,
                'email_verified_at'  => now(),
            ]
        );
        $prop->syncRoles([$propietario]);

        $prop2 = User::firstOrCreate(
            ['email' => 'maria@habitta.mx'],
            [
                'nombre'             => 'María',
                'apellido'           => 'González',
                'password'           => Hash::make('Prop123!'),
                'telefono'           => '+525533221100',
                'notificaciones'     => true,
                'email_verified_at'  => now(),
            ]
        );
        $prop2->syncRoles([$propietario]);

        $user = User::firstOrCreate(
            ['email' => 'user@habitta.mx'],
            [
                'nombre'             => 'Luis',
                'apellido'           => 'Ramírez',
                'password'           => Hash::make('User123!'),
                'telefono'           => '+525599999999',
                'notificaciones'     => true,
                'email_verified_at'  => now(),
            ]
        );
        $user->syncRoles([$visitante]);
    }
}
