<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Metrics\GetDashboardMetricsAction;
use App\Actions\Metrics\SyncGoogleMetricsAction;
use App\Actions\Metrics\SyncPageSpeedMetricsAction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MetricsController extends Controller
{
    public function __construct(
        private readonly GetDashboardMetricsAction $getDashboardMetricsAction,
        private readonly SyncGoogleMetricsAction $syncGoogleMetricsAction,
        private readonly SyncPageSpeedMetricsAction $syncPageSpeedMetricsAction,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json($this->getDashboardMetricsAction->execute($request->user()));
    }

    public function forceSync(Request $request): JsonResponse
    {
        try {
            $this->syncGoogleMetricsAction->execute($request->user());
            
            $targetUrl = env('TARGET_WEBSITE_URL', 'https://naverys.com');
            $this->syncPageSpeedMetricsAction->execute($request->user(), $targetUrl);

            return response()->json(['success' => true]);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
