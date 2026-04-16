<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function store(Request $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user();

        abort_unless(
            $conversation->participants()->where('users.id', $user->id)->exists(),
            403,
            'You cannot send messages to this conversation.'
        );

        $validated = $request->validate([
            'body' => ['required', 'string'],
        ]);

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'user_id' => $user->id,
            'body' => $validated['body'],
        ]);

        $conversation->forceFill(['last_message_at' => now()])->save();
        $message->load('sender.roles');

        return response()->json([
            'message' => 'Message sent successfully.',
            'data' => [
                'id' => $message->id,
                'body' => $message->body,
                'created_at' => $message->created_at?->toIso8601String(),
                'sender' => [
                    'id' => $message->sender?->id,
                    'name' => $message->sender?->name,
                    'role' => $message->sender?->primaryRole(),
                ],
            ],
        ], 201);
    }
}
