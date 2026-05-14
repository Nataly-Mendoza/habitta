# Habitta — React Frontend

Frontend para plataforma de propiedades. Interfaz con autenticacion, gestión de propiedades, chat e integración con IA.

## Requisitos del Sistema

- Node.js >= 16 (se recomienda 18 o superior)
- npm (incluido con Node.js)

## Instalacion Local

Clonar repositorio y cambiar a rama de testing:

```bash
cd habitta-react
git checkout revision7/testing-baseline
```

Instalar dependencias:

```bash
npm install
```

## Iniciar Servidor de Desarrollo

```bash
npm run dev
```

Accesible en: http://localhost:5173

El servidor espera que el backend este disponible en: http://127.0.0.1:8000/api

## Configuracion

El archivo .env debe contener:

```env
VITE_API_URL=http://localhost:8000/api
VITE_USAR_MOCK=false
```

Si VITE_API_URL no esta configurado correctamente, la aplicacion no podra conectarse al backend.

## Usuarios de Prueba

| Email | Contraseña | Rol |
|---|---|---|
| admin@habitta.mx | Admin123! | admin |
| prop@habitta.mx | Prop123! | propietario |
| user@habitta.mx | User123! | visitante_registrado |

## Caracteres del Proyecto

- React 19 + TypeScript
- Vite 8 para desarrollo y construccion rapida
- React Router 7 para navegacion
- React Hook Form + Zod para validacion de formularios
- Tailwind CSS para estilos
- Axios para comunicacion con API

## Rutas Protegidas

- `/login` - Autenticacion
- `/registro` - Creacion de cuenta
- `/catalogo` - Listado de propiedades (publico)
- `/dashboard` - Panel segun rol (protegido)
- `/dashboard/propiedades` - Gestión de propiedades (propietario)
- `/dashboard/admin` - Panel administrativo (admin)
- `/dashboard/chats` - Mensajeria (registrado)

## Pruebas

Ejecutar suite de tests:

```bash
npm run test:run
```

Ver tests interactivo:

```bash
npm run test:ui
```

Lint del codigo:

```bash
npm run lint
```

## Compilacion para Produccion

```bash
npm run build
```

Se genera carpeta `dist/` lista para deploy.

---

## 🚀 Quick Start

### 1. Instalación
```bash
cd habitta-react
npm install
```

### 2. Variables de Entorno
```bash
# .env.local
VITE_API_URL=http://localhost:8000/api
VITE_USAR_MOCK=true
```

### 3. Iniciar Servidor
```bash
npm run dev
# Abre: http://localhost:5174
```

### 4. Ejecutar Tests
```bash
npm run test
# 11+ tests ejecutándose
```

---

## 📱 Rutas Disponibles

### Públicas
| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | HomePage | Página de inicio |
| `/inicio` | HomePage | Alias de inicio |
| `/catalogo` | Catalogo | Búsqueda de propiedades |
| `/login` | Login | Iniciar sesión |
| `/registro` | Registro | Crear cuenta |

### Protegidas (Requieren Login)
| Ruta | Página | Rol Requerido |
|------|--------|---------------|
| `/panel` | Dashboard | Autenticado |

---

## 🔑 Credenciales de Prueba

```
Email: user@habitta.mx
Contraseña: User123!
Rol: Propietario

(En modo mock - puedes crear nuevas cuentas)
```

---

## 🏗️ Estructura de Componentes

### Autenticación
```
src/
├── services/
│   └── autenticacion.ts          # API de autenticación
├── context/
│   └── ContextoAutenticacion.tsx  # Context global + localStorage
├── hooks/
│   └── useAutenticacion.ts        # Hook para acceder al contexto
├── components/
│   ├── RutaProtegida.tsx          # Protección por autenticación
│   └── RutaPorRol.tsx             # Protección por rol/permiso
└── mocks/
    └── permisos.mock.ts           # Roles y permisos mockados
```

### Páginas
```
src/pages/
├── Login.tsx                      # Formulario de login
├── Registro.tsx                   # Formulario de registro
├── dashboard.tsx                  # Panel del usuario
├── Inicio.tsx                     # Página de inicio
├── catalogo.tsx                   # Catálogo de propiedades
```

### Validación
```
src/types/
└── schemas.ts                     # Zod schemas para Login/Registro
```

---

## 🧪 Testing Completo

### Ejecutar todos los tests
```bash
npm run test
```

### Tests por componente
```bash
# Autenticación
npm run test -- Login.test
npm run test -- RutaProtegida.test
npm run test -- ContextoAutenticacion.test

# Páginas
npm run test -- Dashboard.test
npm run test -- HomePage.test
npm run test -- Catalogo.test

# Roles
npm run test -- RutaPorRol.test
```

### Cobertura de Tests
```bash
npm run test -- --coverage
```

---

## 🔐 Roles y Permisos

### Propietario
✅ crear_propiedad  
✅ editar_propiedad  
✅ eliminar_propiedad  
✅ ver_propiedades  
✅ ver_dashboard  
✅ ver_ofertas  
✅ aceptar_oferta

### Comprador
✅ ver_propiedades  
✅ contactar_propietario  
✅ ver_dashboard  
✅ ver_favoritos

### Admin
✅ Todos los permisos (9 total)

### Usar en Componentes
```typescript
import { tienePermiso } from "@/mocks/permisos.mock";
import { useAutenticacion } from "@/hooks/useAutenticacion";

function MiComponente() {
  const { usuario } = useAutenticacion();
  
  if (tienePermiso(usuario.rol.nombre, "crear_propiedad")) {
    return <button>Crear propiedad</button>;
  }
}
```

---

## 📦 Dependencias Principales

```json
{
  "react": "^18.3.1",
  "typescript": "^5.2.2",
  "react-router": "^7.x",
  "react-hook-form": "^7.48.0",
  "zod": "^3.22.4",
  "@hookform/resolvers": "^3.3.4",
  "axios": "^1.6.2",
  "lucide-react": "^0.294.0",
  "tailwindcss": "^3.4.1",
  "vitest": "^1.0.4",
  "@testing-library/react": "^14.1.2"
}
```

---

## 🎨 Características de UI

- **Diseño Responsive** - Funciona en mobile, tablet, desktop
- **Tailwind CSS** - Estilos modernos y limpios
- **Iconos Lucide** - Icons consistentes
- **Validación en Tiempo Real** - Feedback inmediato

---

## 📈 Flujo de Autenticación

```
1. Usuario no autenticado → /login
2. Ingresa email y contraseña
3. Validación con Zod
4. API autenticacion.ts (mock)
5. Token + Usuario guardados en localStorage
6. Context actualizado
7. Redirige a /panel (protegido)
8. Dashboard muestra datos del usuario
9. Logout limpia localStorage
10. Vuelve a /login
```

---

## 📋 Checklist de Cumplimiento

- [x] Rev3: 6+ Tests (11 implementados)
- [x] Rev4: Login + Registro
- [x] Rev4: Sistema de Roles y Permisos
- [x] Rev5: 6+ Componentes
- [x] TypeScript Strict Mode
- [x] Validación con Zod
- [x] localStorage Persistence
- [x] Protected Routes
- [x] Hot Module Replacement (HMR)
- [x] Error Handling completo

---

**Última actualización:** Abril 16, 2026  
**Estado:** ✅ Listo para producción (React)

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
