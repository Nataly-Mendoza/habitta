<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function users(): JsonResponse
    {
        $users = User::with('roles')
            ->latest()
            ->get()
            ->map(fn($u) => [
                'id'        => $u->id,
                'nombre'    => $u->nombre,
                'apellido'  => $u->apellido ?? '',
                'email'     => $u->email,
                'roles'     => $u->getRoleNames(),
                'creado_en' => $u->created_at?->toDateString(),
            ]);

        return response()->json(['data' => $users]);
    }

    public function updateRole(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'role' => 'required|in:admin,propietario,visitante_registrado',
        ]);

        $user = User::findOrFail($id);
        $user->syncRoles([$request->role]);

        return response()->json([
            'message' => 'Rol actualizado correctamente.',
            'roles'   => $user->getRoleNames(),
        ]);
    }

    public function properties(): JsonResponse
    {
        $properties = Property::with(['owner', 'images'])
            ->latest()
            ->get()
            ->map(fn($p) => [
                'id'           => $p->id,
                'title'        => $p->title,
                'status'       => $p->status,
                'close_reason' => $p->close_reason,
                'price'        => $p->price,
                'city'         => $p->city,
                'listing_type' => $p->listing_type,
                'type'         => $p->type,
                'views_count'  => $p->views_count,
                'owner'        => $p->owner ? [
                    'id'     => $p->owner->id,
                    'nombre' => $p->owner->nombre,
                    'email'  => $p->owner->email,
                ] : null,
                'main_image'   => $p->main_image,
                'created_at'   => $p->created_at?->toDateString(),
            ]);

        return response()->json(['data' => $properties]);
    }
}
