<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AiController;
use App\Http\Controllers\Api\ConversationController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\PropertyImageController;
use App\Http\Controllers\AutenticacionController;

// Health check
Route::get('/health', fn() => response()->json(['ok' => true, 'version' => '1.0.0']));

// Propiedades públicas
Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/cities', [PropertyController::class, 'cities']);
Route::get('/properties/type-counts', [PropertyController::class, 'typeCounts']);
Route::get('/properties/{property}', [PropertyController::class, 'show']);
Route::get('/properties/{property}/similar', [PropertyController::class, 'similar']);

// Autenticación pública
Route::post('/auth/registro', [AutenticacionController::class, 'registro']);
Route::post('/auth/login', [AutenticacionController::class, 'iniciarSesion']);

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {

    // Autenticación
    Route::post('/auth/logout', [AutenticacionController::class, 'cerrarSesion']);
    Route::get('/auth/usuario', [AutenticacionController::class, 'obtenerPerfil']);
    Route::put('/auth/perfil', [AutenticacionController::class, 'actualizarPerfil']);
    Route::put('/auth/contraseña', [AutenticacionController::class, 'cambiarContraseña']);

    // Propiedades
    Route::get('/my-properties', [PropertyController::class, 'myProperties']);

    // propietario|admin — crear
    Route::middleware('role:propietario|admin')->group(function () {
        Route::post('/properties', [PropertyController::class, 'store']);
    });

    // propietario (solo propias) o admin (cualquiera) — editar / cerrar
    Route::put('/properties/{property}',            [PropertyController::class, 'update']);
    Route::post('/properties/{property}/close',     [PropertyController::class, 'close']);

    // admin only — eliminar permanentemente (política en PropertyPolicy)
    Route::delete('/properties/{property}',         [PropertyController::class, 'destroy']);

    // Imágenes
    Route::post('/properties/{property}/images', [PropertyImageController::class, 'store']);
    Route::delete('/properties/{property}/images/{image}', [PropertyImageController::class, 'destroy']);
    Route::put('/properties/{property}/images/{image}/set-main', [PropertyImageController::class, 'setMain']);

    // Favoritos
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/properties/{property}/favorite', [FavoriteController::class, 'toggle']);

    // Chat
    Route::get('/conversations', [ConversationController::class, 'index']);
    Route::post('/conversations', [ConversationController::class, 'start']);
    Route::get('/conversations/unread-count', [ConversationController::class, 'unreadCount']);
    Route::get('/conversations/{conversation}/messages', [ConversationController::class, 'messages']);
    Route::post('/conversations/{conversation}/messages', [ConversationController::class, 'sendMessage']);

    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/recent-properties', [DashboardController::class, 'recentProperties']);
    Route::get('/dashboard/views-activity', [DashboardController::class, 'viewsActivity']);
    Route::get('/dashboard/top-properties', [DashboardController::class, 'topProperties']);

    // AI features — available to all authenticated users
    Route::post('/ai/furnish', [AiController::class, 'furnish']);

    // Admin only
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/users', [AdminController::class, 'users']);
        Route::patch('/users/{id}/role', [AdminController::class, 'updateRole']);
        Route::get('/properties', [AdminController::class, 'properties']);
        Route::post('/properties/bulk-delete', [AdminController::class, 'bulkDeleteProperties']);
    });
});
