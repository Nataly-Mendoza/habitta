<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Read-only model backed by the `properties_with_details` DB view.
 * Never write to this model — use Property for mutations.
 */
class PropertyWithDetail extends Model
{
    protected $table = 'properties_with_details';

    public $timestamps = false;

    protected $casts = [
        'price'           => 'float',
        'area'            => 'float',
        'views_count'     => 'integer',
        'favorites_count' => 'integer',
        'images_count'    => 'integer',
        'bedrooms'        => 'integer',
        'bathrooms'       => 'integer',
        'created_at'      => 'datetime',
    ];

    // Prevent accidental writes
    public static function boot(): void
    {
        parent::boot();
        static::saving(fn() => false);
        static::deleting(fn() => false);
    }
}
