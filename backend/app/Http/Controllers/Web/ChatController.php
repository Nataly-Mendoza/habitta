<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $conversaciones = Conversation::with([
                'property.images',
                'inquirer',
                'owner',
                'lastMessage',
                'messages' => fn ($q) => $q->whereNull('read_at')->where('sender_id', '!=', $userId),
            ])
            ->where('inquirer_id', $userId)
            ->orWhere('owner_id', $userId)
            ->latest('updated_at')
            ->get();

        return view('dashboard.chat.index', compact('conversaciones'));
    }

    public function conversacion(Conversation $conversation)
    {
        $userId = Auth::id();
        abort_unless(
            $conversation->inquirer_id === $userId || $conversation->owner_id === $userId,
            403
        );

        $conversation->load(['property.images', 'inquirer', 'owner']);

        // Marcar mensajes como leídos
        $conversation->messages()
            ->where('sender_id', '!=', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $mensajes = $conversation->messages()->with('sender')->oldest()->get();

        return view('dashboard.chat.conversacion', compact('conversation', 'mensajes'));
    }

    public function iniciar(Request $request)
    {
        $request->validate([
            'property_id'     => 'required|exists:properties,id',
            'initial_message' => 'required|string|max:1000',
        ]);

        $property = Property::findOrFail($request->property_id);
        $userId   = Auth::id();

        if ($property->user_id === $userId) {
            return back()->withErrors(['general' => 'No puedes contactarte contigo mismo.']);
        }

        $conversacion = Conversation::firstOrCreate(
            ['property_id' => $property->id, 'inquirer_id' => $userId],
            ['owner_id'    => $property->user_id]
        );

        $conversacion->messages()->create([
            'sender_id' => $userId,
            'content'   => $request->initial_message,
        ]);

        $conversacion->touch();

        return redirect()->route('panel.chat.conversacion', $conversacion->id);
    }

    public function unreadCount(): JsonResponse
    {
        $userId = Auth::id();
        $count  = Message::whereHas('conversation', function ($q) use ($userId) {
            $q->where('inquirer_id', $userId)->orWhere('owner_id', $userId);
        })
        ->where('sender_id', '!=', $userId)
        ->whereNull('read_at')
        ->count();

        return response()->json(['unread_count' => $count]);
    }

    public function enviar(Request $request, Conversation $conversation)
    {
        $userId = Auth::id();
        abort_unless(
            $conversation->inquirer_id === $userId || $conversation->owner_id === $userId,
            403
        );

        $request->validate(['content' => 'required|string|max:1000']);

        $conversation->messages()->create([
            'sender_id' => $userId,
            'content'   => $request->content,
        ]);

        $conversation->touch();

        return redirect()->route('panel.chat.conversacion', $conversation->id);
    }
}
