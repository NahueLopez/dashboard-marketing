<?php

declare(strict_types=1);

namespace App\Actions\OAuth;

use Illuminate\Support\Facades\Log;
use Throwable;

class GetUserConnectedAccountsAction
{
    public function execute($user): array
    {
        try {
            $providers = $user->connectedAccounts()->pluck('provider')->toArray();
            
            return [
                'success' => true,
                'connected' => $providers,
            ];
        } catch (Throwable $e) {
            Log::error('Failed to fetch connected accounts for user', [
                'user_id' => $user?->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'connected' => [],
            ];
        }
    }
}
