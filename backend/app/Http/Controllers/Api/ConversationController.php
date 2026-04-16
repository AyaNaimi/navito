<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ConversationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $conversations = Conversation::query()
            ->with([
                'participants.roles',
                'participants.guideProfile.city',
                'participants.driverProfile.city',
                'latestMessage.sender',
            ])
            ->whereHas('participants', fn ($participants) => $participants->where('users.id', $user->id))
            ->orderByDesc('last_message_at')
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn (Conversation $conversation) => $this->serializeConversation($conversation, $user->id))
            ->values();

        return response()->json(['data' => $conversations]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validate([
            'participant_ids' => ['required', 'array', 'min:1'],
            'participant_ids.*' => ['integer', 'exists:users,id'],
            'title' => ['nullable', 'string', 'max:120'],
            'initial_message' => ['nullable', 'string'],
        ]);

        $participantIds = collect($validated['participant_ids'])
            ->push($user->id)
            ->unique()
            ->values();

        if ($participantIds->count() < 2) {
            return response()->json(['message' => 'A conversation needs at least two participants.'], 422);
        }

        $conversation = DB::transaction(function () use ($participantIds, $validated, $user): Conversation {
            if ($participantIds->count() === 2) {
                $otherId = $participantIds->first(fn (int $id) => $id !== $user->id);

                $existing = Conversation::query()
                    ->withCount('participants')
                    ->where('is_group', false)
                    ->whereHas('participants', fn ($participants) => $participants->where('users.id', $user->id))
                    ->whereHas('participants', fn ($participants) => $participants->where('users.id', $otherId))
                    ->having('participants_count', 2)
                    ->first();

                if ($existing) {
                    return $existing;
                }
            }

            $conversation = Conversation::create([
                'created_by' => $user->id,
                'title' => $validated['title'] ?? null,
                'is_group' => $participantIds->count() > 2,
                'last_message_at' => null,
            ]);

            $conversation->participants()->sync($participantIds->all());

            return $conversation;
        });

        if (! empty($validated['initial_message'])) {
            Message::create([
                'conversation_id' => $conversation->id,
                'user_id' => $user->id,
                'body' => $validated['initial_message'],
            ]);

            $conversation->forceFill(['last_message_at' => now()])->save();
        }

        $conversation->load([
            'participants.roles',
            'participants.guideProfile.city',
            'participants.driverProfile.city',
            'messages.sender',
            'latestMessage.sender',
        ]);

        return response()->json([
            'message' => 'Conversation created successfully.',
            'data' => $this->serializeConversation($conversation, $user->id, true),
        ], 201);
    }

    public function show(Request $request, Conversation $conversation): JsonResponse
    {
        $user = $request->user();
        $this->authorizeParticipant($conversation, $user->id);

        $conversation->load([
            'participants.roles',
            'participants.guideProfile.city',
            'participants.driverProfile.city',
            'messages.sender.roles',
            'latestMessage.sender',
        ]);

        return response()->json([
            'data' => $this->serializeConversation($conversation, $user->id, true),
        ]);
    }

    private function authorizeParticipant(Conversation $conversation, int $userId): void
    {
        abort_unless(
            $conversation->participants()->where('users.id', $userId)->exists(),
            403,
            'You cannot access this conversation.'
        );
    }

    private function serializeConversation(Conversation $conversation, int $userId, bool $includeMessages = false): array
    {
        $participants = $conversation->participants
            ->map(fn ($participant) => [
                'id' => $participant->id,
                'name' => $participant->name,
                'email' => $participant->email,
                'role' => $participant->primaryRole(),
                'city' => $participant->guideProfile?->city?->name ?? $participant->driverProfile?->city?->name,
            ])
            ->values();

        $others = $participants->filter(fn (array $participant) => $participant['id'] !== $userId)->values();

        return [
            'id' => $conversation->id,
            'title' => $conversation->title,
            'is_group' => $conversation->is_group,
            'last_message_at' => $conversation->last_message_at?->toIso8601String(),
            'participants' => $participants,
            'others' => $others,
            'latest_message' => $conversation->latestMessage ? [
                'id' => $conversation->latestMessage->id,
                'body' => $conversation->latestMessage->body,
                'created_at' => $conversation->latestMessage->created_at?->toIso8601String(),
                'sender' => [
                    'id' => $conversation->latestMessage->sender?->id,
                    'name' => $conversation->latestMessage->sender?->name,
                ],
            ] : null,
            'messages' => $includeMessages
                ? $conversation->messages
                    ->map(fn (Message $message) => [
                        'id' => $message->id,
                        'body' => $message->body,
                        'created_at' => $message->created_at?->toIso8601String(),
                        'sender' => [
                            'id' => $message->sender?->id,
                            'name' => $message->sender?->name,
                            'role' => $message->sender?->primaryRole(),
                        ],
                    ])
                    ->values()
                : [],
        ];
    }
}
