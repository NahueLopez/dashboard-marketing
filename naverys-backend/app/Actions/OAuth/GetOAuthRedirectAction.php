<?php

declare(strict_types=1);

namespace App\Actions\OAuth;

use Laravel\Socialite\Facades\Socialite;

class GetOAuthRedirectAction
{
    public function execute(string $provider): string
    {
        $driver = $provider === 'meta' ? 'facebook' : $provider;
        return Socialite::driver($driver)->stateless()->redirect()->getTargetUrl();
    }
}
