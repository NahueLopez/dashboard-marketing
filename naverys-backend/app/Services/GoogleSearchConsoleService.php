<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\ConnectedAccount;
use Illuminate\Support\Facades\Http;
use Exception;

class GoogleSearchConsoleService
{
    private const BASE_URL = 'https://www.googleapis.com/webmasters/v3';

    public function getSites(ConnectedAccount $account): array
    {
        $response = Http::withToken($account->access_token)->get(self::BASE_URL . '/sites');

        if ($response->status() === 401) {
            $this->refreshToken($account);
            $response = Http::withToken($account->access_token)->get(self::BASE_URL . '/sites');
        }

        if (!$response->successful()) {
            return [];
        }

        $data = $response->json();
        $sites = $data['siteEntry'] ?? [];
        $list = [];

        foreach ($sites as $site) {
            $list[] = [
                'url' => $site['siteUrl']
            ];
        }

        return $list;
    }

    public function getSearchAnalytics(ConnectedAccount $account, string $siteUrl, string $startDate, string $endDate): array
    {
        $response = $this->querySearchAnalytics($account, $siteUrl, $startDate, $endDate);

        if ($response->status() === 401) {
            $this->refreshToken($account);
            $response = $this->querySearchAnalytics($account, $siteUrl, $startDate, $endDate);
        }

        if (!$response->successful()) {
            throw new Exception("Error al obtener métricas de Google Search Console: " . $response->body());
        }

        return $response->json();
    }

    private function querySearchAnalytics(ConnectedAccount $account, string $siteUrl, string $startDate, string $endDate)
    {
        // El endpoint requiere el siteUrl encodeado
        $encodedUrl = urlencode($siteUrl);
        return Http::withToken($account->access_token)
            ->post(self::BASE_URL . "/sites/{$encodedUrl}/searchAnalytics/query", [
                'startDate' => $startDate,
                'endDate' => $endDate,
            ]);
    }

    private function refreshToken(ConnectedAccount $account): void
    {
        if (empty($account->refresh_token)) {
            throw new Exception("No hay refresh_token. El usuario {$account->user_id} requiere reautenticación.");
        }

        $response = Http::post('https://oauth2.googleapis.com/token', [
            'client_id' => config('services.google.client_id'),
            'client_secret' => config('services.google.client_secret'),
            'refresh_token' => $account->refresh_token,
            'grant_type' => 'refresh_token',
        ]);

        if (!$response->successful()) {
            throw new Exception("Fallo en el refresh OAuth de GSC: " . $response->body());
        }

        $data = $response->json();
        $account->update([
            'access_token' => $data['access_token'],
            'refresh_token' => $data['refresh_token'] ?? $account->refresh_token,
        ]);
    }
}
