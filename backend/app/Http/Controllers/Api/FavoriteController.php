<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PropertyResource;
use App\Models\Favorite;
use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class FavoriteController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $favorites = $request->user()
            ->favorites()
            ->with(['property.images', 'property.owner', 'property.favorites'])
            ->latest()
            ->paginate(12);

        $properties = $favorites->getCollection()->map(fn($f) => $f->property)->filter();

        return PropertyResource::collection(
            $favorites->setCollection($properties)
        );
    }

    public function toggle(Request $request, Property $property): JsonResponse
    {
        $user = $request->user();

        $existing = Favorite::where('user_id', $user->id)
            ->where('property_id', $property->id)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['favorited' => false]);
        }

        Favorite::create([
            'user_id'     => $user->id,
            'property_id' => $property->id,
        ]);

        return response()->json(['favorited' => true]);
    }
}
