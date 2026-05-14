# Habitta — REV 7 Demo Checklist

## Quick-Start Commands

```bash
# Terminal 1 — Laravel backend
cd habitta-laravel
php artisan serve          # → http://localhost:8000

# Terminal 2 — React frontend
cd habitta-react
npm run dev                # → http://localhost:5173
```

---

## ✅ Feature Verification Checklist

### 1. Authentication
- [ ] Register at `/registro`
- [ ] Login at `/login` → JWT token stored in localStorage
- [ ] GET `/api/auth/usuario` returns `id, nombre, apellido, full_name, email, roles, notificaciones`

### 2. Role System
- [ ] `visitante_registrado` → can browse, favorite, chat; **cannot see "Publicar"** in sidebar
- [ ] `propietario` → can publish properties
- [ ] `admin` → full panel at `/admin/users` and `/admin/properties`

### 3. AI Furnishing (PRIORITY DEMO)
1. Open any property detail page (non-land type)
2. Click **"✨ Amueblar con IA"** button on the gallery image
3. A modal opens showing a loading spinner
4. After 5–90 seconds, the modal shows **ORIGINAL** vs **✨ AMUEBLADO CON IA** side by side
5. The generated image has: warm amber lighting, sofa silhouette, coffee table, floor lamp, bookshelf, rug, gold "IA GENERADA" badge

**Without HuggingFace key** → GD fallback runs locally (always works, visible transformation)
**With HuggingFace key** (set `HF_API_KEY=hf_xxx` in `.env`) → Real Stable Diffusion image

### 4. SQL VIEW — `properties_with_details`
Show the professor in `php artisan tinker`:
```php
# Query the view directly
DB::select('SELECT title, owner_nombre, owner_email, price, views_count, favorites_count FROM properties_with_details LIMIT 5');

# Or via the model scope
DB::table('properties_with_details')->where('status', 'active')->get();
```
**Location:** Migration `2026_05_02_000001_create_properties_with_details_view.php`

### 5. STORED PROCEDURE / TRIGGER
**SQLite (development):** `trg_log_property_view` fires on every view increment.

Demo in tinker:
```php
# Step 1: Check current log count
DB::table('property_view_logs')->count();  // → 0

# Step 2: Visit any property in the browser (increments views_count)
# Step 3: Back in tinker:
DB::table('property_view_logs')->get();
# → rows auto-inserted by the trigger, no application code involved!
```

**PostgreSQL (production):** `sp_active_properties_by_city()` function returns city statistics.
```sql
SELECT * FROM sp_active_properties_by_city();
```
**Location:** Migrations `2026_05_02_000002_...` and `2026_05_14_000001_...`

### 6. Apache / Nginx Configuration
- `deploy/apache.conf` — full VirtualHost with `AllowOverride All` + Authorization header passthrough
- `deploy/nginx.conf` — Nginx server block with PHP-FPM + SPA fallback + security headers

**Key Laravel requirement:** DocumentRoot must point to `public/`, not the project root.

### 7. Frontend Security
```bash
cd habitta-react
npm audit          # 0 vulnerabilities after npm audit fix
```
Fixed packages: `axios` (prototype pollution), `vite` (path traversal), `postcss` (XSS), `follow-redirects` (header leak)
Config file: `.npmrc` (audit-level=moderate enforced)

---

## Tests

```bash
# Laravel (52 tests)
cd habitta-laravel
php artisan test

# React (Vitest)
cd habitta-react
npm test
# or for a single run: npm run test:run
```

**Test coverage:**
- Auth: registro, login, login fallido, logout, obtener_usuario (AutenticacionTest)
- Properties: CRUD, filters, favorites toggle, view count, permissions (PropertyTest)
- AI endpoint: auth required, validation, GD fallback always returns original+generated (AiTest)
- Chat: conversations, messages, unread count (ChatTest)

---

## AI Feature — Technical Summary

| Scenario | Provider | How it works |
|---|---|---|
| `HF_API_KEY` set + model loads | HuggingFace `timbrooks/instruct-pix2pix` | Image-to-image: actual photo → furnished version |
| `HF_API_KEY` set + img2img fails | HuggingFace `stabilityai/stable-diffusion-2-1` | Text-to-image: generates a furnished room |
| No API key OR HF down | PHP GD (local, no network) | Warm filter + sofa + table + lamp + bookshelf drawn on original |

**GD fallback always runs without internet** — demo always works offline.

**Environment variable:**
```
# habitta-laravel/.env
HF_API_KEY=hf_YOUR_REAL_KEY_HERE
```

---

## Stored Procedure vs Trigger — Academic Note

SQLite does **not** support `CREATE PROCEDURE`. This is a known limitation:
- SQLite is a serverless embedded database; stored procedures are a server-side concept
- The academic equivalent in SQLite is a **trigger** (`CREATE TRIGGER`)
- Triggers provide the same encapsulation: logic stored in the database, executed automatically without application-level calls

The trigger `trg_log_property_view` (migration `2026_05_14_000001`) demonstrates this equivalence:
- Fires automatically when any property's `views_count` increases
- Inserts an audit row into `property_view_logs` with `views_before` and `views_after`
- Zero lines of application code are involved — the database handles it entirely

On **PostgreSQL** (production), the real stored procedure `sp_active_properties_by_city()` AND the trigger function `fn_log_property_view()` are both created, providing the full RDBMS feature set.

---

## Database Architecture Summary

| Object | Type | File |
|---|---|---|
| `properties_with_details` | SQL VIEW | `2026_05_02_000001_create_properties_with_details_view.php` |
| `sp_active_properties_by_city` | PostgreSQL FUNCTION | `2026_05_02_000002_create_sp_active_properties_by_city.php` |
| `trg_log_property_view` | SQLite TRIGGER + PostgreSQL TRIGGER | `2026_05_14_000001_create_property_view_trigger.php` |
| `property_view_logs` | Audit TABLE | Same migration |

---

## Demo Order for Professor

1. **Show React app** (`localhost:5173`) — browse properties, filters, map, card view
2. **Register / Login** — JWT token in DevTools > Application > localStorage
3. **AI Furnish** — click button on any house/apartment property image
4. **Admin Panel** (`/admin/users`) — show role management table
5. **Show SQL VIEW** — `php artisan tinker` → query `properties_with_details`
6. **Show Trigger** — visit a property → check `property_view_logs` in tinker
7. **Show tests** — `php artisan test` → 52/52 ✓
8. **Show npm audit** — `npm audit` → 0 vulnerabilities
9. **Show deploy configs** — open `deploy/apache.conf` and `deploy/nginx.conf`
10. **Show Blade panel** (`localhost:8000/login`) — same features, server-rendered
