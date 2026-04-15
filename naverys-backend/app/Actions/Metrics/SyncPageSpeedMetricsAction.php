<?php

declare(strict_types=1);

namespace App\Actions\Metrics;

use App\Models\MetricsCache;
use App\Models\User;
use App\Services\PageSpeedService;
use Exception;
use Illuminate\Support\Facades\Log;

class SyncPageSpeedMetricsAction
{
    public function __construct(
        private readonly PageSpeedService $pageSpeedService,
    ) {
    }

    public function execute(User $user, string $targetUrl): void
    {
        try {
            $data = $this->pageSpeedService->getMetrics($targetUrl);

            MetricsCache::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'provider' => 'google',
                    'metric_key' => 'core_web_vitals',
                ],
                [
                    'metric_value' => json_encode($data),
                    'recorded_at' => now(),
                ]
            );

            Log::info("Core Web Vitals guardadas para {$targetUrl} (Usuario: {$user->id}).");
        } catch (Exception $e) {
            Log::error("Excepción al sincronizar PageSpeed para el usuario {$user->id}: " . $e->getMessage());
            throw $e;
        }
    }
}
