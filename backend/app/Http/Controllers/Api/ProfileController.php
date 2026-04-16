<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function me(Request $request): JsonResponse
    {
        $user = $request->user()->load([
            'roles',
            'touristProfile',
            'guideProfile.city.country',
            'driverProfile.city.country',
            'lastCountry',
            'lastCity.country',
        ]);

        return response()->json([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status,
                'preferred_language' => $user->preferred_language,
                'last_country' => $user->lastCountry,
                'last_city' => $user->lastCity,
                'tourist_profile' => $user->touristProfile,
                'guide_profile' => $user->guideProfile,
                'driver_profile' => $user->driverProfile,
                ...$user->rolePayload(),
            ],
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->user()->load(['roles', 'touristProfile', 'guideProfile', 'driverProfile']);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:120'],
            'preferred_language' => ['sometimes', 'string', 'max:10'],
            'last_country_id' => ['nullable', 'exists:countries,id'],
            'last_city_id' => ['nullable', 'exists:cities,id'],
            'tourist_profile.nationality' => ['nullable', 'string', 'max:120'],
            'tourist_profile.passport_country' => ['nullable', 'string', 'max:120'],
            'tourist_profile.phone' => ['nullable', 'string', 'max:30'],
            'guide_profile.city_id' => ['nullable', 'exists:cities,id'],
            'guide_profile.phone' => ['nullable', 'string', 'max:30'],
            'guide_profile.bio' => ['nullable', 'string'],
            'driver_profile.city_id' => ['nullable', 'exists:cities,id'],
            'driver_profile.phone' => ['nullable', 'string', 'max:30'],
            'driver_profile.vehicle_type' => ['nullable', 'string', 'max:80'],
            'driver_profile.vehicle_registration' => ['nullable', 'string', 'max:60'],
            'driver_profile.verification_status' => ['nullable', 'in:none,documents_pending,pending,verified,rejected'],
        ]);

        $user->fill($validated);
        $user->save();

        if (isset($validated['tourist_profile']) && $user->touristProfile) {
            $user->touristProfile->update($validated['tourist_profile']);
        }

        if (isset($validated['guide_profile']) && $user->guideProfile) {
            $user->guideProfile->update($validated['guide_profile']);
        }

        if (isset($validated['driver_profile']) && $user->driverProfile) {
            $user->driverProfile->update($validated['driver_profile']);
        }

        return $this->me($request);
    }
}
