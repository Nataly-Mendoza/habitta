<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CloudinaryService
{
    private string $cloudName;
    private string $apiKey;
    private string $apiSecret;

    public function __construct()
    {
        $this->cloudName = config('services.cloudinary.cloud_name', '');
        $this->apiKey    = config('services.cloudinary.key', '');
        $this->apiSecret = config('services.cloudinary.secret', '');
    }

    public function isConfigured(): bool
    {
        return $this->cloudName !== '' && $this->apiKey !== '' && $this->apiSecret !== '';
    }

    public function upload(UploadedFile $file, string $folder): ?string
    {
        $timestamp = time();
        $paramStr  = "folder={$folder}&timestamp={$timestamp}";
        $signature = sha1($paramStr . $this->apiSecret);

        $response = Http::timeout(30)
            ->asMultipart()
            ->post("https://api.cloudinary.com/v1_1/{$this->cloudName}/image/upload", [
                ['name' => 'file',      'contents' => fopen($file->getRealPath(), 'r'), 'filename' => $file->getClientOriginalName()],
                ['name' => 'api_key',   'contents' => $this->apiKey],
                ['name' => 'timestamp', 'contents' => (string) $timestamp],
                ['name' => 'folder',    'contents' => $folder],
                ['name' => 'signature', 'contents' => $signature],
            ]);

        if ($response->successful()) {
            return $response->json('secure_url');
        }

        Log::error('Cloudinary upload failed', [
            'status' => $response->status(),
            'body'   => substr($response->body(), 0, 400),
        ]);
        return null;
    }

    public function deleteByUrl(string $url): void
    {
        if (! str_contains($url, 'cloudinary.com')) return;

        preg_match('/\/upload\/(?:v\d+\/)?(.+)\.\w+$/', $url, $matches);
        if (empty($matches[1])) return;

        $publicId  = $matches[1];
        $timestamp = time();
        $signature = sha1("public_id={$publicId}&timestamp={$timestamp}" . $this->apiSecret);

        Http::asForm()
            ->timeout(10)
            ->post("https://api.cloudinary.com/v1_1/{$this->cloudName}/image/destroy", [
                'public_id' => $publicId,
                'api_key'   => $this->apiKey,
                'timestamp' => $timestamp,
                'signature' => $signature,
            ]);
    }
}
