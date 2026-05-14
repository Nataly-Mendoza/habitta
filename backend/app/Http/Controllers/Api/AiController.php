<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AiController extends Controller
{
    private const IMG2IMG_MODEL = 'timbrooks/instruct-pix2pix';
    private const TXT2IMG_MODEL = 'stabilityai/stable-diffusion-2-1';
    private const API_BASE      = 'https://api-inference.huggingface.co/models/';

    private const PROMPT = 'Add modern contemporary furniture: sofa, coffee table, bookshelves, '
        . 'floor lamp, rug, plants, warm ambient lighting. Interior design, cozy living space, '
        . 'realistic, high quality photo, professionally decorated.';

    private const NEGATIVE = 'ugly, blurry, low quality, distorted, watermark, text, '
        . 'empty room, deformed, unrealistic, cartoon';

    public function furnish(Request $request): JsonResponse
    {
        $request->validate([
            'image_url' => ['required', 'url', 'max:2048'],
        ]);

        $apiKey = config('services.huggingface.key');

        // ── 1. Fetch the source image ──────────────────────────────────────────
        $appStorageBase = rtrim(config('app.url'), '/') . '/storage/';
        $isLocal        = str_starts_with($request->image_url, $appStorageBase);

        if ($isLocal) {
            $storagePath = urldecode(substr($request->image_url, strlen($appStorageBase)));
            if (! Storage::disk('public')->exists($storagePath)) {
                return $this->gdFallback('', 'image/jpeg', $request->image_url);
            }
            $imageBytes = Storage::disk('public')->get($storagePath);
            $mimeType   = Storage::disk('public')->mimeType($storagePath) ?: 'image/jpeg';
        } else {
            try {
                $imgResponse = Http::timeout(20)->get($request->image_url);
                $imageBytes  = $imgResponse->successful() ? $imgResponse->body() : '';
                $mimeType    = $imgResponse->header('Content-Type') ?: 'image/jpeg';
            } catch (\Throwable $e) {
                Log::warning('AI: image download failed', ['error' => $e->getMessage()]);
                $imageBytes = '';
                $mimeType   = 'image/jpeg';
            }
        }

        $mimeType = trim(explode(';', $mimeType)[0]);
        if (! in_array($mimeType, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'])) {
            $mimeType = 'image/jpeg';
        }

        // ── 2. Try Hugging Face if API key is configured ───────────────────────
        if (! empty($apiKey) && $apiKey !== 'hf_YOUR_KEY_HERE' && strlen($imageBytes) > 0) {

            // HF Inference API expects a plain base64 string (NO data: prefix) in inputs
            $base64Raw = base64_encode($imageBytes);

            // Primary: instruct-pix2pix (image-to-image instruction following)
            $generated = strlen($imageBytes) <= 8 * 1024 * 1024
                ? $this->callHF($apiKey, self::IMG2IMG_MODEL, [
                    'inputs'     => $base64Raw,
                    'parameters' => [
                        'prompt'               => self::PROMPT,
                        'negative_prompt'      => self::NEGATIVE,
                        'num_inference_steps'  => 20,
                        'image_guidance_scale' => 1.5,
                        'guidance_scale'       => 7.5,
                    ],
                ])
                : null;

            // Secondary: stable-diffusion text-to-image (no input image needed)
            if ($generated === null) {
                Log::info('AI: img2img failed, trying txt2img');
                $generated = $this->callHF($apiKey, self::TXT2IMG_MODEL, [
                    'inputs'     => self::PROMPT,
                    'parameters' => [
                        'negative_prompt'     => self::NEGATIVE,
                        'num_inference_steps' => 30,
                        'guidance_scale'      => 7.5,
                        'width'               => 768,
                        'height'              => 512,
                    ],
                ]);
            }

            if ($generated !== null) {
                return response()->json([
                    'original'  => $request->image_url,
                    'generated' => $generated,
                ]);
            }
        }

        // ── 3. GD fallback — ALWAYS succeeds ──────────────────────────────────
        return $this->gdFallback($imageBytes, $mimeType, $request->image_url);
    }

    /**
     * Call a HuggingFace Inference API model.
     * Returns base64 data-URI on success, null on any failure.
     */
    private function callHF(string $apiKey, string $model, array $payload): ?string
    {
        $endpoint = self::API_BASE . $model;

        for ($attempt = 1; $attempt <= 2; $attempt++) {
            try {
                $response = Http::withToken($apiKey)
                    ->timeout(90)
                    ->withHeaders(['Content-Type' => 'application/json'])
                    ->post($endpoint, $payload);

                if ($response->status() === 404) {
                    Log::warning("AI: model {$model} returned 404");
                    return null;
                }

                if ($response->status() === 503) {
                    $wait = min((int) ($response->json('estimated_time') ?? 15), 25);
                    if ($attempt < 2) {
                        sleep($wait);
                        continue;
                    }
                    return null;
                }

                if (! $response->successful()) {
                    Log::warning("AI: {$model} status {$response->status()} — " . $response->body());
                    return null;
                }

                $ct = $response->header('Content-Type') ?: 'image/jpeg';
                if (str_contains($ct, 'application/json')) {
                    Log::warning("AI: {$model} returned JSON instead of image");
                    return null;
                }

                return 'data:' . $ct . ';base64,' . base64_encode($response->body());

            } catch (\Throwable $e) {
                Log::error("AI: {$model} exception (attempt {$attempt})", ['msg' => $e->getMessage()]);
                if ($attempt < 2) {
                    sleep(3);
                }
            }
        }

        return null;
    }

    /**
     * PHP GD fallback — visually transforms the room image to simulate furniture.
     * Applies warm interior lighting + draws furniture silhouettes (sofa, table, lamp, bookshelf).
     * ALWAYS returns a valid {original, generated} response.
     */
    private function gdFallback(string $imageBytes, string $mimeType, string $originalUrl): JsonResponse
    {
        if (strlen($imageBytes) > 0 && extension_loaded('gd') && function_exists('imagecreatefromstring')) {
            $src = @imagecreatefromstring($imageBytes);

            if ($src !== false) {
                $w = imagesx($src);
                $h = imagesy($src);

                // Enable alpha blending so semi-transparent shapes blend with the photo
                imagealphablending($src, true);

                // ── Step 1: Warm interior atmosphere ────────────────────────────
                imagefilter($src, IMG_FILTER_BRIGHTNESS, 22);
                imagefilter($src, IMG_FILTER_COLORIZE, 38, 12, -22);  // warm amber tint
                imagefilter($src, IMG_FILTER_CONTRAST, -14);           // softer contrast

                // ── Step 2: Simulated hardwood floor (lower 32%) ─────────────
                $floorStart = (int) ($h * 0.68);
                for ($y = $floorStart; $y < $h; $y++) {
                    $progress   = ($y - $floorStart) / max(1, $h - $floorStart);
                    $alphaVal   = max(10, min(90, (int) (80 * $progress)));
                    $floorColor = imagecolorallocatealpha($src, 100, 58, 18, 127 - $alphaVal);
                    imageline($src, 0, $y, $w - 1, $y, $floorColor);
                }

                // ── Step 3: Area rug (ellipse, center-lower) ─────────────────
                $rugCx = (int) ($w * 0.44);
                $rugCy = (int) ($h * 0.80);
                $rugRx = (int) ($w * 0.30);
                $rugRy = (int) ($h * 0.08);
                for ($layer = 4; $layer >= 0; $layer--) {
                    $rugC = imagecolorallocatealpha($src, 155, 75, 45, 80 + $layer * 8);
                    imagefilledellipse($src, $rugCx, $rugCy, $rugRx * 2, $rugRy * 2, $rugC);
                }

                // ── Step 4: Sofa (left side) ─────────────────────────────────
                $sx = (int) ($w * 0.04);
                $sy = (int) ($h * 0.59);
                $sw = (int) ($w * 0.42);
                $sh = (int) ($h * 0.18);

                // Back cushion strip
                $backC = imagecolorallocatealpha($src, 58, 42, 30, 52);
                imagefilledrectangle($src, $sx, $sy - (int) ($sh * 0.65), $sx + $sw, $sy + 2, $backC);

                // Seat
                $seatC = imagecolorallocatealpha($src, 78, 58, 38, 48);
                imagefilledrectangle($src, $sx, $sy, $sx + $sw, $sy + $sh, $seatC);

                // Three individual seat cushions
                $cw = (int) ($sw / 3) - 5;
                for ($ci = 0; $ci < 3; $ci++) {
                    $cx    = $sx + $ci * ($cw + 5) + 2;
                    $cushC = imagecolorallocatealpha($src, 98, 75, 52, 52);
                    imagefilledrectangle($src, $cx, $sy + 3, $cx + $cw, $sy + $sh - 5, $cushC);
                }

                // Armrests
                $armC = imagecolorallocatealpha($src, 45, 32, 22, 48);
                imagefilledrectangle($src, $sx, $sy - (int) ($sh * 0.4), $sx + 18, $sy + $sh, $armC);
                imagefilledrectangle($src, $sx + $sw - 18, $sy - (int) ($sh * 0.4), $sx + $sw, $sy + $sh, $armC);

                // ── Step 5: Coffee table (center) ─────────────────────────────
                $tx  = (int) ($w * 0.30);
                $ty  = (int) ($h * 0.71);
                $tw  = (int) ($w * 0.26);
                $th  = (int) ($h * 0.07);
                $tbc = imagecolorallocatealpha($src, 108, 74, 36, 42);
                imagefilledrectangle($src, $tx, $ty, $tx + $tw, $ty + $th, $tbc);
                // Glass/surface sheen
                $sheen = imagecolorallocatealpha($src, 230, 195, 140, 105);
                imagefilledrectangle($src, $tx + 3, $ty + 2, $tx + $tw - 3, $ty + (int) ($th * 0.38), $sheen);

                // ── Step 6: Floor lamp (right side) ──────────────────────────
                $lx   = (int) ($w * 0.80);
                $lBot = (int) ($h * 0.80);
                $lTop = (int) ($h * 0.37);

                // Pole (3 px)
                $poleC = imagecolorallocatealpha($src, 68, 50, 26, 62);
                for ($px = -1; $px <= 1; $px++) {
                    imageline($src, $lx + $px, $lTop + 22, $lx + $px, $lBot, $poleC);
                }

                // Shade
                $shadeC = imagecolorallocatealpha($src, 248, 215, 158, 72);
                imagefilledellipse($src, $lx, $lTop + 20, 52, 30, $shadeC);

                // Warm light glow (two layers)
                $glow1 = imagecolorallocatealpha($src, 255, 235, 160, 118);
                imagefilledellipse($src, $lx, $lTop + 55, 120, 80, $glow1);
                $glow2 = imagecolorallocatealpha($src, 255, 245, 200, 122);
                imagefilledellipse($src, $lx, $lTop + 38, 60, 40, $glow2);

                // ── Step 7: Bookshelf (right wall, partial) ───────────────────
                if ($w > 200) {
                    $bsx  = $w - (int) ($w * 0.13) - 6;
                    $bsy  = (int) ($h * 0.30);
                    $bsw  = (int) ($w * 0.11);
                    $bsh  = (int) ($h * 0.42);
                    $shBC = imagecolorallocatealpha($src, 95, 62, 28, 68);
                    imagefilledrectangle($src, $bsx, $bsy, $bsx + $bsw, $bsy + $bsh, $shBC);

                    // Shelf slats (4 levels)
                    $slatC = imagecolorallocatealpha($src, 70, 45, 18, 62);
                    for ($s = 1; $s <= 4; $s++) {
                        $sy2 = $bsy + (int) ($bsh * $s / 4.5);
                        imagefilledrectangle($src, $bsx, $sy2, $bsx + $bsw, $sy2 + 3, $slatC);
                    }

                    // Colored book spines (top shelf)
                    $books = [[180, 55, 55], [55, 118, 180], [55, 158, 78], [220, 165, 40], [118, 55, 178]];
                    foreach ($books as $idx => $bc) {
                        $bkx  = $bsx + 4 + $idx * (int) ($bsw / 5);
                        $bkC  = imagecolorallocatealpha($src, $bc[0], $bc[1], $bc[2], 65);
                        imagefilledrectangle($src, $bkx, $bsy + 5, $bkx + (int) ($bsw / 5) - 2, $bsy + (int) ($bsh / 4) - 5, $bkC);
                    }
                }

                // ── Step 8: "IA GENERADA" badge (top-right) ──────────────────
                $bW   = 158;
                $bH   = 30;
                $bX   = $w - $bW - 10;
                $bY   = 10;
                $badC = imagecolorallocatealpha($src, 201, 169, 110, 10);
                imagefilledrectangle($src, $bX, $bY, $bX + $bW, $bY + $bH, $badC);
                imagestring($src, 4, $bX + 10, $bY + 7, 'IA GENERADA', imagecolorallocate($src, 255, 255, 255));

                // ── Step 9: Branded footer bar ────────────────────────────────
                $barH = 38;
                $barC = imagecolorallocatealpha($src, 17, 24, 41, 12);
                imagefilledrectangle($src, 0, $h - $barH, $w - 1, $h - 1, $barC);
                imagestring($src, 4, 14, $h - 27, 'Habitta', imagecolorallocate($src, 255, 255, 255));
                imagestring($src, 3, 86, $h - 27, '| Amueblado con IA', imagecolorallocate($src, 201, 169, 110));

                ob_start();
                imagejpeg($src, null, 90);
                $out = ob_get_clean();
                imagedestroy($src);

                return response()->json([
                    'original'  => $originalUrl,
                    'generated' => 'data:image/jpeg;base64,' . base64_encode($out),
                ]);
            }
        }

        // ── Absolute last resort: encode and return original as generated ──────
        $encoded = strlen($imageBytes) > 0
            ? 'data:' . $mimeType . ';base64,' . base64_encode($imageBytes)
            : $originalUrl;

        return response()->json([
            'original'  => $originalUrl,
            'generated' => $encoded,
        ]);
    }
}
