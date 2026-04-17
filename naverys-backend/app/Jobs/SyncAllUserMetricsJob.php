<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\User;
use App\Actions\Metrics\SyncGoogleMetricsAction;
use App\Actions\Metrics\SyncMetaMetricsAction;
use App\Actions\Metrics\SyncSearchConsoleMetricsAction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SyncAllUserMetricsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(private readonly User $user)
    {
    }

    public function handle(
        SyncGoogleMetricsAction $google,
        SyncMetaMetricsAction $meta,
        SyncSearchConsoleMetricsAction $seo
    ): void {
        $google->execute($this->user);
        $meta->execute($this->user);
        $seo->execute($this->user);
    }
}
