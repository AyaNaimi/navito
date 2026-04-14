<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PriceEstimateController;
use App\Http\Controllers\TranslateController;
use App\Http\Controllers\OCRController;

// ── Price Estimation (full pipeline) ────────────────────────
Route::post('/estimate',      [PriceEstimateController::class, 'estimate']);
Route::post('/report-price',  [PriceEstimateController::class, 'reportPrice']);

// Legacy (kept for backward compat)
Route::post('/price-estimate', [PriceEstimateController::class, 'estimate']);

Route::post('/translate', [TranslateController::class, 'translate']);
Route::post('/ocr',       [OCRController::class, 'process']);

// Health check
Route::get('/health', fn () => response()->json(['status' => 'ok', 'timestamp' => now()]));

