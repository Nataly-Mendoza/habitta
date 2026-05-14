<?php

use App\Http\Controllers\Admin\AdminController as AdminWebController;
use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\InicioController;
use App\Http\Controllers\Web\CatalogoController;
use App\Http\Controllers\Web\PropiedadController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\MisPropiedadesController;
use App\Http\Controllers\Web\ChatController;
use App\Http\Controllers\Api\AiController;
use App\Models\Favorite;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ── Públicas ────────────────────────────────────────────────────────────────
Route::get('/', [InicioController::class, 'index'])->name('inicio');
Route::get('/catalogo', [CatalogoController::class, 'index'])->name('catalogo');
Route::get('/propiedad/{property}', [PropiedadController::class, 'show'])->name('propiedad.show');

// ── Auth ────────────────────────────────────────────────────────────────────
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/registro', [AuthController::class, 'showRegistro'])->name('registro');
    Route::post('/registro', [AuthController::class, 'registro']);
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// ── Favoritos (web toggle) ───────────────────────────────────────────────────
Route::post('/favoritos/{property}', function (Property $property, Request $request) {
    $user = auth()->user();
    $existing = Favorite::where('user_id', $user->id)
        ->where('property_id', $property->id)
        ->first();

    if ($existing) {
        $existing->delete();
        $favorited = false;
    } else {
        Favorite::create(['user_id' => $user->id, 'property_id' => $property->id]);
        $favorited = true;
    }

    if ($request->wantsJson()) {
        return response()->json(['favorited' => $favorited]);
    }
    return back();
})->name('favoritos.toggle')->middleware('auth');

// ── Panel (protegidas) ───────────────────────────────────────────────────────
Route::prefix('panel')->middleware('auth')->name('panel.')->group(function () {

    Route::get('/', [DashboardController::class, 'index'])->name('index');

    Route::prefix('propiedades')->name('propiedades.')->group(function () {
        Route::get('/', [MisPropiedadesController::class, 'index'])->name('index');
        Route::get('/crear', [MisPropiedadesController::class, 'crear'])->name('crear');
        Route::post('/', [MisPropiedadesController::class, 'store'])->name('store');
        Route::get('/{property}/editar', [MisPropiedadesController::class, 'editar'])->name('editar');
        Route::patch('/{property}', [MisPropiedadesController::class, 'update'])->name('update');
        Route::delete('/{property}', [MisPropiedadesController::class, 'destroy'])->name('destroy');
        Route::patch('/{property}/cerrar', [MisPropiedadesController::class, 'cerrar'])->name('cerrar');
        Route::delete('/{property}/imagenes/{imagen}', [MisPropiedadesController::class, 'destroyImagen'])->name('imagenes.destroy');
    });

    Route::prefix('chat')->name('chat.')->group(function () {
        Route::get('/', [ChatController::class, 'index'])->name('index');
        Route::get('/unread-count', [ChatController::class, 'unreadCount'])->name('unread-count');
        Route::get('/{conversation}', [ChatController::class, 'conversacion'])->name('conversacion');
        Route::post('/', [ChatController::class, 'iniciar'])->name('iniciar');
        Route::post('/{conversation}/mensajes', [ChatController::class, 'enviar'])->name('enviar');
    });

    Route::post('/ai/furnish', [AiController::class, 'furnish'])->name('ai.furnish');
});

// ── Admin (protegidas: auth + role:admin) ────────────────────────────────────
Route::prefix('admin')
    ->middleware(['auth', 'role:admin'])
    ->name('admin.')
    ->group(function () {
        Route::get('/users', [AdminWebController::class, 'users'])->name('users');
        Route::patch('/users/{user}/role', [AdminWebController::class, 'updateRole'])->name('users.role');
        Route::get('/properties', [AdminWebController::class, 'properties'])->name('properties');
        Route::delete('/properties/{property}', [AdminWebController::class, 'deleteProperty'])->name('properties.delete');
        Route::patch('/properties/{property}/close', [AdminWebController::class, 'closeProperty'])->name('properties.close');
    });
