<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\GuideRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GuideRequestController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user()->load('roles');
        $query = GuideRequest::query()->with(['tourist', 'guide', 'city.country']);

        if ($user->hasRole('guide')) {
            $query->where('guide_id', $user->id);
        } elseif (! $user->hasRole('super_admin')) {
            $query->where('tourist_id', $user->id);
        }

        return response()->json(['data' => $query->latest()->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user()->load('roles');

        if (! $user->hasAnyRole(['tourist', 'super_admin'])) {
            return response()->json(['message' => 'Only tourists can create guide requests.'], 403);
        }

        $validated = $request->validate([
            'guide_id' => ['required', 'exists:users,id'],
            'city_id' => ['required', 'exists:cities,id'],
            'travel_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
            'status' => ['nullable', 'in:pending,accepted,declined,completed,cancelled'],
        ]);

        $guideRequest = GuideRequest::create([
            ...$validated,
            'tourist_id' => $user->id,
            'status' => $validated['status'] ?? 'pending',
        ]);

        return response()->json([
            'message' => 'Guide request created successfully.',
            'data' => $guideRequest->load(['tourist', 'guide', 'city.country']),
        ], 201);
    }

    public function show(GuideRequest $guideRequest): JsonResponse
    {
        return response()->json(['data' => $guideRequest->load(['tourist', 'guide', 'city.country'])]);
    }

    public function update(Request $request, GuideRequest $guideRequest): JsonResponse
    {
        $user = $request->user()->load('roles');

        if (! $user->hasRole('super_admin') && $guideRequest->tourist_id !== $user->id && $guideRequest->guide_id !== $user->id) {
            return response()->json(['message' => 'You cannot update this guide request.'], 403);
        }

        $validated = $request->validate([
            'city_id' => ['sometimes', 'exists:cities,id'],
            'travel_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
            'status' => ['sometimes', 'in:pending,accepted,declined,completed,cancelled'],
        ]);

        $guideRequest->update($validated);

        if (($validated['status'] ?? null) === 'accepted') {
            $conversation = Conversation::query()
                ->withCount('participants')
                ->where('is_group', false)
                ->whereHas('participants', fn ($participants) => $participants->where('users.id', $guideRequest->tourist_id))
                ->whereHas('participants', fn ($participants) => $participants->where('users.id', $guideRequest->guide_id))
                ->having('participants_count', 2)
                ->first();

            if (! $conversation) {
                $conversation = Conversation::create([
                    'created_by' => $user->id,
                    'title' => null,
                    'is_group' => false,
                    'last_message_at' => null,
                ]);
                $conversation->participants()->sync([$guideRequest->tourist_id, $guideRequest->guide_id]);
            }
        }

        return response()->json([
            'message' => 'Guide request updated successfully.',
            'data' => $guideRequest->load(['tourist', 'guide', 'city.country']),
        ]);
    }

    public function destroy(Request $request, GuideRequest $guideRequest): JsonResponse
    {
        $user = $request->user()->load('roles');

        if (! $user->hasRole('super_admin') && $guideRequest->tourist_id !== $user->id) {
            return response()->json(['message' => 'You cannot delete this guide request.'], 403);
        }

        $guideRequest->delete();

        return response()->json(['message' => 'Guide request deleted successfully.']);
    }
}
