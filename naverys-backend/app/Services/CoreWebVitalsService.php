<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Exception;

class CoreWebVitalsService
{
    private const BASE_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

    public function getMetricsForUrl(string $url, string $strategy = 'mobile'): array
    {
        // La API de PageSpeed Insights no requiere token OAuth del usuario
        // Funciona perfectamente para URLs públicas.
        $response = Http::get(self::BASE_URL, [
            'url' => $url,
            'strategy' => $strategy,
            'category' => 'performance',
            // Opcional: 'key' => config('services.google.api_key') si se sufren rate limits.
        ]);

        if (!$response->successful()) {
            throw new Exception("Error obteniendo Core Web Vitals para la URL {$url}: " . $response->body());
        }

        return $response->json();
    }
}
