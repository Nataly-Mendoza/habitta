<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\Conversation;
use Illuminate\Support\Facades\Auth;

class PropiedadController extends Controller
{
    public function show(Property $property)
    {
        $property->increment('views_count');
        $property->load(['images', 'owner']);

        $similares = Property::with('images')
            ->active()
            ->where('id', '!=', $property->id)
            ->where('type', $property->type)
            ->take(3)
            ->get();

        $conversacionId = null;

        if (Auth::check()) {
            $conv = Conversation::where('property_id', $property->id)
                ->where('inquirer_id', Auth::id())
                ->first();
            $conversacionId = $conv?->id;
        }

        $propiedad = $property;

        return view('propiedad', compact('propiedad', 'similares', 'conversacionId'));
    }
}
