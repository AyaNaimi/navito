<?php

use App\Http\Controllers\Api\ActivityController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CityController;
use App\Http\Controllers\Api\CommunityEventController;
use App\Http\Controllers\Api\CountryController;
use App\Http\Controllers\Api\ConversationController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DirectoryController;
use App\Http\Controllers\Api\DetectLocationController;
use App\Http\Controllers\Api\DriverRequestController;
use App\Http\Controllers\Api\EmergencyContactController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\GuideRequestController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\OcrController;
use App\Http\Controllers\Api\PlaceController;
use App\Http\Controllers\Api\PriceEstimationController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\RestaurantController;
use App\Http\Controllers\Api\ScamReportController;
use App\Http\Controllers\Api\TranslationController;
use App\Http\Controllers\Api\TransportFareController;
use Illuminate\Support\Facades\Route;

$registerCrudRoutes = function (string $uri, string $controller): void {
    Route::get($uri, [$controller, 'index']);
    Route::get($uri.'/{id}', [$controller, 'show']);
};

$registerProtectedCrudRoutes = function (string $uri, string $controller): void {
    Route::post($uri, [$controller, 'store']);
    Route::put($uri.'/{id}', [$controller, 'update']);
    Route::patch($uri.'/{id}', [$controller, 'update']);
    Route::delete($uri.'/{id}', [$controller, 'destroy']);
};

Route::get('/health', fn () => ['status' => 'ok', 'app' => config('app.name')]);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/detect-location', [DetectLocationController::class, 'detect']);
Route::get('/directory/guides', [DirectoryController::class, 'guides']);
Route::get('/directory/drivers', [DirectoryController::class, 'drivers']);

Route::post('/translate', [TranslationController::class, 'translate']);
Route::post('/detect-language', [TranslationController::class, 'detectLanguage']);
Route::get('/languages', [TranslationController::class, 'supportedLanguages']);

Route::post('/ocr/extract', [OcrController::class, 'extractText']);
Route::post('/ocr/detect-language', [OcrController::class, 'detectLanguage']);

Route::post('/price/estimate', [PriceEstimationController::class, 'estimate']);
Route::post('/price/estimate-image', [PriceEstimationController::class, 'estimateImage']);
Route::post('/price/check', [PriceEstimationController::class, 'checkPrice']);
Route::get('/price/reference', [PriceEstimationController::class, 'referencePrices']);
Route::get('/price/transport-fares', [PriceEstimationController::class, 'transportFares']);

$registerCrudRoutes('countries', CountryController::class);
$registerCrudRoutes('cities', CityController::class);
$registerCrudRoutes('places', PlaceController::class);
$registerCrudRoutes('activities', ActivityController::class);
$registerCrudRoutes('restaurants', RestaurantController::class);
$registerCrudRoutes('transport-fares', TransportFareController::class);
$registerCrudRoutes('emergency-contacts', EmergencyContactController::class);
$registerCrudRoutes('scam-reports', ScamReportController::class);
Route::apiResource('community-events', CommunityEventController::class)->only(['index', 'show']);

Route::middleware('auth:sanctum')->group(function () use ($registerProtectedCrudRoutes): void {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [ProfileController::class, 'me']);
    Route::put('/me', [ProfileController::class, 'update']);
    Route::get('/me/dashboard', [DashboardController::class, 'show']);
    Route::post('/detect-location/authenticated', [DetectLocationController::class, 'store']);

    Route::apiResource('guide-requests', GuideRequestController::class);
    Route::apiResource('driver-requests', DriverRequestController::class);
    Route::get('/directory/users', [DirectoryController::class, 'users']);
    Route::get('/conversations', [ConversationController::class, 'index']);
    Route::post('/conversations', [ConversationController::class, 'store']);
    Route::get('/conversations/{conversation}', [ConversationController::class, 'show']);
    Route::post('/conversations/{conversation}/messages', [MessageController::class, 'store']);
    Route::apiResource('favorites', FavoriteController::class)->except(['create', 'edit']);

    Route::middleware('role:super_admin')->group(function () use ($registerProtectedCrudRoutes): void {
        $registerProtectedCrudRoutes('countries', CountryController::class);
        $registerProtectedCrudRoutes('cities', CityController::class);
        $registerProtectedCrudRoutes('places', PlaceController::class);
        $registerProtectedCrudRoutes('activities', ActivityController::class);
        $registerProtectedCrudRoutes('restaurants', RestaurantController::class);
        $registerProtectedCrudRoutes('transport-fares', TransportFareController::class);
        $registerProtectedCrudRoutes('emergency-contacts', EmergencyContactController::class);
        $registerProtectedCrudRoutes('scam-reports', ScamReportController::class);
    });

    Route::middleware('role:super_admin,guide,tourist')->group(function (): void {
        Route::apiResource('community-events', CommunityEventController::class)->except(['index', 'show']);
    });
});
