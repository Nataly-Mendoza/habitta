<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ConversationResource;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ConversationController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $userId = $request->user()->id;

        $conversations = Conversation::with(['property.images', 'inquirer', 'owner', 'lastMessage'])
            ->where(function ($q) use ($userId) {
                $q->where('inquirer_id', $userId)
                  ->orWhere('owner_id', $userId);
            })
            ->latest()
            ->paginate(20);

        return ConversationResource::collection($conversations);
    }

    public function start(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'property_id'    => 'required|exists:properties,id',
            'initial_message' => 'required|string|max:1000',
        ]);

        $property = Property::findOrFail($validated['property_id']);
        $userId   = $request->user()->id;

        if ($property->user_id === $userId) {
            return response()->json(['message' => 'No puedes contactarte contigo mismo.'], 422);
        }

        $conversation = Conversation::firstOrCreate(
            ['property_id' => $property->id, 'inquirer_id' => $userId],
            ['owner_id' => $property->user_id]
        );

        $message = $conversation->messages()->create([
            'sender_id' => $userId,
            'content'   => $validated['initial_message'],
        ]);

        $conversation->load(['property.images', 'inquirer', 'owner', 'lastMessage']);

        return response()->json([
            'conversation' => new ConversationResource($conversation),
            'message'      => new MessageResource($message->load('sender')),
        ], 201);
    }

    public function messages(Request $request, Conversation $conversation): AnonymousResourceCollection
    {
        $userId = $request->user()->id;

        if ($conversation->inquirer_id !== $userId && $conversation->owner_id !== $userId) {
            abort(403);
        }

        $conversation->messages()
            ->where('sender_id', '!=', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $messages = $conversation->messages()
            ->with('sender')
            ->oldest()
            ->paginate(50);

        return MessageResource::collection($messages);
    }

    public function sendMessage(Request $request, Conversation $conversation): JsonResponse
    {
        $userId = $request->user()->id;

        if ($conversation->inquirer_id !== $userId && $conversation->owner_id !== $userId) {
            abort(403);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $message = $conversation->messages()->create([
            'sender_id' => $userId,
            'content'   => $validated['content'],
        ]);

        return response()->json(new MessageResource($message->load('sender')), 201);
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $count = \App\Models\Message::whereHas('conversation', function ($q) use ($userId) {
            $q->where('inquirer_id', $userId)->orWhere('owner_id', $userId);
        })
        ->where('sender_id', '!=', $userId)
        ->whereNull('read_at')
        ->count();

        return response()->json(['unread_count' => $count]);
    }
}
