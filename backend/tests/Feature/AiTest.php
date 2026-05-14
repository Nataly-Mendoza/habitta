<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AiTest extends TestCase
{
    use RefreshDatabase;

    private User $propietario;

    protected function setUp(): void
    {
        parent::setUp();
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $role = Role::firstOrCreate(['name' => 'propietario', 'guard_name' => 'web']);
        $this->propietario = User::factory()->create();
        $this->propietario->assignRole($role);
    }

    public function test_ai_endpoint_requires_authentication(): void
    {
        $this->postJson('/api/ai/furnish', [
            'image_url' => 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100',
        ])->assertUnauthorized();
    }

    public function test_ai_endpoint_rejects_missing_image_url(): void
    {
        $this->actingAs($this->propietario)
            ->postJson('/api/ai/furnish', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['image_url']);
    }

    public function test_ai_endpoint_rejects_invalid_url(): void
    {
        $this->actingAs($this->propietario)
            ->postJson('/api/ai/furnish', ['image_url' => 'not-a-url'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['image_url']);
    }

    public function test_ai_always_returns_original_and_generated_even_when_hf_fails(): void
    {
        Http::fake([
            'images.unsplash.com/*'          => Http::response($this->minimalJpeg(), 200, ['Content-Type' => 'image/jpeg']),
            'api-inference.huggingface.co/*' => Http::response(null, 503),
        ]);

        $response = $this->actingAs($this->propietario)
            ->postJson('/api/ai/furnish', [
                'image_url' => 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100',
            ]);

        $response->assertOk()
            ->assertJsonStructure(['original', 'generated']);

        $data = $response->json();
        $this->assertNotEmpty($data['original'],   'original must not be empty');
        $this->assertNotEmpty($data['generated'],  'generated must not be empty');
        $this->assertNotEquals($data['original'], $data['generated'], 'generated image must differ from original');
    }

    public function test_ai_response_structure_is_always_valid(): void
    {
        Http::fake([
            'images.unsplash.com/*'          => Http::response($this->minimalJpeg(), 200, ['Content-Type' => 'image/jpeg']),
            'api-inference.huggingface.co/*' => Http::response(null, 404),
        ]);

        $this->actingAs($this->propietario)
            ->postJson('/api/ai/furnish', [
                'image_url' => 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100',
            ])
            ->assertOk()
            ->assertJsonStructure(['original', 'generated']);
    }

    // ── Helper ──────────────────────────────────────────────────────────────

    private function minimalJpeg(): string
    {
        if (! extension_loaded('gd')) {
            return base64_decode(
                '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8U'
                . 'HRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAARC'
                . 'AABAAEDASIA/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAHhAAAQUAAwEAAAAAAAAAAAA'
                . 'AAAECAwQFEiEx/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAA'
                . 'AAD/2gAMAwEAAhEDEQA/AKWqqqqAo//Z'
            );
        }

        $img = imagecreatetruecolor(20, 20);
        imagefilledrectangle($img, 0, 0, 19, 19, imagecolorallocate($img, 180, 130, 90));
        ob_start();
        imagejpeg($img, null, 80);
        $bytes = ob_get_clean();
        imagedestroy($img);

        return $bytes;
    }
}
