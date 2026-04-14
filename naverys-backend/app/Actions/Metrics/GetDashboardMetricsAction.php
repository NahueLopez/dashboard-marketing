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

        $pageSpeedCache = MetricsCache::where('user_id', $user->id)
            ->where('provider', 'google')
            ->where('metric_key', 'core_web_vitals')
            ->first();

        $pageSpeedData = $pageSpeedCache ? json_decode($pageSpeedCache->metric_value, true) : null;

        if (!$metrics) {
            return [
                'sessions' => 0,
                'totalUsers' => 0,
                'timeline' => $timeline,
                'pagespeed' => $pageSpeedData,
                'connected' => $isConnected,
                'last_updated' => null,
            ];
        }

        $decoded = json_decode($metrics->metric_value, true);

        return [
            'sessions' => $decoded['sessions'] ?? 0,
            'totalUsers' => $decoded['totalUsers'] ?? 0,
            'newUsers' => $decoded['newUsers'] ?? 0,
            'pageViews' => $decoded['pageViews'] ?? 0,
            'timeline' => $timeline,
            'pagespeed' => $pageSpeedData,
            'connected' => true,
            'last_updated' => $metrics->recorded_at,
        ];
    }
}
