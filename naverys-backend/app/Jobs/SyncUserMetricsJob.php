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

class SyncUserMetricsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * @param User $user El usuario del sistema/tenant
     * @param string $propertyId El Property ID de GA4 que pertenece a este usuario
     */
    public function __construct(
        public User $user,
        public string $propertyId, 
    ) {
    }

    public function handle(SyncGoogleMetricsAction $syncAction): void
    {
        // Esto se ejecutará en background a través de cola de trabajos o cron worker.
        $syncAction->execute($this->user, $this->propertyId);
        
        // Futuro: Aquí mismo también se pueden correr las automatizaciones de PageSpeed/Meta
    }
}
