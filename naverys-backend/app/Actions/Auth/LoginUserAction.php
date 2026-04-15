<?php

declare(strict_types=1);

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Throwable;

class LoginUserAction
{
    public function execute(Request $request, array $credentials): User
    {
        try {
            $authenticated = Auth::attempt($credentials, false);

            if (! $authenticated) {
                throw new AuthenticationException('Las credenciales proporcionadas no son validas.');
            }

            $request->session()->regenerate();

            /** @var User $user */
            $user = $request->user();

            return $user;
        } catch (AuthenticationException $exception) {
            throw $exception;
        } catch (Throwable $throwable) {
            Log::error('No se pudo iniciar sesion.', [
                'email' => $credentials['email'] ?? null,
                'exception' => $throwable,
            ]);

            throw $throwable;
        }
    }
}
