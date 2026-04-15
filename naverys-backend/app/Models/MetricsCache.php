<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MetricsCache extends Model
{
    protected $table = 'metrics_cache';

    protected $fillable = [
        'user_id',
        'provider',
        'metric_key',
        'metric_value',
        'recorded_at',
    ];

    protected function casts(): array
    {
        return [
            'metric_value' => 'array', // Para castear el campo JSON nativa a Array asociativo
            'recorded_at' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
