<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CommunityEvent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommunityEventController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = CommunityEvent::query()->with(['organizer', 'city.country', 'participants']);

        if ($request->filled('city_id')) {
            $query->where('city_id', $request->integer('city_id'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        return response()->json(['data' => $query->latest('starts_at')->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'city_id' => ['required', 'exists:cities,id'],
            'title' => ['required', 'string', 'max:180'],
            'description' => ['required', 'string'],
            'meetup_point' => ['nullable', 'string', 'max:255'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'min_participants' => ['nullable', 'integer', 'min:1'],
            'max_participants' => ['nullable', 'integer', 'min:1'],
            'level' => ['nullable', 'in:beginner,intermediate,sporty'],
            'status' => ['nullable', 'in:open,full,cancelled,completed'],
        ]);

        $event = CommunityEvent::create([
            ...$validated,
            'organizer_id' => $request->user()->id,
            'min_participants' => $validated['min_participants'] ?? 1,
            'max_participants' => $validated['max_participants'] ?? 10,
            'level' => $validated['level'] ?? 'beginner',
            'status' => $validated['status'] ?? 'open',
        ]);

        $event->participants()->syncWithoutDetaching([$request->user()->id => ['joined_at' => now()]]);

        return response()->json([
            'message' => 'Community event created successfully.',
            'data' => $event->load(['organizer', 'city.country', 'participants']),
        ], 201);
    }

    public function show(CommunityEvent $communityEvent): JsonResponse
    {
        return response()->json(['data' => $communityEvent->load(['organizer', 'city.country', 'participants'])]);
    }

    public function update(Request $request, CommunityEvent $communityEvent): JsonResponse
    {
        $user = $request->user()->load('roles');

        if (! $user->hasRole('super_admin') && $communityEvent->organizer_id !== $user->id) {
            return response()->json(['message' => 'You cannot update this community event.'], 403);
        }

        $validated = $request->validate([
            'city_id' => ['sometimes', 'exists:cities,id'],
            'title' => ['sometimes', 'string', 'max:180'],
            'description' => ['sometimes', 'string'],
            'meetup_point' => ['nullable', 'string', 'max:255'],
            'starts_at' => ['sometimes', 'date'],
            'ends_at' => ['nullable', 'date'],
            'min_participants' => ['nullable', 'integer', 'min:1'],
            'max_participants' => ['nullable', 'integer', 'min:1'],
            'level' => ['nullable', 'in:beginner,intermediate,sporty'],
            'status' => ['nullable', 'in:open,full,cancelled,completed'],
        ]);

        $communityEvent->update($validated);

        return response()->json([
            'message' => 'Community event updated successfully.',
            'data' => $communityEvent->load(['organizer', 'city.country', 'participants']),
        ]);
    }

    public function destroy(Request $request, CommunityEvent $communityEvent): JsonResponse
    {
        $user = $request->user()->load('roles');

        if (! $user->hasRole('super_admin') && $communityEvent->organizer_id !== $user->id) {
            return response()->json(['message' => 'You cannot delete this community event.'], 403);
        }

        $communityEvent->delete();

        return response()->json(['message' => 'Community event deleted successfully.']);
    }
}
