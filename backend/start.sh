#!/usr/bin/env bash
# =============================================================================
# Habitta — Railway startup script
# Runs on every deploy/restart. Must be idempotent.
# =============================================================================
set -e

echo "▶ Habitta boot — $(date -u)"

# ── 1. Cache config, routes, views ────────────────────────────────────────────
php artisan config:cache
php artisan route:cache
php artisan view:cache
echo "✓ Cache warmed"

# ── 2. Storage symlink (ephemeral FS — recreate on every boot) ────────────────
php artisan storage:link 2>/dev/null || true
echo "✓ Storage linked"

# ── 3. Run pending migrations ─────────────────────────────────────────────────
php artisan migrate --force
echo "✓ Migrations done"

# ── 4. Start server ───────────────────────────────────────────────────────────
PORT="${PORT:-8000}"
echo "▶ Serving on 0.0.0.0:${PORT}"

# exec replaces this shell process so signals (SIGTERM) reach PHP directly
exec php artisan serve --host=0.0.0.0 --port="${PORT}"
