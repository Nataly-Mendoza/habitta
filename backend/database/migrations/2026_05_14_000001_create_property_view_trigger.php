<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * SQLite equivalent of a stored procedure: a TRIGGER.
 *
 * SQLite does not support stored procedures (CREATE PROCEDURE).
 * Triggers are the standard SQLite mechanism for automatic side-effects on DML.
 *
 * This migration creates:
 *   1. property_view_logs — audit table for every view-count increment
 *   2. trg_log_property_view — fires AFTER views_count is incremented on any property
 *
 * On PostgreSQL (production), the stored procedure sp_active_properties_by_city
 * is already created by migration 2026_05_02_000002. This trigger complements it
 * by providing row-level audit on the dev database.
 *
 * DEMONSTRATION (php artisan tinker):
 *   // Visit a property in the browser, then:
 *   DB::table('property_view_logs')->get()
 *   // → rows auto-inserted by the trigger, zero application code involved
 */
return new class extends Migration
{
    public function up(): void
    {
        // ── Audit table ───────────────────────────────────────────────────────
        Schema::create('property_view_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('views_before')->default(0);
            $table->unsignedInteger('views_after')->default(1);
            $table->timestamp('logged_at')->useCurrent();
        });

        // ── SQLite trigger ────────────────────────────────────────────────────
        // Fires automatically whenever a property's views_count is increased.
        // Equivalent concept to a stored procedure: encapsulated logic that runs
        // without any call from application code.
        if (DB::getDriverName() === 'sqlite') {
            DB::unprepared("
                CREATE TRIGGER IF NOT EXISTS trg_log_property_view
                AFTER UPDATE OF views_count ON properties
                WHEN NEW.views_count > OLD.views_count
                BEGIN
                    INSERT INTO property_view_logs
                        (property_id, views_before, views_after, logged_at)
                    VALUES
                        (NEW.id, OLD.views_count, NEW.views_count, datetime('now'));
                END;
            ");
        }

        // ── PostgreSQL equivalent (already has sp_active_properties_by_city) ─
        // On PostgreSQL we add a trigger function that logs view increments too,
        // matching the SQLite behaviour for cross-environment consistency.
        if (DB::getDriverName() === 'pgsql') {
            DB::unprepared("
                CREATE OR REPLACE FUNCTION fn_log_property_view()
                RETURNS TRIGGER AS \$\$
                BEGIN
                    IF NEW.views_count > OLD.views_count THEN
                        INSERT INTO property_view_logs
                            (property_id, views_before, views_after, logged_at)
                        VALUES
                            (NEW.id, OLD.views_count, NEW.views_count, NOW());
                    END IF;
                    RETURN NEW;
                END;
                \$\$ LANGUAGE plpgsql;
            ");

            DB::unprepared("
                DROP TRIGGER IF EXISTS trg_log_property_view ON properties;
                CREATE TRIGGER trg_log_property_view
                AFTER UPDATE OF views_count ON properties
                FOR EACH ROW EXECUTE FUNCTION fn_log_property_view();
            ");
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            DB::unprepared('DROP TRIGGER IF EXISTS trg_log_property_view');
        }

        if (DB::getDriverName() === 'pgsql') {
            DB::unprepared('DROP TRIGGER IF EXISTS trg_log_property_view ON properties');
            DB::unprepared('DROP FUNCTION IF EXISTS fn_log_property_view()');
        }

        Schema::dropIfExists('property_view_logs');
    }
};
