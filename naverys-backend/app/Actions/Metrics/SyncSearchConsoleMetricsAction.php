<?php

declare(strict_types=1);

namespace App\Actions\Metrics;

use App\Models\MetricsCache;
use App\Models\User;
use App\Services\GoogleSearchConsoleService;
use Exception;
use Illuminate\Support\Facades\Log;

class SyncSearchConsoleMetricsAction
{
    public function __construct(private readonly GoogleSearchConsoleService $searchConsoleService)
    {
    }

    public function execute(User $user): void
    {
        $account = $user->connectedAccounts()->where('provider', 'google')->first();

        if (!$account) {
            return;
        }

        try {
            // Intentar usar la URL de PageSpeed como sitio de Search Console por defecto
            $propNameCache = MetricsCache::where('user_id', $user->id)
                ->where('provider', 'google')
                ->where('metric_key', 'ga4_property_name')
                ->first();
                
            $propName = $propNameCache ? $propNameCache->metric_value : 'default';

            $targetUrlCache = MetricsCache::where('user_id', $user->id)
                ->where('provider', 'google')
                ->where('metric_key', 'pagespeed_url_' . $propName)
                ->first();

            $siteUrlToQuery = null;

            if ($targetUrlCache && !empty($targetUrlCache->metric_value)) {
                $siteUrlToQuery = $this->ensureSiteFormat($targetUrlCache->metric_value);
            } else {
                // Si no hay URL de PageSpeed, tratamos de agarrar la primera de SC
                $sites = $this->searchConsoleService->getSites($account);
                if (count($sites) > 0) {
                    $siteUrlToQuery = $sites[0]['url'];
                }
            }

            if (!$siteUrlToQuery) {
                return;
            }

            $endDate = date('Y-m-d', strtotime('-2 days')); // Search Console tiene un delay de ~2 días en data
            $startDate = date('Y-m-d', strtotime('-32 days'));

            $data = $this->searchConsoleService->getSearchAnalytics($account, $siteUrlToQuery, $startDate, $endDate);
            
            $rows = $data['rows'] ?? [];

            $clicks = 0;
            $impressions = 0;
            $ctr = 0;
            $position = 0;

            if (count($rows) > 0) {
                // By default searchAnalytics query without dimensions returns aggregated total!
                $clicks = (int) $rows[0]['clicks'];
                $impressions = (int) $rows[0]['impressions'];
                $ctr = ((float) $rows[0]['ctr']) * 100; // a porcentaje
                $position = (float) $rows[0]['position'];
            }

            MetricsCache::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'provider' => 'google',
                    'metric_key' => 'seo_performance',
                ],
                [
                    'metric_value' => json_encode([
                        'clicks' => $clicks,
                        'impressions' => $impressions,
                        'ctr' => $ctr,
                        'position' => $position,
                        'site' => $siteUrlToQuery,
                        'simulated' => false
                    ]),
                    'recorded_at' => now(),
                ]
            );

        } catch (Exception $e) {
            Log::error("Failed to sync Search Console metrics: " . $e->getMessage());
        }
    }

    private function ensureSiteFormat(string $url): string
    {
        // SC admin sites commonly are domain properties like: sc-domain:naverys.com or https://naverys.com/
        // By default we check if it starts with http, we just add trailing slash if missing.
        // If it lacks http, we leave it, assuming it could be sc-domain. 
        if (str_starts_with($url, 'http')) {
            return rtrim($url, '/') . '/';
        }
        // GSC doesn't accept bare domains as URL properties easily in v3 unless specified as domain prop,
        // but for now we'll pass exactly what they typed or ensure it's a URL property representation.
        return $url;
    }
}
