<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'title', 'description', 'type', 'listing_type',
        'price', 'location', 'city', 'state', 'country',
        'latitude', 'longitude', 'area', 'bedrooms', 'bathrooms',
        'floor', 'year_built', 'status', 'close_reason',
        'has_water', 'has_electricity', 'has_drainage',
        'has_garage', 'has_garden', 'has_pool',
        'has_security', 'has_gym', 'has_elevator', 'views_count',
    ];

    protected $casts = [
        'price'           => 'float',
        'area'            => 'float',
        'latitude'        => 'float',
        'longitude'       => 'float',
        'created_at'      => 'datetime',
        'updated_at'      => 'datetime',
        'has_water'       => 'boolean',
        'has_electricity' => 'boolean',
        'has_drainage'    => 'boolean',
        'has_garage'      => 'boolean',
        'has_garden'      => 'boolean',
        'has_pool'        => 'boolean',
        'has_security'    => 'boolean',
        'has_gym'         => 'boolean',
        'has_elevator'    => 'boolean',
    ];

    public function getMainImageAttribute(): ?string
    {
        if ($this->relationLoaded('images')) {
            return $this->images->firstWhere('is_main', true)?->url
                ?? $this->images->first()?->url;
        }
        return $this->images()->where('is_main', true)->first()?->url
            ?? $this->images()->oldest('order')->first()?->url;
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class)->orderBy('order');
    }

    public function mainImage(): HasMany
    {
        return $this->hasMany(PropertyImage::class)->where('is_main', true);
    }

    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    public function conversations(): HasMany
    {
        return $this->hasMany(Conversation::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function scopeByCity(Builder $query, string $city): Builder
    {
        return $query->where('city', 'like', "%{$city}%");
    }

    public function scopeByType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    public function scopeByListingType(Builder $query, string $listingType): Builder
    {
        return $query->where('listing_type', $listingType);
    }

    public function scopePriceRange(Builder $query, ?float $min, ?float $max): Builder
    {
        if ($min !== null) {
            $query->where('price', '>=', $min);
        }
        if ($max !== null) {
            $query->where('price', '<=', $max);
        }
        return $query;
    }

    public function scopeAreaRange(Builder $query, ?float $min, ?float $max): Builder
    {
        if ($min !== null) {
            $query->where('area', '>=', $min);
        }
        if ($max !== null) {
            $query->where('area', '<=', $max);
        }
        return $query;
    }
}
