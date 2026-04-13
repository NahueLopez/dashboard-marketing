<?php

declare(strict_types=1);

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Throwable;

class RegisterUserAction
{
    public function execute(Request $request, array $attributes): User
    {
        try {
            $user = User::query()->create($attributes);

            Auth::login($user);
            $request->session()->regenerate();

            return $user->fresh();
        } catch (Throwable $throwable) {
            Log::error('No se pudo registrar el usuario.', [
                'email' => $attributes['email'] ?? null,
                'exception' => $throwable,
            ]);

            throw $throwable;
        }
    }
}
