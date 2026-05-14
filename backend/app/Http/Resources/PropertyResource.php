<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PropertyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'title'           => $this->title,
            'description'     => $this->description,
            'type'            => $this->type,
            'listing_type'    => $this->listing_type,
            'price'           => (float) $this->price,
            'location'        => $this->location,
            'city'            => $this->city,
            'state'           => $this->state,
            'country'         => $this->country,
            'area'            => (float) $this->area,
            'bedrooms'        => $this->bedrooms,
            'bathrooms'       => $this->bathrooms,
            'floor'           => $this->floor,
            'year_built'      => $this->year_built,
            'status'          => $this->status,
            'close_reason'    => $this->close_reason,
            'views_count'     => $this->views_count,
            'has_water'       => (bool) $this->has_water,
            'has_electricity' => (bool) $this->has_electricity,
            'has_drainage'    => (bool) $this->has_drainage,
            'has_garage'      => (bool) $this->has_garage,
            'has_garden'      => (bool) $this->has_garden,
            'has_pool'        => (bool) $this->has_pool,
            'has_security'    => (bool) $this->has_security,
            'has_gym'         => (bool) $this->has_gym,
            'has_elevator'    => (bool) $this->has_elevator,
            'images'          => $this->relationLoaded('images')
                ? PropertyImageResource::collection($this->images)
                : [],
            'main_image'      => $this->relationLoaded('images') && $this->images->isNotEmpty()
                ? ($this->images->firstWhere('is_main', true)?->url ?? $this->images->first()?->url)
                : null,
            'owner'           => new UserResource($this->whenLoaded('owner')),
            'is_favorited'    => $this->when(
                auth()->check(),
                fn() => $this->favorites->contains('user_id', auth()->id())
            ),
            'created_at'      => $this->created_at->toISOString(),
            'updated_at'      => $this->updated_at->toISOString(),
        ];
    }
}
