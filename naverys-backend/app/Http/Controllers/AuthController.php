<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Auth\GetAuthenticatedUserAction;
use App\Actions\Auth\LoginUserAction;
use App\Actions\Auth\LogoutUserAction;
use App\Actions\Auth\RegisterUserAction;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private readonly RegisterUserAction $registerUserAction,
        private readonly LoginUserAction $loginUserAction,
        private readonly LogoutUserAction $logoutUserAction,
        private readonly GetAuthenticatedUserAction $getAuthenticatedUserAction,
    ) {
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $user = $this->registerUserAction->execute(
            $request,
            $request->validated(),
        );

        return response()->json([
            'message' => 'Usuario registrado correctamente.',
            'user' => $user,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = $this->loginUserAction->execute(
            $request,
            $request->validated(),
        );

        return response()->json([
            'message' => 'Sesion iniciada correctamente.',
            'user' => $user,
        ]);
    }

    public function user(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $this->getAuthenticatedUserAction->execute($request),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $this->logoutUserAction->execute($request);

        return response()->json([
            'message' => 'Sesion cerrada correctamente.',
        ]);
    }
}
