<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\ConnectedAccount;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class MetaAdsService
{
    private const GRAPH_API_URL = 'https://graph.facebook.com/v19.0';

    public function getAllAdAccounts(ConnectedAccount $account): array
    {
        $response = Http::get(self::GRAPH_API_URL . '/me/adaccounts', [
            'fields' => 'name,account_id,account_status',
            'access_token' => $account->access_token,
        ]);

        if (!$response->successful()) {
            Log::error('Meta Graph API Error: ' . $response->body());
            return [];
        }

        $list = [];
        $data = $response->json();
        foreach (($data['data'] ?? []) as $adAccount) {
            // Only add active Ad Accounts (status = 1) or just return all? We'll return all
            $list[] = [
                'id' => $adAccount['account_id'],
                'name' => $adAccount['name'] ?? 'Ad Account ' . $adAccount['account_id'],
                'status' => $adAccount['account_status'] ?? 0,
            ];
        }
        return $list;
    }

    public function getAccountInsights(ConnectedAccount $account, string $accountId, string $datePreset = 'last_30d'): array
    {
        // Account ID passed to graph API needs 'act_' prefix if not already present
        $actId = str_starts_with($accountId, 'act_') ? $accountId : 'act_' . $accountId;

        $response = Http::get(self::GRAPH_API_URL . "/{$actId}/insights", [
            'level' => 'account',
            'fields' => 'spend,impressions,clicks,cpc,cpm,actions',
            'date_preset' => $datePreset,
            'access_token' => $account->access_token,
        ]);

        if (!$response->successful()) {
            throw new Exception("Error al obtener métricas de Meta Ads: " . $response->body());
        }

        $data = $response->json()['data'] ?? [];
        if (empty($data)) {
            return [
                'spend' => 0,
                'impressions' => 0,
                'clicks' => 0,
                'cpc' => 0,
                'cpm' => 0,
                'leads' => 0,
            ];
        }

        $row = $data[0];
        
        $leads = 0;
        foreach (($row['actions'] ?? []) as $action) {
            if ($action['action_type'] === 'lead') {
                $leads = (int) $action['value'];
                break;
            }
        }

        return [
            'spend' => (float) ($row['spend'] ?? 0),
            'impressions' => (int) ($row['impressions'] ?? 0),
            'clicks' => (int) ($row['clicks'] ?? 0),
            'cpc' => (float) ($row['cpc'] ?? 0),
            'cpm' => (float) ($row['cpm'] ?? 0),
            'leads' => $leads,
        ];
    }
}
