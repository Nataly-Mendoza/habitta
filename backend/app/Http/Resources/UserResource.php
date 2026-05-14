<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'nombre'      => $this->nombre,
            'apellido'    => $this->apellido,
            'full_name'   => $this->full_name,
            'email'       => $this->email,
            'telefono'    => $this->telefono,
            'foto_perfil' => $this->foto_perfil
                ? (str_starts_with($this->foto_perfil, 'http')
                    ? $this->foto_perfil
                    : asset('storage/' . $this->foto_perfil))
                : null,
            'notificaciones' => $this->notificaciones,
            'roles'          => $this->whenLoaded('roles', fn() => $this->roles->pluck('name')),
        ];
    }
}
