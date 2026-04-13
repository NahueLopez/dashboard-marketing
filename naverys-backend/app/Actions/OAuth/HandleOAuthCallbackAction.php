<?php

declare(strict_types=1);

namespace App\Actions\OAuth;

use App\Models\ConnectedAccount;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class HandleOAuthCallbackAction
{
    public function execute(string $provider): void
    {
        try {
            $driver = $provider === 'meta' ? 'facebook' : $provider;
            $socialUser = Socialite::driver($driver)->stateless()->user();

            ConnectedAccount::updateOrCreate(
                [
                    'user_id' => auth()->id(),
                    'provider' => $provider, // Retenemos 'meta' u 'google' en DB
                    'provider_id' => $socialUser->getId(),
                ],
                [
                    'access_token' => $socialUser->token,
                    'refresh_token' => $socialUser->refreshToken,
                ]
            );
        } catch (Throwable $e) {
            Log::error("Failed to handle OAuth callback for $provider: " . $e->getMessage(), [
                'exception' => $e,
            ]);
            throw clone $e;
        }
    }
}
