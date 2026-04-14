<?php

declare(strict_types=1);

use App\Http\Controllers\AuthController;
use App\Http\Controllers\OAuthController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function (): void {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/user', [AuthController::class, 'user']);
        Route::post('/logout', [AuthController::class, 'logout']);
        
        Route::get('/metrics', [\App\Http\Controllers\MetricsController::class, 'index']);
        Route::post('/metrics/sync', [\App\Http\Controllers\MetricsController::class, 'forceSync']);
    });
});

Route::middleware(['auth:sanctum'])->prefix('oauth')->group(function (): void {
    Route::get('/accounts', [OAuthController::class, 'accounts']);
    Route::get('/{provider}/redirect', [OAuthController::class, 'redirect']);
});

Route::prefix('oauth')->group(function (): void {
    Route::get('/{provider}/callback', [OAuthController::class, 'callback']);
});

Route::get('/login', fn() => response()->json(['message' => 'Unauthenticated'], 401))->name('login');
