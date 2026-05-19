<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PropertyImageResource;
use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PropertyImageController extends Controller
{
    public function store(Request $request, Property $property): JsonResponse
    {
        $this->authorize('update', $property);

        $request->validate([
            'images'    => 'required|array|min:1|max:20',
            'images.*'  => 'required|file|image|max:5120',
        ]);

        $created = [];
        $nextOrder = $property->images()->max('order') + 1;
        $useCloudinary = !empty(env('CLOUDINARY_CLOUD_NAME'));

        foreach ($request->file('images') as $file) {
            if ($useCloudinary) {
                $path = cloudinary()->upload($file->getRealPath(), [
                    'folder'         => "habitta/properties/{$property->id}",
                    'resource_type'  => 'image',
                ])->getSecurePath();
            } else {
                $path = $file->store("properties/{$property->id}", 'public');
            }

            $created[] = $property->images()->create([
                'path'    => $path,
                'is_main' => $property->images()->count() === 0,
                'order'   => $nextOrder++,
            ]);
        }

        return response()->json(PropertyImageResource::collection(collect($created)), 201);
    }

    public function destroy(Property $property, PropertyImage $image): JsonResponse
    {
        $this->authorize('update', $property);

        if ($image->property_id !== $property->id) {
            abort(404);
        }

        if (!str_starts_with($image->path, 'http')) {
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
