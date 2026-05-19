<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PropertyImageResource;
use App\Models\Property;
use App\Models\PropertyImage;
use App\Services\CloudinaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PropertyImageController extends Controller
{
    public function store(Request $request, Property $property, CloudinaryService $cloudinary): JsonResponse
    {
        $this->authorize('update', $property);

        $request->validate([
            'images'    => 'required|array|min:1|max:20',
            'images.*'  => 'required|file|image|max:5120',
        ]);

        $created   = [];
        $nextOrder = $property->images()->max('order') + 1;
        $hasMain   = $property->images()->where('is_main', true)->exists();

        foreach ($request->file('images') as $i => $file) {
            $path = null;
            if ($cloudinary->isConfigured()) {
                $path = $cloudinary->upload($file, "habitta/properties/{$property->id}");
            }
            if (empty($path)) {
                $path = $file->store("properties/{$property->id}", 'public');
            }

            $created[] = $property->images()->create([
                'path'    => $path,
                'is_main' => (! $hasMain && $i === 0),
                'order'   => $nextOrder++,
            ]);
        }

        return response()->json(PropertyImageResource::collection(collect($created)), 201);
    }

    public function destroy(Property $property, PropertyImage $image, CloudinaryService $cloudinary): JsonResponse
    {
        $this->authorize('update', $property);

        if ($image->property_id !== $property->id) {
            abort(404);
        }

        if (str_starts_with($image->path, 'http')) {
            $cloudinary->deleteByUrl($image->path);
        } else {
            Storage::disk('public')->delete($image->path);
        }

        $image->delete();

        if ($image->is_main) {
            $property->images()->oldest('order')->first()?->update(['is_main' => true]);
        }

        return response()->json(null, 204);
    }

    public function setMain(Property $property, PropertyImage $image): JsonResponse
    {
        $this->authorize('update', $property);

        if ($image->property_id !== $property->id) {
            abort(404);
        }

        $property->images()->update(['is_main' => false]);
        $image->update(['is_main' => true]);

        return response()->json(new PropertyImageResource($image));
    }
}
