# Testing Baseline - revision7/testing-baseline

Esta rama es una captura de linea base (baseline) de todo el codigo de trabajo actual. Su proposito es SOLO PRUEBAS antes de la revision 7 de desarrollo.

## Reglas Obligatorias

- NO arreglar bugs
- NO crear ramas nuevas
- SOLO probar, reportar y documentar problemas
- NO cambiar configuracion del proyecto

## Resumen de Instalacion

Para mas detalles, ver README.md

```bash
git checkout revision7/testing-baseline
composer install
cp .env.example .env
php artisan key:generate

# Base de datos: SQLite (recomendado) o PostgreSQL
touch database/database.sqlite

php artisan migrate:fresh --seed
php artisan serve
```

Backend disponible en: http://127.0.0.1:8000

## Usuarios de Prueba

- admin@habitta.mx / Admin123!
- prop@habitta.mx / Prop123!
- user@habitta.mx / User123!

## Checklist Obligatorio de Testing

### Autenticacion

- [ ] Login funciona con credenciales correctas
- [ ] Login falla con credenciales incorrectas
- [ ] Registro crea usuario nuevo
- [ ] Logout funciona y limpia sesion
- [ ] Sesion persiste al recargar pagina
- [ ] Rutas protegidas redirigen a login si no hay sesion

### Roles y Permisos

- [ ] visitante_registrado NO puede crear propiedades
- [ ] propietario PUEDE crear propiedades
- [ ] propietario puede editar SOLO sus propiedades
- [ ] admin PUEDE eliminar cualquier propiedad
- [ ] admin PUEDE cambiar roles de usuarios
- [ ] Interfaz muestra opciones correctas segun rol

### Propiedades

- [ ] Crear propiedad funciona (solo propietario)
- [ ] Editar propiedad funciona (solo dueno)
- [ ] Cerrar propiedad funciona con razon
- [ ] Propiedades cerradas no aparecen en catalogo
- [ ] Subir multiples imagenes funciona
- [ ] Propiedades de renta (renta) se crean correctamente
- [ ] Propiedades de venta (venta) se crean correctamente

### Favoritos

- [ ] Agregar a favoritos funciona
- [ ] Remover de favoritos funciona
- [ ] Contador de favoritos actualiza correctamente
- [ ] Favoritos persisten al recargar pagina
- [ ] Favoritos son unicos por usuario

### Chat

- [ ] Iniciar conversacion con dueno funciona
- [ ] Enviar mensaje funciona
- [ ] Recibir mensaje funciona
- [ ] Historial de chat se mantiene
- [ ] visitante_registrado NO puede ver chats de otros
- [ ] No hay acceso cruzado entre usuarios

### IA

- [ ] Botón IA aparece cuando usuario esta logueado
- [ ] IA funciona en propiedades de RENTA (renta)
- [ ] IA funciona en propiedades de VENTA (venta)
- [ ] Respuesta de IA es relevante
- [ ] IA falla gracefully si API no esta disponible
- [ ] CONOCIDO: IA puede fallar en propiedades de renta - DEBE TESTEARSE

### Panel Admin

- [ ] Admin accede a panel administrativo
- [ ] No-admin NO accede a panel administrativo
- [ ] Ver todas las propiedades funciona
- [ ] Eliminar propiedad funciona
- [ ] Cambiar rol de usuario funciona
- [ ] Cambio de rol se refleja en interfaz inmediatamente

## Formato de Reporte de Errores

Reportar bugs con este formato:

```
[AREA] - [PROBLEMA] - [SEVERIDAD: BAJA/MEDIA/ALTA/CRITICA]

Descripcion:
Explicar que esta roto o inesperado.

Pasos para Reproducir:
1. Paso 1
2. Paso 2
3. Paso 3

Resultado Esperado:
Que deberia pasar.

Resultado Actual:
Que paso realmente.

Logs/Capturas:
Copiar mensaje de error si existe.
```

Ejemplo:

```
[IA] - Falla en propiedades de renta - ALTA

Descripcion:
Botón IA retorna error 500 en propiedades de renta.

Pasos para Reproducir:
1. Login como user@habitta.mx
2. Ir a una propiedad de renta (DB tiene datos de seed)
3. Hacer click en botón IA
4. Ver error en consola

Resultado Esperado:
IA genera descripcion de propiedad.

Resultado Actual:
Error 500 - Internal Server Error
```

## Resolucion de Problemas

### Base de Datos Falla

Si las migraciones fallan:

```bash
php artisan migrate:fresh --seed
```

Si persiste: verificar que database.sqlite existe en carpeta `database/`

### No Se Conecta a Propiedades

Verificar que:
- Backend esta corriendo: `php artisan serve`
- Frontend esta corriendo en otra terminal: `npm run dev`
- FRONTEND_URL en .env.example coincide con puerto de React

### Error en IA

- Verificar que HUGGINGFACE_API_KEY esta en .env (opcional, tiene fallback)
- Revisar `storage/logs/laravel.log` para detalles
- Es un area en testing activo - reportar cualquier problema

### Error 500 en API

Ver logs:

```bash
tail -f storage/logs/laravel.log
```

O en tiempo real:

```bash
php artisan pail
```

## Verificacion Pre-Testing

Antes de comenzar pruebas:

1. Clonar repositorio:
   ```bash
   git clone https://gitlab.com/habitta-ecuipo/habitta-laravel.git
   cd habitta-laravel
   git checkout revision7/testing-baseline
   ```

2. Instalar:
   ```bash
   composer install
   cp .env.example .env
   php artisan key:generate
   ```

3. Base de datos:
   ```bash
   touch database/database.sqlite
   php artisan migrate:fresh --seed
   ```

4. Iniciar:
   ```bash
   php artisan serve
   ```

5. Frontend en otra terminal:
   ```bash
   cd ../habitta-react
   git checkout revision7/testing-baseline
   npm install
   npm run dev
   ```

6. Acceder:
   - Frontend: http://localhost:5173
   - Backend: http://127.0.0.1:8000
   - Usar usuarios de prueba proporcionados

## Contacto y Dudas

En caso de dudas sobre el proceso de testing, preguntar al equipo.
NO intentar arreglar problemas en esta rama.
