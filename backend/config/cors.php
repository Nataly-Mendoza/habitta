<?php

// ── CORS_ALLOWED_ORIGINS env controls which origins may call the API ──────────
// Default '*' works for Bearer-token API calls (React on Vercel → Laravel on Railway).
// For a locked-down production config, set:
//   CORS_ALLOWED_ORIGINS=https://habitta.vercel.app
// Multiple origins: CORS_ALLOWED_ORIGINS=https://a.vercel.app,https://b.vercel.app

$rawOrigins = env('CORS_ALLOWED_ORIGINS', '*');
$allowedOrigins = $rawOrigins === '*' ? ['*'] : array_map('trim', explode(',', $rawOrigins));

return [
    'paths'                    => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods'          => ['*'],
    'allowed_origins'          => $allowedOrigins,
    'allowed_origins_patterns' => [],
    'allowed_headers'          => ['*'],
    'exposed_headers'          => [],
    'max_age'                  => 0,
    'supports_credentials'     => false,
];
