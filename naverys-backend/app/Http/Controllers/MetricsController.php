<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Metrics\GetDashboardMetricsAction;
use App\Actions\Metrics\SyncGoogleMetricsAction;
use App\Actions\Metrics\SyncPageSpeedMetricsAction;
use App\Actions\Metrics\SyncMetaMetricsAction;
use App\Actions\Metrics\SyncSearchConsoleMetricsAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MetricsController extends Controller
{
    public function __construct(
        private readonly GetDashboardMetricsAction $getDashboardMetricsAction,
        private readonly SyncGoogleMetricsAction $syncGoogleMetricsAction,
        private readonly SyncPageSpeedMetricsAction $syncPageSpeedMetricsAction,
        private readonly SyncMetaMetricsAction $syncMetaMetricsAction,
        private readonly SyncSearchConsoleMetricsAction $syncSearchConsoleMetricsAction,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json($this->getDashboardMetricsAction->execute($request->user()));
    }

    public function forceSync(Request $request): JsonResponse
    {
        try {
            \App\Jobs\SyncAllUserMetricsJob::dispatch($request->user());

            return response()->json([
                'success' => true, 
                'message' => 'Sincronización encolada. Demorará unos segundos en actualizarse.'
            ]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error("Fallo al encolar SyncAllUserMetricsJob: " . $e->getMessage());
            return response()->json([
                'error' => 'No se pudo iniciar la sincronización en este momento.'
            ], 422);
        }
    }

    public function syncPageSpeed(Request $request): JsonResponse
    {
        $request->validate(['url' => 'required|url']);
        try {
            $url = $request->input('url');
            
            $propNameCache = \App\Models\MetricsCache::where('user_id', $request->user()->id)
                ->where('provider', 'google')
                ->where('metric_key', 'ga4_property_name')
                ->first();
                
            $propName = $propNameCache ? $propNameCache->metric_value : 'default';

            \App\Models\MetricsCache::updateOrCreate(
                ['user_id' => $request->user()->id, 'provider' => 'google', 'metric_key' => 'pagespeed_url_' . $propName],
                ['metric_value' => $url, 'recorded_at' => now()]
            );
            $this->syncPageSpeedMetricsAction->execute($request->user(), $url);
            return response()->json(['success' => true]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
