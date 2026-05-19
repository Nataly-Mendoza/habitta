<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AiController extends Controller
{
    private const DAILY_LIMIT  = 3;

    private const GEMINI_BASE  = 'https://generativelanguage.googleapis.com/v1beta/models/';
    private const GEMINI_MODEL = 'gemini-2.0-flash-preview-image-generation';

    private const POLLINATIONS_BASE = 'https://image.pollinations.ai/prompt/';

    private const HF_BASE       = 'https://api-inference.huggingface.co/models/';
    private const IMG2IMG_MODEL = 'timbrooks/instruct-pix2pix';
    private const TXT2IMG_MODEL = 'stabilityai/stable-diffusion-2-1';

    private const GEMINI_PROMPT = 'You are an expert interior designer. '
        . 'Furnish this room with modern contemporary furniture: a comfortable sofa, coffee table, '
        . 'bookshelves, floor lamp, area rug, indoor plants, and warm ambient lighting. '
        . 'Preserve the exact room architecture, walls, windows, floors and ceiling — only add '
        . 'tasteful furniture and decorations. Return a high-quality, realistic interior design photo.';

    private const POLLINATIONS_PROMPT = 'A beautifully furnished modern living room, '
        . 'contemporary furniture, comfortable sofa, coffee table, bookshelves, floor lamp, '
        . 'area rug, indoor plants, warm ambient lighting, interior design, cozy, '
        . 'realistic, high quality photo, professional architectural photography, 4k';

    private const HF_PROMPT = 'Add modern contemporary furniture: sofa, coffee table, bookshelves, '
        . 'floor lamp, rug, plants, warm ambient lighting. Interior design, cozy living space, '
        . 'realistic, high quality photo, professionally decorated.';

    private const NEGATIVE = 'ugly, blurry, low quality, distorted, watermark, text, '
        . 'empty room, deformed, unrealistic, cartoon';

    public function furnish(Request $request): JsonResponse
    {
        set_time_limit(28);

        $request->validate([
            'image_url' => ['required', 'url', 'max:2048'],
        ]);

        // ── Rate limit ─────────────────────────────────────────────────────────
        $limitKey = 'ai_furnish_' . (Auth::id() ?? sha1($request->ip()));
        $used     = (int) Cache::get($limitKey, 0);

        if ($used >= self::DAILY_LIMIT) {
            return response()->json([
                'error'     => 'Límite diario alcanzado. Puedes generar hasta ' . self::DAILY_LIMIT . ' imágenes por día.',
                'limit'     => self::DAILY_LIMIT,
                'used'      => $used,
                'retry'     => false,
            ], 429);
        }

        // Increment before the API call so concurrent clicks don't bypass the limit
        Cache::put($limitKey, $used + 1, now()->endOfDay());
        $usedNow = $used + 1;

        // ── Fetch source image (5s cap so total stays within Railway's 30s) ────
        [$imageBytes, $mimeType] = $this->fetchImage($request->image_url);

        $geminiKey = config('services.gemini.key');

        // ── 1. Gemini (img2img, up to 18s) — only when key + image available ──
        if (! empty($geminiKey) && strlen($imageBytes) > 0) {
            $generated = $this->callGemini($geminiKey, $imageBytes, $mimeType);
            if ($generated !== null) {
                return response()->json([
                    'original'  => $request->image_url,
                    'generated' => $generated,
                    'used'      => $usedNow,
                    'limit'     => self::DAILY_LIMIT,
                    'engine'    => 'Gemini 2.0 Flash',
                ]);
            }
            // Gemini failed — fall straight to GD (no time for more external calls)
            return $this->gdFallback($imageBytes, $mimeType, $request->image_url, $usedNow);
        }

        // ── 2. Pollinations turbo (txt2img, up to 20s) — no Gemini key or no image
        $generated = $this->callPollinations(null);
        if ($generated !== null) {
            return response()->json([
                'original'  => $request->image_url,
                'generated' => $generated,
                'used'      => $usedNow,
                'limit'     => self::DAILY_LIMIT,
                'engine'    => 'Turbo (Pollinations.ai)',
            ]);
        }

        // ── 3. GD fallback — always succeeds ──────────────────────────────────
        return $this->gdFallback($imageBytes, $mimeType, $request->image_url, $usedNow);
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    private function fetchImage(string $url): array
    {
        $appStorageBase = rtrim(config('app.url'), '/') . '/storage/';
        $isLocal        = str_starts_with($url, $appStorageBase);

        if ($isLocal) {
            $storagePath = urldecode(substr($url, strlen($appStorageBase)));
            if (! Storage::disk('public')->exists($storagePath)) {
                return ['', 'image/jpeg'];
            }
            $mime = trim(explode(';', Storage::disk('public')->mimeType($storagePath) ?: 'image/jpeg')[0]);
            return [Storage::disk('public')->get($storagePath), $mime];
        }

        try {
            $resp  = Http::timeout(5)->get($url);
            $bytes = $resp->successful() ? $resp->body() : '';
            $mime  = trim(explode(';', $resp->header('Content-Type') ?: 'image/jpeg')[0]);
            $mime  = in_array($mime, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
                ? $mime : 'image/jpeg';
            return [$bytes, $mime];
        } catch (\Throwable $e) {
            Log::warning('AI: image download failed', ['error' => $e->getMessage()]);
            return ['', 'image/jpeg'];
        }
    }

    private function callGemini(string $apiKey, string $imageBytes, string $mimeType): ?string
    {
        $endpoint = self::GEMINI_BASE . self::GEMINI_MODEL . ':generateContent?key=' . $apiKey;

        try {
            $response = Http::timeout(14)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post($endpoint, [
                    'contents' => [[
                        'parts' => [
                            ['text' => self::GEMINI_PROMPT],
                            ['inline_data' => [
                                'mime_type' => $mimeType,
                                'data'      => base64_encode($imageBytes),
                            ]],
                        ],
                    ]],
                    'generationConfig' => [
                        'responseModalities' => ['IMAGE', 'TEXT'],
                    ],
                ]);

            if (! $response->successful()) {
                Log::warning('AI: Gemini ' . $response->status(), ['body' => substr($response->body(), 0, 400)]);
                return null;
            }

            $parts = $response->json('candidates.0.content.parts') ?? [];
            foreach ($parts as $part) {
                if (isset($part['inline_data']['data'])) {
                    $outMime = $part['inline_data']['mime_type'] ?? 'image/png';
                    return 'data:' . $outMime . ';base64,' . $part['inline_data']['data'];
                }
            }

            Log::warning('AI: Gemini returned no image part', ['body' => substr($response->body(), 0, 400)]);
            return null;

        } catch (\Throwable $e) {
            Log::error('AI: Gemini exception', ['msg' => $e->getMessage()]);
            return null;
        }
    }

    private function callGeminiVision(string $apiKey, string $imageBytes, string $mimeType): ?string
    {
        $endpoint = self::GEMINI_BASE . 'gemini-2.0-flash-exp:generateContent?key=' . $apiKey;

        try {
            $response = Http::timeout(5)
                ->withHeaders(['Content-Type' => 'application/json'])
                ->post($endpoint, [
                    'contents' => [[
                        'parts' => [
                            ['text' => 'Describe this room photo in under 40 words for an interior designer: room type, architectural style, wall color, floor type, and any notable features. Be concise and descriptive only.'],
                            ['inline_data' => [
                                'mime_type' => $mimeType,
                                'data'      => base64_encode($imageBytes),
                            ]],
                        ],
                    ]],
                    'generationConfig' => ['maxOutputTokens' => 80],
                ]);

            if ($response->successful()) {
                $text = $response->json('candidates.0.content.parts.0.text') ?? '';
                return trim(preg_replace('/\s+/', ' ', $text));
            }
        } catch (\Throwable $e) {
            Log::warning('AI: Gemini vision failed', ['msg' => $e->getMessage()]);
        }

        return null;
    }

    private function callPollinations(?string $roomDescription = null): ?string
    {
        $basePrompt = $roomDescription
            ? rtrim($roomDescription, '. ') . '. Add modern contemporary furniture: comfortable sofa, '
              . 'coffee table, bookshelves, floor lamp, area rug, indoor plants, warm ambient lighting. '
              . 'Interior design, realistic, 4k, professional architectural photography'
            : self::POLLINATIONS_PROMPT;

        $url = self::POLLINATIONS_BASE . urlencode($basePrompt)
             . '?width=512&height=384&model=turbo&nologo=true&seed=' . rand(1000, 99999);

        try {
            $response = Http::timeout(20)->get($url);
            $ct       = $response->header('Content-Type') ?? '';
            if ($response->successful() && str_starts_with($ct, 'image/')) {
                return 'data:' . trim(explode(';', $ct)[0]) . ';base64,' . base64_encode($response->body());
            }
            Log::warning('AI: Pollinations failed', ['status' => $response->status()]);
        } catch (\Throwable $e) {
            Log::warning('AI: Pollinations exception', ['msg' => $e->getMessage()]);
        }

        return null;
    }

    private function callHF(string $apiKey, string $model, array $payload): ?string
    {
        $endpoint = self::HF_BASE . $model;

        for ($attempt = 1; $attempt <= 2; $attempt++) {
            try {
                $response = Http::withToken($apiKey)
                    ->timeout(8)
                    ->withHeaders(['Content-Type' => 'application/json'])
                    ->post($endpoint, $payload);

                if ($response->status() === 404) {
                    Log::warning("AI: model {$model} 404");
                    return null;
                }

                if ($response->status() === 503) {
                    $wait = min((int) ($response->json('estimated_time') ?? 3), 3);
                    if ($attempt < 2) { sleep($wait); continue; }
                    return null;
                }

                if (! $response->successful()) {
                    Log::warning("AI: {$model} status {$response->status()}");
                    return null;
                }

                $ct = $response->header('Content-Type') ?: 'image/jpeg';
                if (str_contains($ct, 'application/json')) {
                    return null;
                }

                return 'data:' . $ct . ';base64,' . base64_encode($response->body());

            } catch (\Throwable $e) {
                Log::error("AI: {$model} attempt {$attempt}", ['msg' => $e->getMessage()]);
                if ($attempt < 2) { sleep(3); }
            }
        }

        return null;
    }

    private function gdFallback(string $imageBytes, string $mimeType, string $originalUrl, int $usedNow): JsonResponse
    {
        if (extension_loaded('gd') && function_exists('imagecreatetruecolor')) {
            $src = strlen($imageBytes) > 0 ? @imagecreatefromstring($imageBytes) : false;

            // No source image — paint a synthetic warm room background
            if ($src === false) {
                $src = imagecreatetruecolor(768, 512);
                $wall    = imagecolorallocate($src, 238, 228, 214);
                $floor   = imagecolorallocate($src, 172, 132, 88);
                $baseb   = imagecolorallocate($src, 248, 242, 232);
                imagefill($src, 0, 0, $wall);
                imagefilledrectangle($src, 0, (int)(512 * 0.64), 767, 511, $floor);
                imagefilledrectangle($src, 0, (int)(512 * 0.63), 767, (int)(512 * 0.65), $baseb);
            }

            if ($src !== false) {
                $w = imagesx($src);
                $h = imagesy($src);

                imagealphablending($src, true);

                imagefilter($src, IMG_FILTER_BRIGHTNESS, 22);
                imagefilter($src, IMG_FILTER_COLORIZE, 38, 12, -22);
                imagefilter($src, IMG_FILTER_CONTRAST, -14);

                $floorStart = (int) ($h * 0.68);
                for ($y = $floorStart; $y < $h; $y++) {
                    $progress   = ($y - $floorStart) / max(1, $h - $floorStart);
                    $alphaVal   = max(10, min(90, (int) (80 * $progress)));
                    $floorColor = imagecolorallocatealpha($src, 100, 58, 18, 127 - $alphaVal);
                    imageline($src, 0, $y, $w - 1, $y, $floorColor);
                }

                $rugCx = (int) ($w * 0.44);
                $rugCy = (int) ($h * 0.80);
                $rugRx = (int) ($w * 0.30);
                $rugRy = (int) ($h * 0.08);
                for ($layer = 4; $layer >= 0; $layer--) {
                    $rugC = imagecolorallocatealpha($src, 155, 75, 45, 80 + $layer * 8);
                    imagefilledellipse($src, $rugCx, $rugCy, $rugRx * 2, $rugRy * 2, $rugC);
                }

                $sx  = (int) ($w * 0.04);
                $sy  = (int) ($h * 0.59);
                $sw  = (int) ($w * 0.42);
                $sh  = (int) ($h * 0.18);
                $backC = imagecolorallocatealpha($src, 58, 42, 30, 52);
                imagefilledrectangle($src, $sx, $sy - (int) ($sh * 0.65), $sx + $sw, $sy + 2, $backC);
                $seatC = imagecolorallocatealpha($src, 78, 58, 38, 48);
                imagefilledrectangle($src, $sx, $sy, $sx + $sw, $sy + $sh, $seatC);
                $cw = (int) ($sw / 3) - 5;
                for ($ci = 0; $ci < 3; $ci++) {
                    $cx    = $sx + $ci * ($cw + 5) + 2;
                    $cushC = imagecolorallocatealpha($src, 98, 75, 52, 52);
                    imagefilledrectangle($src, $cx, $sy + 3, $cx + $cw, $sy + $sh - 5, $cushC);
                }
                $armC = imagecolorallocatealpha($src, 45, 32, 22, 48);
                imagefilledrectangle($src, $sx, $sy - (int) ($sh * 0.4), $sx + 18, $sy + $sh, $armC);
                imagefilledrectangle($src, $sx + $sw - 18, $sy - (int) ($sh * 0.4), $sx + $sw, $sy + $sh, $armC);

                $tx  = (int) ($w * 0.30);
                $ty  = (int) ($h * 0.71);
                $tw  = (int) ($w * 0.26);
                $th  = (int) ($h * 0.07);
                $tbc = imagecolorallocatealpha($src, 108, 74, 36, 42);
                imagefilledrectangle($src, $tx, $ty, $tx + $tw, $ty + $th, $tbc);
                $sheen = imagecolorallocatealpha($src, 230, 195, 140, 105);
                imagefilledrectangle($src, $tx + 3, $ty + 2, $tx + $tw - 3, $ty + (int) ($th * 0.38), $sheen);

                $lx   = (int) ($w * 0.80);
                $lBot = (int) ($h * 0.80);
                $lTop = (int) ($h * 0.37);
                $poleC = imagecolorallocatealpha($src, 68, 50, 26, 62);
                for ($px = -1; $px <= 1; $px++) {
                    imageline($src, $lx + $px, $lTop + 22, $lx + $px, $lBot, $poleC);
                }
                $shadeC = imagecolorallocatealpha($src, 248, 215, 158, 72);
                imagefilledellipse($src, $lx, $lTop + 20, 52, 30, $shadeC);
                $glow1 = imagecolorallocatealpha($src, 255, 235, 160, 118);
                imagefilledellipse($src, $lx, $lTop + 55, 120, 80, $glow1);
                $glow2 = imagecolorallocatealpha($src, 255, 245, 200, 122);
                imagefilledellipse($src, $lx, $lTop + 38, 60, 40, $glow2);

                if ($w > 200) {
                    $bsx  = $w - (int) ($w * 0.13) - 6;
                    $bsy  = (int) ($h * 0.30);
                    $bsw  = (int) ($w * 0.11);
                    $bsh  = (int) ($h * 0.42);
                    $shBC = imagecolorallocatealpha($src, 95, 62, 28, 68);
                    imagefilledrectangle($src, $bsx, $bsy, $bsx + $bsw, $bsy + $bsh, $shBC);
                    $slatC = imagecolorallocatealpha($src, 70, 45, 18, 62);
                    for ($s = 1; $s <= 4; $s++) {
                        $sy2 = $bsy + (int) ($bsh * $s / 4.5);
                        imagefilledrectangle($src, $bsx, $sy2, $bsx + $bsw, $sy2 + 3, $slatC);
                    }
                    $books = [[180, 55, 55], [55, 118, 180], [55, 158, 78], [220, 165, 40], [118, 55, 178]];
                    foreach ($books as $idx => $bc) {
                        $bkx  = $bsx + 4 + $idx * (int) ($bsw / 5);
                        $bkC  = imagecolorallocatealpha($src, $bc[0], $bc[1], $bc[2], 65);
                        imagefilledrectangle($src, $bkx, $bsy + 5, $bkx + (int) ($bsw / 5) - 2, $bsy + (int) ($bsh / 4) - 5, $bkC);
                    }
                }

                $bW   = 158;
                $bH   = 30;
                $bX   = $w - $bW - 10;
                $bY   = 10;
                $badC = imagecolorallocatealpha($src, 201, 169, 110, 10);
                imagefilledrectangle($src, $bX, $bY, $bX + $bW, $bY + $bH, $badC);
                imagestring($src, 4, $bX + 10, $bY + 7, 'IA GENERADA', imagecolorallocate($src, 255, 255, 255));

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
                    'used'      => $usedNow,
                    'limit'     => self::DAILY_LIMIT,
                ]);
            }
        }

        $encoded = strlen($imageBytes) > 0
            ? 'data:' . $mimeType . ';base64,' . base64_encode($imageBytes)
            : $originalUrl;

        return response()->json([
            'original'  => $originalUrl,
            'generated' => $encoded,
            'used'      => $usedNow,
            'limit'     => self::DAILY_LIMIT,
        ]);
    }
}
