<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Creates a stored procedure (PostgreSQL) or a compatible function that
 * returns the count of active properties grouped by city.
 *
 * On SQLite (dev/test) this migration is skipped — the view above covers
 * the same data; the procedure is only meaningful on the production DB.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        DB::unprepared("
            CREATE OR REPLACE FUNCTION sp_active_properties_by_city()
            RETURNS TABLE(city TEXT, total BIGINT, avg_price NUMERIC) AS $$
            BEGIN
                RETURN QUERY
                SELECT
                    p.city::TEXT,
                    COUNT(*)::BIGINT         AS total,
                    ROUND(AVG(p.price), 2)   AS avg_price
                FROM properties p
                WHERE p.status = 'active'
                GROUP BY p.city
                ORDER BY total DESC;
            END;
            $$ LANGUAGE plpgsql;
        ");
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        DB::unprepared('DROP FUNCTION IF EXISTS sp_active_properties_by_city()');
    }
};
