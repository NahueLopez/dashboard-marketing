<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Actions\Metrics\SyncGoogleMetricsAction;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class FetchGoogleMetricsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public readonly User $user
    ) {}

    public function handle(SyncGoogleMetricsAction $action): void
    {
        $action->execute($this->user);
    }
}
