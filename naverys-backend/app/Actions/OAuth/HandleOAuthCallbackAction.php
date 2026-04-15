<?php

declare(strict_types=1);

namespace App\Actions\OAuth;

use App\Models\ConnectedAccount;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class HandleOAuthCallbackAction
{
    public function execute(string $provider, ?string $state): void
    {
        try {
            if (!$state) {
                throw new \Exception("Missing state parameter in OAuth callback.");
            }

            $userId = (int) decrypt($state);

            if (!$userId) {
                throw new \Exception("Invalid state payload in OAuth callback.");
            }

            $driver = $provider === 'meta' ? 'facebook' : $provider;
            $socialUser = Socialite::driver($driver)->stateless()->user();

            $dataToUpdate = [
                'provider_id' => $socialUser->getId(),
                'access_token' => $socialUser->token,
            ];

            if (!empty($socialUser->refreshToken)) {
                $dataToUpdate['refresh_token'] = $socialUser->refreshToken;
            }

            Log::info("Saving new Google Access Token. Refresh Token present? " . (empty($socialUser->refreshToken) ? 'No' : 'Yes'));

            ConnectedAccount::updateOrCreate(
                [
                    'user_id' => $userId,
                    'provider' => $provider,
                ],
                $dataToUpdate
            );
        } catch (Throwable $e) {
            Log::error("Failed to handle OAuth callback for $provider: " . $e->getMessage());
            throw $e;
        }
    }
}
