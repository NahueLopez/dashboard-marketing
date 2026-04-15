<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$cache = App\Models\MetricsCache::where('provider', 'meta')->get()->toArray();
file_put_contents('tmp_cache.txt', json_encode($cache, JSON_PRETTY_PRINT));
echo "DONE";
