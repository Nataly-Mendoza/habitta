# Habitta - API REST para Plataforma de Propiedades

Backend Laravel 12 para la plataforma Habitta. Gestiona autenticación, propiedades, favoritos, chat e integración con IA.

## Estructura

```
habitta/
├── app/                  # Logica de aplicacion
├── config/               # Configuracion
├── database/             # Migraciones y seeders
├── routes/               # Rutas API y web
├── resources/            # Vistas Blade
├── storage/              # Almacenamiento de archivos
├── tests/                # Tests automatizados
├── composer.json
├── .env.example
├── README.md
└── TESTING.md
```

## Inicio Rapido

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```

Backend disponible en: http://127.0.0.1:8000

## Requisitos

- PHP >= 8.2
- Extensiones: pdo, mbstring, xml, curl, gd, zip
- Composer
- PostgreSQL o SQLite (para base de datos)

## Documentacion

- Setup local: Ver [README.md](README.md)
- Pruebas: Ver [TESTING.md](TESTING.md)

## Ramas

- `main` - Rama principal (estable)
- `develop` - Rama de desarrollo
- `revision7/testing-baseline` - Linea base de testing
- `revision7/deploy-ready` - Lista para producción

## Licencia

MIT
