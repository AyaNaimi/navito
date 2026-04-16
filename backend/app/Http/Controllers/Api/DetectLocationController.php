<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\TouristProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DetectLocationController extends Controller
{
    public function detect(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'latitude' => ['required', 'numeric'],
            'longitude' => ['required', 'numeric'],
        ]);

        $city = $this->nearestCity((float) $validated['latitude'], (float) $validated['longitude']);

        return response()->json([
            'data' => [
                'latitude' => (float) $validated['latitude'],
                'longitude' => (float) $validated['longitude'],
                'city' => $city,
                'country' => $city?->country,
                'is_supported' => (bool) $city?->is_supported,
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'latitude' => ['required', 'numeric'],
            'longitude' => ['required', 'numeric'],
        ]);

        $user = $request->user();
        $city = $this->nearestCity((float) $validated['latitude'], (float) $validated['longitude']);

        TouristProfile::query()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'current_latitude' => $validated['latitude'],
                'current_longitude' => $validated['longitude'],
                'detected_country_id' => $city?->country_id,
                'detected_city_id' => $city?->id,
            ]
        );

        $user->update([
            'last_country_id' => $city?->country_id,
            'last_city_id' => $city?->id,
        ]);

        return $this->detect($request);
    }

    private function nearestCity(float $latitude, float $longitude): ?City
    {
        return City::query()
            ->with('country')
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->orderByRaw('(POW(latitude - ?, 2) + POW(longitude - ?, 2)) asc', [$latitude, $longitude])
            ->first();
    }
}
