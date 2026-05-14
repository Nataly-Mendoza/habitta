# Habitta — Laravel API

API REST para plataforma de propiedades. Gestiona autenticación, propiedades, favoritos, chat y análisis con IA.

## Requisitos del Sistema

- PHP >= 8.2
- Extensiones: pdo, mbstring, xml, curl, gd, zip
- Composer (https://getcomposer.org)
- PostgreSQL o SQLite (para desarrollo local)

## Instalacion Local

Clonar repositorio y cambiar a rama de testing:

```bash
cd habitta-laravel
git checkout revision7/testing-baseline
```

Instalar dependencias:

```bash
composer install
```

Configurar ambiente:

```bash
cp .env.example .env
php artisan key:generate
```

## Base de Datos

Elegir una opcion:

### Opcion A - SQLite (Desarrollo Local)

Recomendado para testing. No requiere instalacion adicional.

```bash
touch database/database.sqlite
```

En .env:

```env
DB_CONNECTION=sqlite
DB_DATABASE=/ruta/absoluta/a/database/database.sqlite
```

### Opcion B - PostgreSQL (Produccion)

Requiere PostgreSQL 12+ instalado.

En .env:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=habitta
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña
```

Crear base de datos:

```bash
createdb habitta
```

## Ejecutar Migraciones y Seeders

Esto crea las tablas, vistas y procedimientos almacenados necesarios, además de insertar datos de prueba:

```bash
php artisan migrate:fresh --seed
```

## Iniciar Servidor

```bash
php artisan serve
```

Accesible en: http://127.0.0.1:8000

## Variables de Entorno

| Variable | Descripcion |
|---|---|
| `APP_KEY` | Generado con `php artisan key:generate` |
| `APP_URL` | URL del servidor (ej. `http://localhost:8000`) |
| `FRONTEND_URL` | URL del frontend React (ej. `http://localhost:5173`) |
| `DB_CONNECTION` | `sqlite` o `pgsql` |
| `HUGGINGFACE_API_KEY` | Opcional: clave para IA. Si no existe, usa fallback |

## Usuarios de Prueba

Disponibles despues de ejecutar seeders:

| Email | Contraseña | Rol |
|---|---|---|
| admin@habitta.mx | Admin123! | admin |
| prop@habitta.mx | Prop123! | propietario |
| user@habitta.mx | User123! | visitante_registrado |

## Roles y Permisos

- **admin**: Acceso total. Puede eliminar cualquier propiedad, cambiar roles de usuarios.
- **propietario**: Crear, editar y cerrar propiedades propias.
- **visitante_registrado**: Ver propiedades, agregar favoritos, acceder a chat e IA.

## Pruebas

Ejecutar tests:

```bash
php artisan test
```

Tests disponibles:
- Autenticacion (login, registro, validacion)
- Propiedades (crear, editar, cerrar)
- Chat (mensajes, conversaciones)
- IA (analisis de propiedades)
- Modelos (relaciones, atributos)
DB_DATABASE=habitta
DB_USERNAME=postgres
DB_PASSWORD=tu_password_seguro
```

**Pasos para configurar PostgreSQL:**

```bash
# 1. Crear la base de datos
psql -U postgres -c "CREATE DATABASE habitta;"

# 2. Correr migraciones y seeders
php artisan migrate --seed

# 3. La vista y el stored procedure se crean automáticamente
#    - Vista:               properties_with_details
#    - Stored procedure:    sp_active_properties_by_city()
```

**Nota:** Las migraciones detectan el driver automáticamente. El stored procedure
solo se crea en PostgreSQL; en SQLite se omite sin error.

---

## Despliegue en Apache

### Requisitos

- PHP >= 8.2 con extensiones: `pdo`, `pdo_pgsql` (o `pdo_sqlite`), `gd`, `mbstring`, `xml`, `curl`, `zip`
- `mod_rewrite` habilitado en Apache
- `AllowOverride All` en el VirtualHost

### Document root

El document root de Apache **debe apuntar a la carpeta `public/`**, no a la raíz del proyecto.

```apache
<VirtualHost *:80>
    ServerName habitta.local
    DocumentRoot /var/www/habitta-laravel/public

    <Directory /var/www/habitta-laravel/public>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

### Pasos de despliegue

```bash
# 1. Clonar el repositorio
git clone <repo-url> /var/www/habitta-laravel
cd /var/www/habitta-laravel

# 2. Instalar dependencias
composer install --no-dev --optimize-autoloader

# 3. Configurar entorno
cp .env.example .env
php artisan key:generate
# Editar .env con los valores de producción

# 4. Migraciones y assets
php artisan migrate --seed --force
php artisan storage:link
php artisan config:cache
php artisan route:cache

# 5. Permisos
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### .htaccess

El archivo `public/.htaccess` ya está configurado correctamente con:
- `RewriteEngine On` para ruteo de Laravel
- Passthrough de cabeceras `Authorization` y `X-XSRF-Token`

---

## Roles y permisos

| Rol | Puede crear propiedades | Puede editar sus propiedades | Puede cerrar propiedades | Puede eliminar | Usa IA | Chat | Favoritos |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `admin` | ✓ | ✓ cualquiera | ✓ cualquiera | ✓ cualquiera | ✓ | ✓ | ✓ |
| `propietario` | ✓ | ✓ solo propias | ✓ solo propias | ✗ | ✓ | ✓ | ✓ |
| `visitante_registrado` | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ |

**Cuentas de prueba (después de `--seed`):**

| Email | Contraseña | Rol |
|---|---|---|
| `admin@habitta.mx` | `Admin123!` | admin |
| `prop@habitta.mx` | `Prop123!` | propietario |
| `maria@habitta.mx` | `Prop123!` | propietario |
| `user@habitta.mx` | `User123!` | visitante_registrado |

---

## Tests

```bash
php artisan test
```

Todos los tests usan SQLite en memoria (`:memory:`). No requieren PostgreSQL instalado.

---

## Reglas del equipo

- No modificar: `config/`, `app/Providers/`, `bootstrap/app.php` sin revisión del equipo
- Solo trabajar en: `app/Http/Controllers/`, `routes/`, `app/Models/`, `app/Services/`, `app/Policies/`
- Un PR por feature, tests requeridos
