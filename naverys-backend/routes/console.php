<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Models\User;
use App\Jobs\FetchGoogleMetricsJob;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Schedule::call(function () {
    $users = User::whereHas('connectedAccounts', function ($query) {
        $query->where('provider', 'google');
    })->get();

    foreach ($users as $user) {
        FetchGoogleMetricsJob::dispatch($user);
    }
})->dailyAt('02:00');
