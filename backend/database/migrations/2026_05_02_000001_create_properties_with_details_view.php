<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("
            CREATE VIEW properties_with_details AS
            SELECT
                p.id,
                p.title,
                p.type,
                p.listing_type,
                p.price,
                p.location,
                p.city,
                p.state,
                p.country,
                p.area,
                p.bedrooms,
                p.bathrooms,
                p.status,
                p.views_count,
                p.created_at,
                u.nombre  AS owner_nombre,
                u.apellido AS owner_apellido,
                u.email   AS owner_email,
                (SELECT COUNT(*) FROM favorites f WHERE f.property_id = p.id)  AS favorites_count,
                (SELECT COUNT(*) FROM property_images pi WHERE pi.property_id = p.id) AS images_count
            FROM properties p
            INNER JOIN usuarios u ON u.id = p.user_id
        ");
    }

    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS properties_with_details');
    }
};
