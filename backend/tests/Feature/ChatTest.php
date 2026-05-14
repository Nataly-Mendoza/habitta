<?php

namespace Tests\Feature;

use App\Models\Conversation;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChatTest extends TestCase
{
    use RefreshDatabase;

    private User $seller;
    private User $buyer;
    private Property $property;

    protected function setUp(): void
    {
        parent::setUp();
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $this->seller = User::factory()->create();
        $this->buyer  = User::factory()->create();

        $this->property = Property::create([
            'user_id'      => $this->seller->id,
            'title'        => 'Casa en venta',
            'type'         => 'house',
            'listing_type' => 'sale',
            'price'        => 1000000,
            'location'     => 'Test',
            'city'         => 'CDMX',
            'area'         => 100,
        ]);
    }

    public function test_buyer_can_start_conversation(): void
    {
        $this->actingAs($this->buyer)
            ->postJson('/api/conversations', [
                'property_id'     => $this->property->id,
                'initial_message' => 'Me interesa la propiedad.',
            ])
            ->assertCreated()
            ->assertJsonStructure(['conversation', 'message']);
    }

    public function test_seller_cannot_message_own_property(): void
    {
        $this->actingAs($this->seller)
            ->postJson('/api/conversations', [
                'property_id'     => $this->property->id,
                'initial_message' => 'Me contacto a mí mismo.',
            ])
            ->assertUnprocessable();
    }

    public function test_duplicate_conversation_is_reused(): void
    {
        $first = $this->actingAs($this->buyer)
            ->postJson('/api/conversations', [
                'property_id'     => $this->property->id,
                'initial_message' => 'Primera vez.',
            ])
            ->assertCreated()
            ->json('conversation.id');

        $second = $this->actingAs($this->buyer)
            ->postJson('/api/conversations', [
                'property_id'     => $this->property->id,
                'initial_message' => 'Segunda vez.',
            ])
            ->assertCreated()
            ->json('conversation.id');

        $this->assertEquals($first, $second);
    }

    public function test_user_can_list_own_conversations(): void
    {
        $this->actingAs($this->buyer)->postJson('/api/conversations', [
            'property_id'     => $this->property->id,
            'initial_message' => 'Hola.',
        ]);

        $this->actingAs($this->buyer)
            ->getJson('/api/conversations')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_user_can_send_message(): void
    {
        $conv = Conversation::create([
            'property_id' => $this->property->id,
            'inquirer_id' => $this->buyer->id,
            'owner_id'    => $this->seller->id,
        ]);

        $this->actingAs($this->buyer)
            ->postJson("/api/conversations/{$conv->id}/messages", [
                'content' => '¿Tiene estacionamiento?',
            ])
            ->assertCreated()
            ->assertJsonFragment(['content' => '¿Tiene estacionamiento?']);
    }

    public function test_outsider_cannot_access_conversation(): void
    {
        $outsider = User::factory()->create();
        $conv     = Conversation::create([
            'property_id' => $this->property->id,
            'inquirer_id' => $this->buyer->id,
            'owner_id'    => $this->seller->id,
        ]);

        $this->actingAs($outsider)
            ->getJson("/api/conversations/{$conv->id}/messages")
            ->assertForbidden();
    }

    public function test_unread_count_returns_correctly(): void
    {
        $conv = Conversation::create([
            'property_id' => $this->property->id,
            'inquirer_id' => $this->buyer->id,
            'owner_id'    => $this->seller->id,
        ]);

        $conv->messages()->create(['sender_id' => $this->seller->id, 'content' => 'Resp 1']);
        $conv->messages()->create(['sender_id' => $this->seller->id, 'content' => 'Resp 2']);

        $this->actingAs($this->buyer)
            ->getJson('/api/conversations/unread-count')
            ->assertOk()
            ->assertJsonFragment(['unread_count' => 2]);
    }
}
