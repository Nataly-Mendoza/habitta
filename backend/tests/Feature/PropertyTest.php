<?php

namespace Tests\Feature;

use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PropertyTest extends TestCase
{
    use RefreshDatabase;

    private User $owner;
    private User $otherUser;
    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        Role::firstOrCreate(['name' => 'propietario', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'visitante_registrado', 'guard_name' => 'web']);

        $propietarioRole = Role::firstOrCreate(['name' => 'propietario', 'guard_name' => 'web']);
        $adminRole       = Role::firstOrCreate(['name' => 'admin',       'guard_name' => 'web']);

        $this->owner     = User::factory()->create();
        $this->owner->assignRole($propietarioRole);

        $this->admin = User::factory()->create();
        $this->admin->assignRole($adminRole);

        $this->otherUser = User::factory()->create();
    }

    private function makeProperty(array $overrides = []): Property
    {
        return Property::create(array_merge([
            'user_id'         => $this->owner->id,
            'title'           => 'Casa de prueba',
            'type'            => 'house',
            'listing_type'    => 'sale',
            'price'           => 1500000,
            'location'        => 'Calle Falsa 123',
            'city'            => 'Ciudad de México',
            'area'            => 120,
            'has_water'       => true,
            'has_electricity' => true,
            'has_drainage'    => true,
        ], $overrides));
    }

    public function test_public_can_list_properties(): void
    {
        $this->makeProperty();
        $this->makeProperty(['title' => 'Departamento Centro']);

        $this->getJson('/api/properties')
            ->assertOk()
            ->assertJsonStructure(['data', 'meta', 'links'])
            ->assertJsonCount(2, 'data');
    }

    public function test_public_can_view_single_property(): void
    {
        $property = $this->makeProperty();

        $this->getJson("/api/properties/{$property->id}")
            ->assertOk()
            ->assertJsonFragment(['title' => 'Casa de prueba']);
    }

    public function test_view_count_increments_on_show(): void
    {
        $property = $this->makeProperty();
        $this->assertEquals(0, $property->views_count);

        $this->getJson("/api/properties/{$property->id}")->assertOk();

        $this->assertEquals(1, $property->fresh()->views_count);
    }

    public function test_authenticated_user_can_create_property(): void
    {
        $payload = [
            'title'        => 'Nueva propiedad',
            'type'         => 'apartment',
            'listing_type' => 'rent',
            'price'        => 12000,
            'location'     => 'Av. Reforma 400',
            'city'         => 'Guadalajara',
            'area'         => 75,
        ];

        $this->actingAs($this->owner)
            ->postJson('/api/properties', $payload)
            ->assertCreated()
            ->assertJsonFragment(['title' => 'Nueva propiedad']);
    }

    public function test_guest_cannot_create_property(): void
    {
        $this->postJson('/api/properties', ['title' => 'Test'])
            ->assertUnauthorized();
    }

    public function test_owner_can_update_own_property(): void
    {
        $property = $this->makeProperty();

        $this->actingAs($this->owner)
            ->putJson("/api/properties/{$property->id}", ['price' => 2000000])
            ->assertOk()
            ->assertJsonFragment(['price' => 2000000.0]);
    }

    public function test_other_user_cannot_update_property(): void
    {
        $property = $this->makeProperty();

        $this->actingAs($this->otherUser)
            ->putJson("/api/properties/{$property->id}", ['price' => 999])
            ->assertForbidden();
    }

    public function test_owner_can_close_property(): void
    {
        $property = $this->makeProperty();

        $this->actingAs($this->owner)
            ->postJson("/api/properties/{$property->id}/close", ['reason' => 'Ya fue vendida'])
            ->assertOk()
            ->assertJsonFragment(['status' => 'closed', 'close_reason' => 'Ya fue vendida']);
    }

    public function test_admin_can_delete_any_property(): void
    {
        $property = $this->makeProperty();

        $this->actingAs($this->admin)
            ->deleteJson("/api/properties/{$property->id}")
            ->assertNoContent();

        $this->assertDatabaseMissing('properties', ['id' => $property->id]);
    }

    public function test_owner_cannot_delete_property(): void
    {
        $property = $this->makeProperty();

        $this->actingAs($this->owner)
            ->deleteJson("/api/properties/{$property->id}")
            ->assertForbidden();
    }

    public function test_filter_by_city(): void
    {
        $this->makeProperty(['city' => 'Monterrey']);
        $this->makeProperty(['city' => 'Cancún']);

        $this->getJson('/api/properties?city=Monterrey')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonFragment(['city' => 'Monterrey']);
    }

    public function test_filter_by_listing_type(): void
    {
        $this->makeProperty(['listing_type' => 'sale']);
        $this->makeProperty(['listing_type' => 'rent']);

        $this->getJson('/api/properties?listing_type=rent')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_filter_by_price_range(): void
    {
        $this->makeProperty(['price' => 500000]);
        $this->makeProperty(['price' => 2000000]);
        $this->makeProperty(['price' => 5000000]);

        $this->getJson('/api/properties?price_min=1000000&price_max=3000000')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_authenticated_user_can_toggle_favorite(): void
    {
        $property = $this->makeProperty();

        $this->actingAs($this->otherUser)
            ->postJson("/api/properties/{$property->id}/favorite")
            ->assertOk()
            ->assertJsonFragment(['favorited' => true]);

        $this->actingAs($this->otherUser)
            ->postJson("/api/properties/{$property->id}/favorite")
            ->assertOk()
            ->assertJsonFragment(['favorited' => false]);
    }

    public function test_my_properties_returns_only_own(): void
    {
        $this->makeProperty();
        $this->makeProperty(['user_id' => $this->otherUser->id]);

        $this->actingAs($this->owner)
            ->getJson('/api/my-properties')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_similar_properties_returns_related(): void
    {
        $property1 = $this->makeProperty(['city' => 'Monterrey', 'type' => 'house']);
        $this->makeProperty(['city' => 'Monterrey', 'type' => 'apartment']);
        $this->makeProperty(['city' => 'Cancún', 'type' => 'house']);

        $this->getJson("/api/properties/{$property1->id}/similar")
            ->assertOk()
            ->assertJsonStructure(['data']);
    }

    public function test_closed_properties_excluded_from_public_listing(): void
    {
        $this->makeProperty(['status' => 'active']);
        $this->makeProperty(['status' => 'closed', 'close_reason' => 'Vendida']);

        $this->getJson('/api/properties')
            ->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_create_property_validation_fails_with_missing_fields(): void
    {
        $this->actingAs($this->owner)
            ->postJson('/api/properties', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['title', 'type', 'listing_type', 'price', 'location', 'city', 'area']);
    }
}
