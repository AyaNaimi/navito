<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PriceEstimateController;
use App\Http\Controllers\TranslateController;

Route::post('/price-estimate', [PriceEstimateController::class, 'estimate']);
Route::post('/translate', [TranslateController::class, 'translate']);

