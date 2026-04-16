<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'data' => Favorite::query()->where('user_id', $request->user()->id)->latest()->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'favoritable_type' => ['required', 'string', 'max:100'],
            'favoritable_id' => ['required', 'integer'],
        ]);

        $favorite = Favorite::firstOrCreate([
            'user_id' => $request->user()->id,
            'favoritable_type' => $validated['favoritable_type'],
            'favoritable_id' => $validated['favoritable_id'],
        ]);

        return response()->json([
            'message' => 'Favorite saved successfully.',
            'data' => $favorite,
        ], 201);
    }

    public function show(Favorite $favorite): JsonResponse
    {
        return response()->json(['data' => $favorite]);
    }

    public function update(Request $request, Favorite $favorite): JsonResponse
    {
        return response()->json([
            'message' => 'Favorites are immutable. Remove and recreate if needed.',
            'data' => $favorite,
        ]);
    }

    public function destroy(Request $request, Favorite $favorite): JsonResponse
    {
        if ($favorite->user_id !== $request->user()->id) {
            return response()->json(['message' => 'You cannot delete this favorite.'], 403);
        }

        $favorite->delete();

        return response()->json(['message' => 'Favorite deleted successfully.']);
    }
}
