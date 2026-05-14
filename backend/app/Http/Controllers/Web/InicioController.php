<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Property;

class InicioController extends Controller
{
    public function index()
    {
        $destacadas = Property::with('images')
            ->active()
            ->latest()
            ->take(3)
            ->get();

        $ciudades = Property::active()
            ->selectRaw('city, count(*) as total')
            ->groupBy('city')
            ->orderByDesc('total')
            ->take(6)
            ->get();

        $totalPropiedades = Property::active()->count();

        return view('inicio', compact('destacadas', 'ciudades', 'totalPropiedades'));
    }
}
