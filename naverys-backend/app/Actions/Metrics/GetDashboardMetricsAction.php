<?php

declare(strict_types=1);

namespace App\Actions\Metrics;

use App\Models\MetricsCache;
use App\Models\User;

class GetDashboardMetricsAction
{
    public function execute(User $user): array
    {
        $metrics = MetricsCache::where('user_id', $user->id)
            ->where('provider', 'google')
            ->where('metric_key', 'visits_and_sessions')
            ->first();

        $isConnected = $user->connectedAccounts()->where('provider', 'google')->exists();

        $timelineCache = MetricsCache::where('user_id', $user->id)
            ->where('provider', 'google')
            ->where('metric_key', 'ga4_weekly_timeline')
            ->first();

        $timeline = [];
        if ($timelineCache) {
            $timelineRaw = json_decode($timelineCache->metric_value, true);
            $rows = $timelineRaw['rows'] ?? [];

            // Mapeo de días para React
            $daysMap = ['Sun' => 'Dom', 'Mon' => 'Lun', 'Tue' => 'Mar', 'Wed' => 'Mie', 'Thu' => 'Jue', 'Fri' => 'Vie', 'Sat' => 'Sab'];

            foreach ($rows as $row) {
                // GA4 format: '20231015'
                $dateStr = $row['dimensionValues'][0]['value'] ?? '';
                if (strlen($dateStr) === 8) {
                    $timestamp = strtotime(substr($dateStr, 0, 4) . '-' . substr($dateStr, 4, 2) . '-' . substr($dateStr, 6, 2));
                    $dayEn = date('D', $timestamp);
                    $timeline[] = [
                        'name' => $daysMap[$dayEn] ?? $dayEn,
                        'sessions' => (int) ($row['metricValues'][0]['value'] ?? 0),
                        'users' => (int) ($row['metricValues'][1]['value'] ?? 0),
                    ];
                }
            }
        }

        $propNameCache = MetricsCache::where('user_id', $user->id)
            ->where('provider', 'google')
            ->where('metric_key', 'ga4_property_name')
            ->first();

        $pageSpeedCache = MetricsCache::where('user_id', $user->id)
            ->where('provider', 'google')
            ->where('metric_key', 'core_web_vitals')
            ->first();

        $pageSpeedData = $pageSpeedCache ? json_decode($pageSpeedCache->metric_value, true) : null;

        $propNameCache = MetricsCache::where('user_id', $user->id)
            ->where('provider', 'google')
            ->where('metric_key', 'ga4_property_name')
            ->first();

        $propName = $propNameCache ? $propNameCache->metric_value : 'default';

        $targetUrlCache = MetricsCache::where('user_id', $user->id)
            ->where('provider', 'google')
            ->where('metric_key', 'pagespeed_url_' . $propName)
            ->first();

        // Legacy bridge
        if (!$targetUrlCache) {
            $targetUrlCache = MetricsCache::where('user_id', $user->id)
                ->where('provider', 'google')
                ->where('metric_key', 'pagespeed_target_url')
                ->first();
        }

        // Meta Ads integration payload
        $metaPerformanceCache = MetricsCache::where('user_id', $user->id)
            ->where('provider', 'meta')
            ->where('metric_key', 'advertising_performance')
            ->first();
            
        $metaAdAccountNameCache = MetricsCache::where('user_id', $user->id)
            ->where('provider', 'meta')
            ->where('metric_key', 'meta_adaccount_name')
            ->first();

        $metaPayload = null;
        if ($metaPerformanceCache) {
            $metaPayload = json_decode($metaPerformanceCache->metric_value, true);
            $metaPayload['account_name'] = $metaAdAccountNameCache ? $metaAdAccountNameCache->metric_value : 'Ad Account';
        }

        $seoCache = MetricsCache::where('user_id', $user->id)
            ->where('provider', 'google')
            ->where('metric_key', 'seo_performance')
            ->first();
            
        $seoPayload = $seoCache ? json_decode($seoCache->metric_value, true) : null;

        if (!$metrics) {
            return [
                'propertyName' => $propNameCache ? $propNameCache->metric_value : null,
                'pagespeedTargetUrl' => $targetUrlCache?->metric_value,
                'sessions' => 0,
                'totalUsers' => 0,
                'newUsers' => 0,
                'pageViews' => 0,
                'timeline' => $timeline,
                'pagespeed' => $pageSpeedData,
                'meta' => $metaPayload,
                'seo' => $seoPayload,
                'connected' => $isConnected,
                'last_updated' => null,
            ];
        }

        $decoded = json_decode($metrics->metric_value, true);

        return [
            'propertyName' => $propNameCache ? $propNameCache->metric_value : null,
            'pagespeedTargetUrl' => $targetUrlCache?->metric_value,
            'sessions' => $decoded['sessions'] ?? 0,
            'totalUsers' => $decoded['totalUsers'] ?? 0,
            'newUsers' => $decoded['newUsers'] ?? 0,
            'pageViews' => $decoded['pageViews'] ?? 0,
            'timeline' => $timeline,
            'pagespeed' => $pageSpeedData,
            'meta' => $metaPayload,
            'seo' => $seoPayload,
            'connected' => true,
            'last_updated' => $metrics->recorded_at,
        ];
    }
}
