<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConversationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $userId = auth()->id();

        return [
            'id'           => $this->id,
            'property'     => new PropertyResource($this->whenLoaded('property')),
            'inquirer'     => new UserResource($this->whenLoaded('inquirer')),
            'owner'        => new UserResource($this->whenLoaded('owner')),
            'last_message' => new MessageResource($this->whenLoaded('lastMessage')),
            'unread_count' => $this->when(
                $userId !== null,
                fn() => $this->unreadCountFor($userId)
            ),
            'created_at'   => $this->created_at->toISOString(),
        ];
    }
}
