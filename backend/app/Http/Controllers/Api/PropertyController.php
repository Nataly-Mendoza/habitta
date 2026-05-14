<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PropertyResource;
use App\Models\Property;
use App\Services\PropertyClosingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PropertyController extends Controller
{
    public function __construct(private readonly PropertyClosingService $closingService) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Property::with(['images', 'owner', 'favorites'])
            ->active();

        if ($request->filled('type')) {
            $query->byType($request->type);
        }

        if ($request->filled('listing_type')) {
            $query->byListingType($request->listing_type);
        }

        if ($request->filled('city')) {
            $query->byCity($request->city);
        }

        if ($request->filled('q')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->q}%")
                  ->orWhere('description', 'like', "%{$request->q}%")
                  ->orWhere('location', 'like', "%{$request->q}%")
                  ->orWhere('city', 'like', "%{$request->q}%");
            });
        }

        $query->priceRange($request->filled('price_min') ? (float) $request->price_min : null,
                           $request->filled('price_max') ? (float) $request->price_max : null);

        $query->areaRange($request->filled('area_min') ? (float) $request->area_min : null,
                          $request->filled('area_max') ? (float) $request->area_max : null);

        if ($request->filled('bedrooms')) {
            $query->where('bedrooms', '>=', (int) $request->bedrooms);
        }

        $sortField = match ($request->get('sort', 'newest')) {
            'price_asc'  => ['price', 'asc'],
            'price_desc' => ['price', 'desc'],
            'area_asc'   => ['area', 'asc'],
            'area_desc'  => ['area', 'desc'],
            default      => ['created_at', 'desc'],
        };

        $query->orderBy($sortField[0], $sortField[1]);

        $perPage = min((int) $request->get('per_page', 12), 50);

        return PropertyResource::collection($query->paginate($perPage));
    }

    public function show(Property $property): PropertyResource
    {
        $property->increment('views_count');
        $property->load(['images', 'owner', 'favorites']);

        return new PropertyResource($property);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'           => 'required|string|max:255',
            'description'     => 'nullable|string|max:5000',
            'type'            => 'required|in:house,apartment,land,studio,commercial,office',
            'listing_type'    => 'required|in:sale,rent',
            'price'           => 'required|numeric|min:0',
            'location'        => 'required|string|max:255',
            'city'            => 'required|string|max:100',
            'state'           => 'nullable|string|max:100',
            'country'         => 'nullable|string|max:100',
            'area'            => 'required|numeric|min:1',
            'bedrooms'        => 'nullable|integer|min:0|max:50',
            'bathrooms'       => 'nullable|integer|min:0|max:50',
            'floor'           => 'nullable|integer|min:0',
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
            'images'          => 'nullable|array|min:1|max:20',
            'images.*'        => 'required|string',
        ]);

        $property = $request->user()->properties()->create($validated);

        if (!empty($validated['images'])) {
            foreach ($validated['images'] as $index => $imagePath) {
                $property->images()->create([
                    'path'    => $imagePath,
                    'is_main' => $index === 0,
                    'order'   => $index,
                ]);
            }
        }

        $property->load(['images', 'owner']);

        return response()->json(new PropertyResource($property), 201);
    }

    public function update(Request $request, Property $property): JsonResponse
    {
        $this->authorize('update', $property);

        $validated = $request->validate([
            'title'           => 'sometimes|required|string|max:255',
            'description'     => 'nullable|string|max:5000',
            'type'            => 'sometimes|required|in:house,apartment,land,studio,commercial,office',
            'listing_type'    => 'sometimes|required|in:sale,rent',
            'price'           => 'sometimes|required|numeric|min:0',
            'location'        => 'sometimes|required|string|max:255',
            'city'            => 'sometimes|required|string|max:100',
            'state'           => 'nullable|string|max:100',
            'country'         => 'nullable|string|max:100',
            'area'            => 'sometimes|required|numeric|min:1',
            'bedrooms'        => 'nullable|integer|min:0|max:50',
            'bathrooms'       => 'nullable|integer|min:0|max:50',
            'floor'           => 'nullable|integer|min:0',
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
        ]);

        $property->update($validated);
        $property->load(['images', 'owner']);

        return response()->json(new PropertyResource($property));
    }

    public function destroy(Property $property): JsonResponse
    {
        $this->authorize('delete', $property);
        $property->delete();

        return response()->json(null, 204);
    }

    public function close(Request $request, Property $property): JsonResponse
    {
        $this->authorize('update', $property);

        $validated = $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $property = $this->closingService->close($property, $validated['reason']);

        return response()->json(new PropertyResource($property));
    }

    public function myProperties(Request $request): AnonymousResourceCollection
    {
        $query = $request->user()
            ->properties()
            ->with(['images', 'favorites'])
            ->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('q')) {
            $query->where('title', 'like', "%{$request->q}%");
        }

        return PropertyResource::collection($query->paginate(12));
    }

    public function cities(): JsonResponse
    {
        $cities = Property::active()
            ->select('city')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('city')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        return response()->json($cities);
    }

    public function typeCounts(): JsonResponse
    {
        $counts = Property::active()
            ->select('type')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('type')
            ->get()
            ->keyBy('type');

        return response()->json($counts);
    }

    public function similar(Property $property): AnonymousResourceCollection
    {
        $similar = Property::with(['images', 'owner'])
            ->active()
            ->where('id', '!=', $property->id)
            ->where(function ($q) use ($property) {
                $q->where('city', $property->city)
                  ->orWhere('type', $property->type);
            })
            ->where('listing_type', $property->listing_type)
            ->limit(4)
            ->get();

        return PropertyResource::collection($similar);
    }
}
