<?php

declare(strict_types=1);

namespace App\Actions\Metrics;

use App\Models\ConnectedAccount;
use App\Models\MetricsCache;
use App\Models\User;
use App\Services\GoogleAnalyticsService;
use Exception;
use Illuminate\Support\Facades\Log;

class SyncGoogleMetricsAction
{
    public function __construct(
        private readonly GoogleAnalyticsService $googleAnalyticsService,
    ) {
    }

    public function execute(User $user, string $propertyId): void
    {
        /** @var ConnectedAccount|null $account */
        $account = $user->connectedAccounts()->where('provider', 'google')->first();

        if (!$account) {
            Log::info("El usuario ID {$user->id} no tiene una cuenta de Google conectada para procesar métricas.");
            return;
        }

        try {
            $data = $this->googleAnalyticsService->getVisitsAndSessions($account, $propertyId);

            // Intentar parsear las filas que devuelve GA4
            $sessions = $data['rows'][0]['metricValues'][0]['value'] ?? 0;
            $users = $data['rows'][0]['metricValues'][1]['value'] ?? 0;

            MetricsCache::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'provider' => 'google',
                    'metric_key' => 'visits_and_sessions',
                ],
                [
                    'metric_value' => json_encode([
                        'sessions' => (int) $sessions,
                        'totalUsers' => (int) $users,
                    ]),
                    'recorded_at' => now(),
                ]
            );

        } catch (Exception $e) {
            Log::error("Excepción en SyncGoogleMetricsAction para usuario {$user->id}: " . $e->getMessage());
            throw clone $e; // Se lanza de nuevo para que el Job la marque como Failed y reintente
        }
    }
}
