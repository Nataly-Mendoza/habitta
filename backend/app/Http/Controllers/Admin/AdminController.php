<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function users()
    {
        $users = User::with('roles')->latest()->get();
        return view('admin.users.index', compact('users'));
    }

    public function updateRole(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:admin,propietario,visitante_registrado',
        ]);
        $user->syncRoles([$request->role]);
        return back()->with('exito', "Rol de {$user->nombre} actualizado a «{$request->role}».");
    }

    public function properties()
    {
        $properties = Property::with(['owner', 'images'])->latest()->get();
        return view('admin.properties.index', compact('properties'));
    }

    public function deleteProperty(Property $property)
    {
        $title = $property->title;
        $property->delete();
        return back()->with('exito', "Propiedad «{$title}» eliminada permanentemente.");
    }

    public function closeProperty(Request $request, Property $property)
    {
        $request->validate(['reason' => 'required|string|max:255']);
        $property->update(['status' => 'closed', 'close_reason' => $request->reason]);
        return back()->with('exito', "Propiedad «{$property->title}» cerrada.");
    }
}
