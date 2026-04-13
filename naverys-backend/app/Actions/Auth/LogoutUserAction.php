<?php

declare(strict_types=1);

namespace App\Actions\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Throwable;

class LogoutUserAction
{
    public function execute(Request $request): void
    {
        try {
            Auth::guard('web')->logout();

            $request->session()->invalidate();
            $request->session()->regenerateToken();
        } catch (Throwable $throwable) {
            Log::error('No se pudo cerrar sesion.', [
                'user_id' => $request->user()?->getAuthIdentifier(),
                'exception' => $throwable,
            ]);

            throw $throwable;
        }
    }
}
