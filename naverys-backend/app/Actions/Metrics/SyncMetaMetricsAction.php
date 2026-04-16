<?php

declare(strict_types=1);

namespace App\Actions\Metrics;

use App\Models\MetricsCache;
use App\Models\User;
use App\Services\MetaAdsService;
use Exception;
use Illuminate\Support\Facades\Log;

class SyncMetaMetricsAction
{
    public function __construct(private readonly MetaAdsService $metaAdsService)
    {
    }

    public function execute(User $user): void
    {
        $account = $user->connectedAccounts()->where('provider', 'meta')->first();

        if (!$account) {
            return;
        }

        try {
            $adAccountCache = MetricsCache::where('user_id', $user->id)
                ->where('provider', 'meta')
                ->where('metric_key', 'meta_selected_adaccount')
                ->first();

            $adAccountId = $adAccountCache?->metric_value;

            if (!$adAccountId) {
                return;
            }

            // Fetch Insights
            $insights = $this->metaAdsService->getAccountInsights($account, $adAccountId);

            // Store cleanly in SQLite
            MetricsCache::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'provider' => 'meta',
                    'metric_key' => 'advertising_performance',
                ],
                [
                    'metric_value' => json_encode($insights),
                    'recorded_at' => now(),
                ]
            );

        } catch (Exception $e) {
            Log::error("Failed to sync Meta metrics: " . $e->getMessage());
            // We ignore throw so it doesn't crash the entire dashboard if meta fails
        }
    }
}
