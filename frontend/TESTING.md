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
npm install
npm run dev
```

Frontend disponible en: http://localhost:5173

Asegurar que VITE_API_URL esta configurado en .env:
```env
VITE_API_URL=http://localhost:8000/api
```

## Usuarios de Prueba

- admin@habitta.mx / Admin123!
- prop@habitta.mx / Prop123!
- user@habitta.mx / User123!

## Checklist Obligatorio de Testing

### Autenticacion

- [ ] Pantalla de login carga correctamente
- [ ] Login funciona con credenciales correctas
- [ ] Login falla con credenciales incorrectas
- [ ] Formulario de registro funciona
- [ ] Registro crea usuario nuevo
- [ ] Logout funciona
- [ ] Sesion persiste al recargar pagina
- [ ] Rutas protegidas redirigen a login

### Roles y Permisos

- [ ] visitante_registrado NO ve opcion crear propiedad
- [ ] propietario VE opcion crear propiedad
- [ ] propietario PUEDE crear propiedad
- [ ] admin PUEDE acceder a panel administrativo
- [ ] No-admin NO PUEDE acceder a panel administrativo
- [ ] Menu muestra opciones correctas segun rol

### Propiedades - Gestión

- [ ] Crear propiedad (propietario): formulario completo
- [ ] Subir imagenes: funciona con multiples archivos
- [ ] Editar propiedad: SOLO dueno puede editar
- [ ] Cerrar propiedad: aparece opcion y funciona
- [ ] Propiedades cerradas desaparecen del catalogo
- [ ] Tipo de propiedad: renta se muestra correctamente
- [ ] Tipo de propiedad: venta se muestra correctamente

### Catalogo

- [ ] Carga lista de propiedades disponibles
- [ ] Filtros funcionan (ubicacion, tipo, precio)
- [ ] Paginacion funciona si hay multiples propiedades
- [ ] Propiedades cerradas NO aparecen
- [ ] Imagenes de propiedades cargan correctamente
- [ ] Click en propiedad abre detalle

### Detalles de Propiedad

- [ ] Muestra toda la informacion (descripcion, imagenes, dueno)
- [ ] Galeria de imagenes funciona
- [ ] Boton Chat aparece si usuario esta logueado
- [ ] Boton Favorito funciona

### Favoritos

- [ ] Agregar a favoritos funciona
- [ ] Remover de favoritos funciona
- [ ] Contador de favoritos actualiza en tiempo real
- [ ] Favoritos persisten al recargar pagina
- [ ] Lista de favoritos en dashboard muestra todos agregados
- [ ] Cada usuario solo ve sus favoritos

### Chat

- [ ] Iniciar chat con dueno de propiedad funciona
- [ ] Enviar mensaje funciona
- [ ] Ver historial de mensajes funciona
- [ ] Nuevo mensaje aparece en conversacion
- [ ] Listar conversaciones funciona
- [ ] visitante_registrado NO ve chats de otros usuarios
- [ ] Interfaz de chat es clara y usable

### IA

- [ ] Botón IA aparece en detalles de propiedad
- [ ] Click en IA abre modal
- [ ] IA genera contenido para propiedad de VENTA (venta)
- [ ] IA genera contenido para propiedad de RENTA (renta)
- [ ] CONOCIDO: IA puede fallar en propiedades de renta - DEBE TESTEARSE
- [ ] Respuesta es relevante y util
- [ ] Error se muestra gracefully si API no esta disponible
- [ ] Solo logueados pueden usar IA

### Panel Admin

- [ ] Solo admin accede a /dashboard/admin
- [ ] Ver lista de propiedades: muestra TODAS
- [ ] Ver lista de usuarios: muestra TODOS
- [ ] Cambiar rol de usuario: funciona y se refleja
- [ ] Eliminar propiedad: funciona
- [ ] Cambio de rol se refleja inmediatamente en UI
- [ ] Filtros en panel funcionan

### Dashboard Segun Rol

- [ ] visitante_registrado VE: mis favoritos, mis chats, mis propiedades cerradas
- [ ] propietario VE: crear propiedad, mis propiedades activas, cerrar propiedad
- [ ] admin VE: panel administrativo con todas las opciones

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
Abrir F12 > Console y copiar cualquier error.
```

Ejemplo:

```
[IA] - Falla en propiedades de renta - ALTA

Descripcion:
Botón IA no funciona en propiedades de renta.

Pasos para Reproducir:
1. Login como user@habitta.mx
2. Ir a catalogo
3. Abrir propiedad de renta
4. Click en botón IA
5. Ver error en consola

Resultado Esperado:
IA genera descripcion.

Resultado Actual:
Error 500 - Internal Server Error en consola
```

## Resolucion de Problemas

### Pagina Blanca o No Carga

1. Verificar que backend esta corriendo:
   ```
   http://127.0.0.1:8000
   ```

2. Ver consola (F12):
   - CORS error? Backend tiene FRONTEND_URL=http://localhost:5173 en .env?
   - Network error? Backend responde?

3. Reiniciar:
   ```bash
   npm run dev
   ```

### No Conecta a API

Verificar VITE_API_URL en .env:

```env
VITE_API_URL=http://localhost:8000/api
```

Debe coincidir exactamente. Reiniciar con `npm run dev`.

### Error en Consola (F12)

Copiar mensaje completo en reporte de bug.

### IA No Funciona

- Es area en testing activo
- Revisar que backend esta corriendo
- Revisar error en consola del navegador
- Reportar cualquier problema

### Propiedades No Cargan

- Verificar que backend migro datos: `php artisan migrate:fresh --seed`
- Verificar API responds: `curl http://127.0.0.1:8000/api/properties`
- Ver logs del navegador (F12 > Network)

## Verificacion Pre-Testing

Antes de comenzar:

1. Clonar React:
   ```bash
   git clone https://gitlab.com/habitta-ecuipo/habitta-react.git
   cd habitta-react
   git checkout revision7/testing-baseline
   ```

2. Instalar:
   ```bash
   npm install
   ```

3. Configurar .env:
   ```env
   VITE_API_URL=http://localhost:8000/api
   VITE_USAR_MOCK=false
   ```

4. Iniciar:
   ```bash
   npm run dev
   ```

5. Verificar:
   - Frontend: http://localhost:5173
   - Backend debe estar corriendo en http://127.0.0.1:8000
   - Probar login con usuarios de prueba

6. Si algo falla:
   - Ver logs del navegador (F12)
   - Ver logs del backend (storage/logs/laravel.log)
   - Hacer reset: `php artisan migrate:fresh --seed`

## Notas Importantes

- Esta rama es LINEA BASE para revision 7
- Toda documentacion esta en README.md y TESTING.md
- Cualquier problema: reportar en formato especificado
- NO intentar arreglar nada en esta rama
- Cambios post-testing iran en ramas separadas
