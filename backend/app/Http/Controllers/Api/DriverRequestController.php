<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\DriverRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DriverRequestController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user()->load('roles');
        $query = DriverRequest::query()->with(['tourist', 'driver', 'city.country']);

        if ($user->hasRole('driver')) {
            $query->where('driver_id', $user->id);
        } elseif (! $user->hasRole('super_admin')) {
            $query->where('tourist_id', $user->id);
        }

        return response()->json(['data' => $query->latest()->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user()->load('roles');

        if (! $user->hasAnyRole(['tourist', 'super_admin'])) {
            return response()->json(['message' => 'Only tourists can create driver requests.'], 403);
        }

        $validated = $request->validate([
            'driver_id' => ['required', 'exists:users,id'],
            'city_id' => ['required', 'exists:cities,id'],
            'pickup_location' => ['required', 'string', 'max:190'],
            'destination' => ['nullable', 'string', 'max:190'],
            'travel_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
            'status' => ['nullable', 'in:pending,accepted,declined,completed,cancelled'],
        ]);

        $driverRequest = DriverRequest::create([
            ...$validated,
            'tourist_id' => $user->id,
            'status' => $validated['status'] ?? 'pending',
        ]);

        return response()->json([
            'message' => 'Driver request created successfully.',
            'data' => $driverRequest->load(['tourist', 'driver', 'city.country']),
        ], 201);
    }

    public function show(DriverRequest $driverRequest): JsonResponse
    {
        return response()->json(['data' => $driverRequest->load(['tourist', 'driver', 'city.country'])]);
    }

    public function update(Request $request, DriverRequest $driverRequest): JsonResponse
    {
        $user = $request->user()->load('roles');

        if (! $user->hasRole('super_admin') && $driverRequest->tourist_id !== $user->id && $driverRequest->driver_id !== $user->id) {
            return response()->json(['message' => 'You cannot update this driver request.'], 403);
        }

        $validated = $request->validate([
            'city_id' => ['sometimes', 'exists:cities,id'],
            'pickup_location' => ['sometimes', 'string', 'max:190'],
            'destination' => ['nullable', 'string', 'max:190'],
            'travel_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
            'status' => ['sometimes', 'in:pending,accepted,declined,completed,cancelled'],
        ]);

        $driverRequest->update($validated);

        if (($validated['status'] ?? null) === 'accepted') {
            $conversation = Conversation::query()
                ->withCount('participants')
                ->where('is_group', false)
                ->whereHas('participants', fn ($participants) => $participants->where('users.id', $driverRequest->tourist_id))
                ->whereHas('participants', fn ($participants) => $participants->where('users.id', $driverRequest->driver_id))
                ->having('participants_count', 2)
                ->first();

            if (! $conversation) {
                $conversation = Conversation::create([
                    'created_by' => $user->id,
                    'title' => null,
                    'is_group' => false,
                    'last_message_at' => null,
                ]);
                $conversation->participants()->sync([$driverRequest->tourist_id, $driverRequest->driver_id]);
            }
        }

        return response()->json([
            'message' => 'Driver request updated successfully.',
            'data' => $driverRequest->load(['tourist', 'driver', 'city.country']),
        ]);
    }

    public function destroy(Request $request, DriverRequest $driverRequest): JsonResponse
    {
        $user = $request->user()->load('roles');

        if (! $user->hasRole('super_admin') && $driverRequest->tourist_id !== $user->id) {
            return response()->json(['message' => 'You cannot delete this driver request.'], 403);
        }

        $driverRequest->delete();

        return response()->json(['message' => 'Driver request deleted successfully.']);
    }
}
