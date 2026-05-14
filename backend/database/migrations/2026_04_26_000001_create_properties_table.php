<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('usuarios')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('type', ['house', 'apartment', 'land', 'studio', 'commercial', 'office']);
            $table->enum('listing_type', ['sale', 'rent']);
            $table->decimal('price', 12, 2);
            $table->string('location');
            $table->string('city');
            $table->string('state')->nullable();
            $table->string('country')->default('México');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->decimal('area', 10, 2);
            $table->unsignedTinyInteger('bedrooms')->nullable();
            $table->unsignedTinyInteger('bathrooms')->nullable();
            $table->unsignedTinyInteger('floor')->nullable();
            $table->unsignedSmallInteger('year_built')->nullable();
            $table->enum('status', ['active', 'closed'])->default('active');
            $table->text('close_reason')->nullable();
            $table->boolean('has_water')->default(false);
            $table->boolean('has_electricity')->default(false);
            $table->boolean('has_drainage')->default(false);
            $table->boolean('has_garage')->default(false);
            $table->boolean('has_garden')->default(false);
            $table->boolean('has_pool')->default(false);
            $table->boolean('has_security')->default(false);
            $table->boolean('has_gym')->default(false);
            $table->boolean('has_elevator')->default(false);
            $table->unsignedBigInteger('views_count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
