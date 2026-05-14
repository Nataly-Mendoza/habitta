<?php

namespace Tests\Unit;

use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PropertyModelTest extends TestCase
{
    use RefreshDatabase;

    private function makeUser(): User
    {
        return User::factory()->create();
    }

    private function makeProperty(array $overrides = []): Property
    {
        return Property::create(array_merge([
            'user_id'      => $this->makeUser()->id,
            'title'        => 'Test',
            'type'         => 'house',
            'listing_type' => 'sale',
            'price'        => 1000000,
            'location'     => 'Dir',
            'city'         => 'CDMX',
            'area'         => 100,
        ], $overrides));
    }

    public function test_scope_active_filters_closed(): void
    {
        $this->makeProperty(['status' => 'active']);
        $this->makeProperty(['status' => 'closed']);

        $this->assertCount(1, Property::active()->get());
    }

    public function test_scope_by_city(): void
    {
        $this->makeProperty(['city' => 'Monterrey']);
        $this->makeProperty(['city' => 'Cancún']);

        $this->assertCount(1, Property::byCity('Monterrey')->get());
    }

    public function test_scope_price_range(): void
    {
        $this->makeProperty(['price' => 500000]);
        $this->makeProperty(['price' => 1500000]);
        $this->makeProperty(['price' => 3000000]);

        $this->assertCount(1, Property::priceRange(1000000, 2000000)->get());
    }

    public function test_scope_area_range(): void
    {
        $this->makeProperty(['area' => 50]);
        $this->makeProperty(['area' => 150]);

        $this->assertCount(1, Property::areaRange(100, 200)->get());
    }

    public function test_scope_by_type(): void
    {
        $this->makeProperty(['type' => 'house']);
        $this->makeProperty(['type' => 'apartment']);

        $this->assertCount(1, Property::byType('house')->get());
    }

    public function test_scope_by_listing_type(): void
    {
        $this->makeProperty(['listing_type' => 'sale']);
        $this->makeProperty(['listing_type' => 'rent']);

        $this->assertCount(1, Property::byListingType('rent')->get());
    }

    public function test_property_has_images_relationship(): void
    {
        $property = $this->makeProperty();
        $property->images()->create(['path' => 'http://img.com/a.jpg', 'is_main' => true, 'order' => 0]);

        $this->assertCount(1, $property->images);
    }

    public function test_property_belongs_to_owner(): void
    {
        $user = $this->makeUser();
        $property = Property::create([
            'user_id' => $user->id, 'title' => 'X', 'type' => 'house',
            'listing_type' => 'sale', 'price' => 100, 'location' => 'x',
            'city' => 'x', 'area' => 10,
        ]);

        $this->assertEquals($user->id, $property->owner->id);
    }
}
