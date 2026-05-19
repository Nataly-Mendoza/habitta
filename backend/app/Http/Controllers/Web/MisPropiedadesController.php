<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class MisPropiedadesController extends Controller
{
    public function index(Request $request)
    {
        $query = Property::with('images')->where('user_id', Auth::id());

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('q')) {
            $query->where('title', 'like', "%{$request->q}%");
        }

        $propiedades = $query->latest()->paginate(10)->withQueryString();

        return view('dashboard.propiedades.index', compact('propiedades'));
    }

    public function crear()
    {
        return view('dashboard.propiedades.crear');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'            => 'required|string|min:10|max:255',
            'description'      => 'nullable|string',
            'type'             => 'required|in:house,apartment,land,studio,commercial,office',
            'listing_type'     => 'required|in:sale,rent',
            'price'            => 'required|numeric|min:1',
            'location'         => 'required|string|min:5',
            'city'             => 'required|string|min:2',
            'state'            => 'nullable|string',
            'area'             => 'required|numeric|min:1',
            'bedrooms'         => 'nullable|integer|min:0',
            'bathrooms'        => 'nullable|integer|min:0',
            'floor'            => 'nullable|integer|min:0',
            'year_built'       => 'nullable|integer|min:1900|max:2026',
            'has_water'        => 'boolean',
            'has_electricity'  => 'boolean',
            'has_drainage'     => 'boolean',
            'has_garage'       => 'boolean',
            'has_garden'       => 'boolean',
            'has_pool'         => 'boolean',
            'has_security'     => 'boolean',
            'has_gym'          => 'boolean',
            'has_elevator'     => 'boolean',
            'images'           => 'nullable|array|max:20',
            'images.*'         => 'file|image|max:5120',
        ], $this->mensajesValidacion());

        $data['user_id'] = Auth::id();
        $data['status']  = 'active';
        $data['country'] = 'México';

        foreach (['has_water','has_electricity','has_drainage','has_garage','has_garden','has_pool','has_security','has_gym','has_elevator'] as $field) {
            $data[$field] = $request->boolean($field);
        }

        $propiedad = Property::create($data);

        // File uploads
        if ($request->hasFile('images')) {
            foreach (array_values($request->file('images')) as $i => $file) {
                $propiedad->images()->create([
                    'path'    => $this->subirImagen($file, $propiedad->id),
                    'is_main' => $i === 0,
                    'order'   => $i,
                ]);
            }
        }

        return redirect()->route('panel.propiedades.index')
            ->with('exito', 'Propiedad publicada correctamente.');
    }

    public function editar(Property $property)
    {
        abort_unless($property->user_id === Auth::id(), 403);
        $property->load('images');
        return view('dashboard.propiedades.editar', compact('property'));
    }

    public function update(Request $request, Property $property)
    {
        abort_unless($property->user_id === Auth::id(), 403);

        $data = $request->validate([
            'title'           => 'required|string|min:10|max:255',
            'description'     => 'nullable|string',
            'type'            => 'required|in:house,apartment,land,studio,commercial,office',
            'listing_type'    => 'required|in:sale,rent',
            'price'           => 'required|numeric|min:1',
            'location'        => 'required|string|min:5',
            'city'            => 'required|string|min:2',
            'state'           => 'nullable|string',
            'area'            => 'required|numeric|min:1',
            'bedrooms'        => 'nullable|integer|min:0',
            'bathrooms'       => 'nullable|integer|min:0',
            'year_built'      => 'nullable|integer|min:1900|max:2026',
            'has_water'       => 'boolean',
            'has_electricity' => 'boolean',
            'has_drainage'    => 'boolean',
            'has_garage'      => 'boolean',
            'has_garden'      => 'boolean',
            'has_pool'        => 'boolean',
            'has_security'    => 'boolean',
            'has_gym'         => 'boolean',
            'has_elevator'    => 'boolean',
            'images'          => 'nullable|array|max:20',
            'images.*'        => 'file|image|max:5120',
        ], $this->mensajesValidacion());

        foreach (['has_water','has_electricity','has_drainage','has_garage','has_garden','has_pool','has_security','has_gym','has_elevator'] as $field) {
            $data[$field] = $request->boolean($field);
        }

        $property->update($data);

        // Append new uploaded images
        if ($request->hasFile('images')) {
            $nextOrder = $property->images()->max('order') + 1;
            $hasMain   = $property->images()->where('is_main', true)->exists();
            foreach (array_values($request->file('images')) as $i => $file) {
                $property->images()->create([
                    'path'    => $this->subirImagen($file, $property->id),
                    'is_main' => (!$hasMain && $i === 0),
                    'order'   => $nextOrder++,
                ]);
            }
        }

        return redirect()->route('panel.propiedades.index')
            ->with('exito', 'Propiedad actualizada correctamente.');
    }

    public function destroy(Property $property)
    {
        abort_unless($property->user_id === Auth::id(), 403);
        $property->delete();
        return redirect()->route('panel.propiedades.index')
            ->with('exito', 'Propiedad eliminada.');
    }

    public function cerrar(Request $request, Property $property)
    {
        abort_unless($property->user_id === Auth::id(), 403);
        $request->validate(['reason' => 'required|string|max:500']);

        $property->update(['status' => 'closed', 'close_reason' => $request->reason]);

        return redirect()->route('panel.propiedades.index')
            ->with('exito', 'Propiedad cerrada.');
    }

    public function destroyImagen(Property $property, PropertyImage $imagen)
    {
        abort_unless($property->user_id === Auth::id(), 403);
        abort_unless($imagen->property_id === $property->id, 404);

        if (!str_starts_with($imagen->path, 'http')) {
            Storage::disk('public')->delete($imagen->path);
        }

        $wasMain = $imagen->is_main;
        $imagen->delete();

        if ($wasMain) {
            $property->images()->oldest('order')->first()?->update(['is_main' => true]);
        }

        return back()->with('exito', 'Imagen eliminada.');
    }

    private function subirImagen(\Illuminate\Http\UploadedFile $file, int $propertyId): string
    {
        if (!empty(env('CLOUDINARY_CLOUD_NAME'))) {
            return cloudinary()->upload($file->getRealPath(), [
                'folder'        => "habitta/properties/{$propertyId}",
                'resource_type' => 'image',
            ])->getSecurePath();
        }

        return $file->store("properties/{$propertyId}", 'public');
    }

    private function mensajesValidacion(): array
    {
        return [
            'title.required'    => 'El título es requerido.',
            'title.min'         => 'Mínimo 10 caracteres.',
            'type.required'     => 'Selecciona el tipo de propiedad.',
            'listing_type.required' => 'Selecciona venta o renta.',
            'price.required'    => 'El precio es requerido.',
            'price.numeric'     => 'El precio debe ser un número.',
            'location.required' => 'La dirección es requerida.',
            'city.required'     => 'La ciudad es requerida.',
            'area.required'     => 'El área es requerida.',
            'area.numeric'      => 'El área debe ser un número.',
        ];
    }
}
