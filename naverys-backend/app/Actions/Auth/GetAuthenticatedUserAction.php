<?php

declare(strict_types=1);

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Http\Request;

class GetAuthenticatedUserAction
{
    public function execute(Request $request): ?User
    {
        /** @var User|null $user */
        $user = $request->user();

        return $user;
    }
}
