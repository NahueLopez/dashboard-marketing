<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\OAuth\GetOAuthRedirectAction;
use App\Actions\OAuth\GetUserConnectedAccountsAction;
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

        $url = $this->getOAuthRedirectAction->execute($provider);
        
        return response()->json([
            'url' => $url,
        ]);
    }

    public function callback(string $provider): RedirectResponse
    {
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');

        if (!in_array($provider, ['google', 'meta'])) {
            return redirect($frontendUrl . '?oauth=error');
        }

        if (auth()->guest()) {
            Log::error("OAuth callback from $provider received, but user is unauthenticated from Sanctum Session perspective.");
            return redirect($frontendUrl . '?oauth=unauthenticated');
        }

        try {
            $this->handleOAuthCallbackAction->execute($provider);
            return redirect($frontendUrl . '?oauth=success');
        } catch (Throwable $e) {
            return redirect($frontendUrl . '?oauth=fail');
        }
    }
}
