<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\OAuth\GetOAuthRedirectAction;
use App\Actions\OAuth\GetUserConnectedAccountsAction;
use App\Actions\OAuth\HandleOAuthCallbackAction;
use App\Models\MetricsCache;
use App\Services\GoogleAnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Throwable;

class OAuthController extends Controller
{
    public function __construct(
        private readonly GetOAuthRedirectAction $getOAuthRedirectAction,
        private readonly HandleOAuthCallbackAction $handleOAuthCallbackAction,
    ) {
    }

    public function accounts(Request $request, GetUserConnectedAccountsAction $action): JsonResponse
    {
        return response()->json($action->execute($request->user()));
    }

    public function redirect(string $provider): JsonResponse
    {
        if (!in_array($provider, ['google', 'meta'])) {
            return response()->json(['error' => 'Provider no soportado.'], 400);
        }

        $url = $this->getOAuthRedirectAction->execute($provider, auth()->id());
        
        return response()->json([
            'url' => $url,
        ]);
    }

    public function properties(Request $request, GoogleAnalyticsService $service): JsonResponse {
        $account = $request->user()->connectedAccounts()->where('provider','google')->first();
        if(!$account) return response()->json([]);
        return response()->json($service->getAllProperties($account));
    }

    public function selectProperty(Request $request): JsonResponse {
        $request->validate(['property_id' => 'required', 'property_name' => 'required']);
        $uid = $request->user()->id;
        MetricsCache::updateOrCreate(
            ['user_id' => $uid, 'provider' => 'google', 'metric_key' => 'ga4_selected_property'], 
            ['metric_value' => $request->input('property_id'), 'recorded_at' => now()]
        );
        MetricsCache::updateOrCreate(
            ['user_id' => $uid, 'provider' => 'google', 'metric_key' => 'ga4_property_name'], 
            ['metric_value' => $request->input('property_name'), 'recorded_at' => now()]
        );
        return response()->json(['success' => true]);
    }

    public function callback(string $provider): RedirectResponse
    {
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

        if (!in_array($provider, ['google', 'meta'])) {
            return redirect($frontendUrl . '?oauth=error');
        }

        Log::info("OAuth Callback Request Params:", request()->all());

        try {
            $this->handleOAuthCallbackAction->execute($provider, request()->input('state'));
            return redirect($frontendUrl . '?oauth=success');
        } catch (Throwable $e) {
            Log::error("OAuth Callback failed: " . $e->getMessage());
            return redirect($frontendUrl . '?oauth=fail');
        }
    }
}
