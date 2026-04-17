<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\ConnectedAccount;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class GoogleAnalyticsService
{
    private const BASE_URL = 'https://analyticsdata.googleapis.com/v1beta';
    private const ADMIN_API_URL = 'https://analyticsadmin.googleapis.com/v1beta';

    public function getFirstPropertyId(ConnectedAccount $account): ?array
    {
        $response = Http::timeout(10)->withToken($account->access_token)
            ->get(self::ADMIN_API_URL . '/accountSummaries');

        if ($response->status() === 401) {
            $this->refreshToken($account);
            $response = Http::timeout(10)->withToken($account->access_token)
                ->get(self::ADMIN_API_URL . '/accountSummaries');
        }

        if (!$response->successful()) {
            throw new Exception("Error al obtener properties de GA4 Admin API: " . $response->body());
        }

        $data = $response->json();
        $summaries = $data['accountSummaries'] ?? [];
        
        foreach ($summaries as $summary) {
            $properties = $summary['propertySummaries'] ?? [];
            foreach ($properties as $property) {
                return [
                    'id' => str_replace('properties/', '', $property['property']),
                    'name' => $property['displayName'] ?? 'Sitio Web Desconocido',
                ];
            }
        }

        return null;
    }

    public function getAllProperties(ConnectedAccount $account): array
    {
        $response = Http::timeout(10)->withToken($account->access_token)->get(self::ADMIN_API_URL . '/accountSummaries');

        if ($response->status() === 401) {
            $this->refreshToken($account);
            $response = Http::timeout(10)->withToken($account->access_token)->get(self::ADMIN_API_URL . '/accountSummaries');
        }

        if (!$response->successful()) { return []; }

        $list = [];
        $data = $response->json();
        foreach (($data['accountSummaries'] ?? []) as $summary) {
            foreach (($summary['propertySummaries'] ?? []) as $property) {
                $list[] = [
                    'id' => str_replace('properties/', '', $property['property']),
                    'name' => $property['displayName'] ?? 'Sitio Web Desconocido',
                ];
            }
        }
        return $list;
    }

    public function getVisitsAndSessions(ConnectedAccount $account, string $propertyId, string $startDate = '30daysAgo', string $endDate = 'today'): array
    {
        // 1. Intentar hacer la petición con el access token guardado
        $response = $this->makeRequest($account, $propertyId, $startDate, $endDate);

        // 2. Si Google devuelve 401 Unauthorized, el token probablemente expiró
        if ($response->status() === 401) {
            Log::info("Access Token expirado para usuario ID {$account->user_id}. Refrescando token con refresh_token...");
            $this->refreshToken($account);
            
            // 3. Reintentar petición con el token fresco
            $response = $this->makeRequest($account, $propertyId, $startDate, $endDate);
        }

        if (!$response->successful()) {
            throw new Exception("Error al obtener métricas de Google Analytics (GA4): " . $response->body());
        }

        return $response->json();
    }

    public function getWeeklyTimeline(ConnectedAccount $account, string $propertyId): array
    {
        $startDate = '6daysAgo'; // Incluye hoy (7 días en total)
        $endDate = 'today';

        $response = $this->makeTimelineRequest($account, $propertyId, $startDate, $endDate);

        if ($response->status() === 401) {
            $this->refreshToken($account);
            $response = $this->makeTimelineRequest($account, $propertyId, $startDate, $endDate);
        }

        if (!$response->successful()) {
            throw new Exception("Error al obtener timeline de Google Analytics: " . $response->body());
        }

        return $response->json();
    }

    private function makeRequest(ConnectedAccount $account, string $propertyId, string $startDate, string $endDate)
    {
        // Petición nativa a la Data API de GA4 usando Http Client
        return Http::timeout(10)->withToken($account->access_token)
            ->post(self::BASE_URL . "/properties/{$propertyId}:runReport", [
                'dateRanges' => [
                    ['startDate' => $startDate, 'endDate' => $endDate],
                ],
                'metrics' => [
                    ['name' => 'sessions'],
                    ['name' => 'totalUsers'],
                    ['name' => 'newUsers'],
                    ['name' => 'screenPageViews'],
                ],
            ]);
    }

    private function makeTimelineRequest(ConnectedAccount $account, string $propertyId, string $startDate, string $endDate)
    {
        return Http::timeout(10)->withToken($account->access_token)
            ->post(self::BASE_URL . "/properties/{$propertyId}:runReport", [
                'dateRanges' => [
                    ['startDate' => $startDate, 'endDate' => $endDate],
                ],
                'dimensions' => [
                    ['name' => 'date'],
                ],
                'metrics' => [
                    ['name' => 'sessions'],
                    ['name' => 'totalUsers'],
                ],
            ]);
    }

    private function refreshToken(ConnectedAccount $account): void
    {
        if (empty($account->refresh_token)) {
            throw new Exception("No hay refresh_token guardado para el usuario ID {$account->user_id}. El usuario debe volver a hacer login.");
        }

        $response = Http::timeout(10)->post('https://oauth2.googleapis.com/token', [
            'client_id' => config('services.google.client_id'),
            'client_secret' => config('services.google.client_secret'),
            'refresh_token' => $account->refresh_token,
            'grant_type' => 'refresh_token',
        ]);

        if (!$response->successful()) {
            throw new Exception("No se pudo refrescar el token de Google OAuth: " . $response->body());
        }

        $data = $response->json();

        // 4. Guardar el nuevo access token en la base de datos
        // Si no devuelve un nuevo refresh token, conservamos el antiguo
        $account->update([
            'access_token' => $data['access_token'],
            'refresh_token' => $data['refresh_token'] ?? $account->refresh_token,
        ]);
    }
}
