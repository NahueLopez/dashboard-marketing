<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('metrics_cache', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('provider', ['google', 'meta']);
            $table->string('metric_key');
            $table->json('metric_value'); 
            $table->date('recorded_at');
            $table->timestamps();

            // Clave única compuesta para evitar duplicar la misma métrica del mismo proveedor el mismo día para un usuario
            $table->unique(['user_id', 'provider', 'metric_key', 'recorded_at'], 'metrics_cache_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('metrics_cache');
    }
};
