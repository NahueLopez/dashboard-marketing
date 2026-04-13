<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    private function frontendHeaders(): array
    {
        return [
            'Accept' => 'application/json',
            'Origin' => 'http://localhost:5173',
            'Referer' => 'http://localhost:5173/',
        ];
    }

    public function test_user_can_register_and_receive_authenticated_user(): void
    {
        $this
            ->withHeaders($this->frontendHeaders())
            ->get('/sanctum/csrf-cookie')
            ->assertNoContent();

        $response = $this
            ->withHeaders($this->frontendHeaders())
            ->postJson('/api/auth/register', [
                'name' => 'Naverys User',
                'email' => 'auth@naverys.test',
                'password' => 'secret123',
                'password_confirmation' => 'secret123',
            ]);

        $response
            ->assertCreated()
            ->assertJsonPath('user.email', 'auth@naverys.test');

        $this
            ->withHeaders($this->frontendHeaders())
            ->getJson('/api/auth/user')
            ->assertOk()
            ->assertJsonPath('user.email', 'auth@naverys.test');
    }

    public function test_user_can_login_and_logout(): void
    {
        User::query()->create([
            'name' => 'Existing User',
            'email' => 'existing@naverys.test',
            'password' => 'secret123',
        ]);

        $this
            ->withHeaders($this->frontendHeaders())
            ->get('/sanctum/csrf-cookie')
            ->assertNoContent();

        $this
            ->withHeaders($this->frontendHeaders())
            ->postJson('/api/auth/login', [
                'email' => 'existing@naverys.test',
                'password' => 'secret123',
            ])
            ->assertOk()
            ->assertJsonPath('user.email', 'existing@naverys.test');

        $this
            ->withHeaders($this->frontendHeaders())
            ->postJson('/api/auth/logout')
            ->assertOk();

        $this->assertGuest('web');
    }

    public function test_login_rejects_invalid_credentials(): void
    {
        User::query()->create([
            'name' => 'Existing User',
            'email' => 'existing@naverys.test',
            'password' => 'secret123',
        ]);

        $this
            ->withHeaders($this->frontendHeaders())
            ->get('/sanctum/csrf-cookie')
            ->assertNoContent();

        $this
            ->withHeaders($this->frontendHeaders())
            ->postJson('/api/auth/login', [
                'email' => 'existing@naverys.test',
                'password' => 'wrong-password',
            ])
            ->assertUnauthorized();
    }
}
