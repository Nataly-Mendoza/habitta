<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Property;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $totalActivas  = Property::where('user_id', $user->id)->where('status', 'active')->count();
        $totalVistas   = Property::where('user_id', $user->id)->sum('views_count');
        $mensajesSinLeer = Conversation::where('owner_id', $user->id)
            ->with(['messages' => fn($q) => $q->whereNull('read_at')->where('sender_id', '!=', $user->id)])
            ->get()
            ->sum(fn($c) => $c->messages->count());

        $totalConsultas = Conversation::where('owner_id', $user->id)->count()
            + Conversation::where('inquirer_id', $user->id)->count();

        $propiedadesRecientes = Property::with('images')
            ->where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get();

        $actividadVistas = Property::where('user_id', $user->id)
            ->orderByDesc('views_count')
            ->take(5)
            ->get(['title', 'views_count']);

        $stats = [
            'activas'   => $totalActivas,
            'vistas'    => $totalVistas,
            'noLeidos'  => $mensajesSinLeer,
            'consultas' => $totalConsultas,
        ];

        $recientes  = $propiedadesRecientes;
        $topVistas  = $actividadVistas;

        return view('dashboard.overview', compact('stats', 'recientes', 'topVistas'));
    }
}
