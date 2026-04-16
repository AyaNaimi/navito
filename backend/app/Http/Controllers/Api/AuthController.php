<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DriverProfile;
use App\Models\GuideProfile;
use App\Models\Role;
use App\Models\TouristProfile;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)],
            'role' => ['required', 'in:tourist,guide,driver,super_admin'],
            'preferred_language' => ['nullable', 'string', 'max:10'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'preferred_language' => $validated['preferred_language'] ?? 'fr',
            'status' => 'active',
        ]);

        $role = Role::query()->where('name', $validated['role'])->firstOrFail();
        $user->roles()->attach($role);
        $this->createProfileForRole($user, $role->name);

        return response()->json([
            'message' => 'Registration successful.',
            'token' => $user->createToken('navito-web')->plainTextToken,
            'user' => $this->serializeUser($user),
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'role' => ['nullable', 'in:tourist,guide,driver,super_admin'],
        ]);

        $user = User::query()
            ->with(['roles', 'touristProfile', 'guideProfile.city.country', 'driverProfile.city.country', 'lastCountry', 'lastCity.country'])
            ->where('email', $validated['email'])
            ->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials.'], 422);
        }

        if (isset($validated['role']) && ! $user->hasRole($validated['role'])) {
            return response()->json([
                'message' => 'This account does not have the selected role.',
                'roles' => $user->roles->pluck('name')->values(),
            ], 422);
        }

        $user->tokens()->delete();

        return response()->json([
            'message' => 'Login successful.',
            'token' => $user->createToken('navito-web')->plainTextToken,
            'user' => $this->serializeUser($user),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logout successful.']);
    }

    private function createProfileForRole(User $user, string $role): void
    {
        if ($role === 'tourist') {
            TouristProfile::firstOrCreate(['user_id' => $user->id]);
        }

        if ($role === 'guide') {
            GuideProfile::firstOrCreate(['user_id' => $user->id], ['status' => 'pending']);
        }

        if ($role === 'driver') {
            DriverProfile::firstOrCreate(['user_id' => $user->id], ['verification_status' => 'none']);
        }
    }

    private function serializeUser(User $user): array
    {
        $user->loadMissing(['roles', 'touristProfile', 'guideProfile.city.country', 'driverProfile.city.country', 'lastCountry', 'lastCity.country']);

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'preferred_language' => $user->preferred_language,
            'status' => $user->status,
            'last_country' => $user->lastCountry,
            'last_city' => $user->lastCity,
            'tourist_profile' => $user->touristProfile,
            'guide_profile' => $user->guideProfile,
            'driver_profile' => $user->driverProfile,
            ...$user->rolePayload(),
        ];
    }
}
