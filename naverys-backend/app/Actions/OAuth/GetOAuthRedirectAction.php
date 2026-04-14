<?php

declare(strict_types=1);

namespace App\Actions\OAuth;

use Laravel\Socialite\Facades\Socialite;

class GetOAuthRedirectAction
{
    public function execute(string $provider, int $userId): string
    {
        $driver = $provider === 'meta' ? 'facebook' : $provider;
        $state = encrypt((string) $userId);

        $socialite = Socialite::driver($driver);

        if ($provider === 'google') {
            $socialite->scopes([
                'https://www.googleapis.com/auth/analytics.readonly',
                'https://www.googleapis.com/auth/analytics',
            ]);
        }

        return $socialite
            ->stateless()
            ->with(['state' => $state, 'access_type' => 'offline', 'prompt' => 'consent'])
            ->redirect()
            ->getTargetUrl();
    }
}
