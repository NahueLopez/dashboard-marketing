<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$m = app(App\Actions\Metrics\GetDashboardMetricsAction::class)->execute(App\Models\User::find(2));
file_put_contents('tmp_payload.txt', json_encode($m, JSON_PRETTY_PRINT));
echo "DONE";
