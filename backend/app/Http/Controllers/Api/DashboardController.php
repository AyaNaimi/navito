<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\CommunityEvent;
use App\Models\DriverRequest;
use App\Models\GuideRequest;
use App\Models\Place;
use App\Models\Restaurant;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user()->load(['roles', 'guideProfile', 'driverProfile', 'touristProfile']);
        $role = $user->primaryRole();

        $payload = match ($role) {
            'super_admin' => [
                'role' => $role,
                'stats' => [
                    'users' => User::count(),
                    'places' => Place::count(),
                    'activities' => Activity::count(),
                    'restaurants' => Restaurant::count(),
                    'community_events' => CommunityEvent::count(),
                    'pending_guide_requests' => GuideRequest::where('status', 'pending')->count(),
                ],
            ],
            'guide' => [
                'role' => $role,
                'profile_status' => $user->guideProfile?->status,
                'requests' => GuideRequest::with(['tourist', 'city.country'])
                    ->where('guide_id', $user->id)
                    ->latest()
                    ->get(),
            ],
            'driver' => [
                'role' => $role,
                'verification_status' => $user->driverProfile?->verification_status,
                'profile' => $user->driverProfile,
                'requests' => DriverRequest::with(['tourist', 'city.country'])
                    ->where('driver_id', $user->id)
                    ->latest()
                    ->get(),
            ],
            default => [
                'role' => 'tourist',
                'guide_requests' => GuideRequest::with(['guide', 'city.country'])
                    ->where('tourist_id', $user->id)
                    ->latest()
                    ->get(),
                'driver_requests' => DriverRequest::with(['driver', 'city.country'])
                    ->where('tourist_id', $user->id)
                    ->latest()
                    ->get(),
                'favorites_count' => $user->favorites()->count(),
                'community_events_count' => CommunityEvent::count(),
            ],
        };

        return response()->json(['data' => $payload]);
    }
}
