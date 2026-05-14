# Habitta - Plataforma de Propiedades

Monorepo que contiene el backend (Laravel) y frontend (React) de la plataforma Habitta.

## Estructura

```
habitta/
├── backend/              # API REST con Laravel 12
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── composer.json
│   └── README.md
│
├── frontend/             # Interfaz con React + Vite + TypeScript
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
│
└── README.md (este archivo)
```

## Inicio Rapido

### Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```

Backend disponible en: http://127.0.0.1:8000

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend disponible en: http://localhost:5173

## Requisitos

- PHP >= 8.2 (Backend)
- Node.js >= 16 (Frontend)
- PostgreSQL o SQLite (Base de datos)

## Documentacion

- Backend: Ver [backend/README.md](backend/README.md)
- Frontend: Ver [frontend/README.md](frontend/README.md)
- Testing: Ver [backend/TESTING.md](backend/TESTING.md) y [frontend/TESTING.md](frontend/TESTING.md)

## Ramas

- `main` - Rama principal (estable)
- `develop` - Rama de desarrollo
- `revision7/testing-baseline` - Linea base de testing
- `revision7/deploy-ready` - Lista para producción

## Team

Desarrollado por Habitta Equipo.

## Licencia

MIT
