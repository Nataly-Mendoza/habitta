<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PropertyResource;
use App\Models\Message;
use App\Models\Property;
use App\Models\PropertyWithDetail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();

        $properties = $user->properties();

        $totalActive   = (clone $properties)->where('status', 'active')->count();
        $totalClosed   = (clone $properties)->where('status', 'closed')->count();
        $totalViews    = (clone $properties)->sum('views_count');
        $totalInquiries = \App\Models\Conversation::where('owner_id', $user->id)->count();

        $avgViews = $totalActive > 0 ? round($totalViews / max($totalActive + $totalClosed, 1), 1) : 0;

        $unreadMessages = Message::whereHas('conversation', function ($q) use ($user) {
            $q->where('owner_id', $user->id)->orWhere('inquirer_id', $user->id);
        })
        ->where('sender_id', '!=', $user->id)
        ->whereNull('read_at')
        ->count();

        return response()->json([
            'total_active'    => $totalActive,
            'total_closed'    => $totalClosed,
            'total_views'     => $totalViews,
            'total_inquiries' => $totalInquiries,
            'avg_views'       => $avgViews,
            'unread_messages' => $unreadMessages,
        ]);
    }

    public function recentProperties(Request $request): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $properties = $request->user()
            ->properties()
            ->with(['images', 'favorites'])
            ->latest()
            ->limit(5)
            ->get();

        return PropertyResource::collection($properties);
    }

    public function topProperties(): JsonResponse
    {
        $top = PropertyWithDetail::where('status', 'active')
            ->orderByDesc('favorites_count')
            ->orderByDesc('views_count')
            ->limit(5)
            ->get(['id', 'title', 'city', 'price', 'favorites_count', 'views_count', 'owner_nombre', 'owner_apellido']);

        return response()->json($top);
    }

    public function viewsActivity(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $user->properties()
            ->select('title', 'views_count', 'created_at')
            ->latest()
            ->limit(7)
            ->get()
            ->map(fn($p) => [
                'title'       => $p->title,
                'views_count' => $p->views_count,
            ]);

        return response()->json($data);
    }
}
