<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DirectoryController extends Controller
{
    public function users(Request $request): JsonResponse
    {
        $search = $request->string('search')->toString();

        $query = User::query()->with(['roles', 'guideProfile.city', 'driverProfile.city']);

        if ($request->user()) {
            $query->whereKeyNot($request->user()->id);
        }

        if ($search !== '') {
            $query->where(function ($builder) use ($search): void {
                $builder
                    ->where('name', 'like', '%'.$search.'%')
                    ->orWhere('email', 'like', '%'.$search.'%');
            });
        }

        $users = $query
            ->orderBy('name')
            ->limit(25)
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->primaryRole(),
                'city' => $user->guideProfile?->city?->name ?? $user->driverProfile?->city?->name,
            ])
            ->values();

        return response()->json(['data' => $users]);
    }

    public function guides(Request $request): JsonResponse
    {
        $city = $request->string('city')->toString();

        $query = User::query()
            ->with(['roles', 'guideProfile.city'])
            ->whereHas('roles', fn ($roles) => $roles->where('name', 'guide'))
            ->whereHas('guideProfile', fn ($guideProfile) => $guideProfile->where('status', 'approved'));

        if ($city !== '') {
            $query->whereHas('guideProfile.city', fn ($cities) => $cities->where('name', $city));
        }

        $guides = $query
            ->orderBy('name')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->primaryRole(),
                'city' => $user->guideProfile?->city?->name,
                'phone' => $user->guideProfile?->phone,
                'bio' => $user->guideProfile?->bio,
                'status' => $user->guideProfile?->status,
                'verified' => $user->guideProfile?->status === 'approved',
            ])
            ->values();

        return response()->json(['data' => $guides]);
    }

    public function drivers(Request $request): JsonResponse
    {
        $city = $request->string('city')->toString();

        $query = User::query()
            ->with(['roles', 'driverProfile.city'])
            ->whereHas('roles', fn ($roles) => $roles->where('name', 'driver'))
            ->whereHas('driverProfile', fn ($driverProfile) => $driverProfile->where('verification_status', 'verified'));

        if ($city !== '') {
            $query->whereHas('driverProfile.city', fn ($cities) => $cities->where('name', $city));
        }

        $drivers = $query
            ->orderBy('name')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->primaryRole(),
                'city' => $user->driverProfile?->city?->name,
                'phone' => $user->driverProfile?->phone,
                'vehicle_type' => $user->driverProfile?->vehicle_type,
                'vehicle_registration' => $user->driverProfile?->vehicle_registration,
                'verification_status' => $user->driverProfile?->verification_status,
                'verified' => $user->driverProfile?->verification_status === 'verified',
            ])
            ->values();

        return response()->json(['data' => $drivers]);
    }
}
