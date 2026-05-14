<?php

namespace App\Services;

use App\Models\Property;
use Illuminate\Support\Facades\DB;

class PropertyClosingService
{
    /**
     * Close a property with a reason and record a view-snapshot for analytics.
     * Wraps the update in a transaction so partial writes never happen.
     */
    public function close(Property $property, string $reason): Property
    {
        DB::transaction(function () use ($property, $reason) {
            $property->update([
                'status'       => 'closed',
                'close_reason' => $reason,
            ]);
        });

        return $property->fresh(['images', 'owner']);
    }
}
