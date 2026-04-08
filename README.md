# AppClientBastion

App cliente mobile-first de Card Bastion construida con Vue 3, Vite y Capacitor.

## Modulos actuales

- autenticacion de cliente
- dashboard principal
- perfil editable
- compras
- preventas
- torneos

## Arquitectura

La app separa UI, router, store, servicios, tipos y utilidades.

- `src/pages`: pantallas
- `src/components`: componentes reutilizables
- `src/stores`: estado global de sesion
- `src/services`: acceso a datos por dominio
- `src/types`: normalizadores de entidades
- `src/utils`: formateo y errores

## Modo de datos

Por seguridad la app usa `mock` por defecto para no consumir accidentalmente la API privada del POS.

Si el backend Laravel expone endpoints publicos/mobile para jugador, activa el modo real en `.env`:

```env
VITE_PLAYER_API_MODE=api
VITE_PLAYER_AUTH_LOGIN_PATH=/api/player/auth/login
VITE_PLAYER_AUTH_REGISTER_PATH=/api/player/auth/register
VITE_PLAYER_AUTH_LOGOUT_PATH=/api/player/auth/logout
VITE_PLAYER_PROFILE_ME_PATH=/api/player/me
VITE_PLAYER_PROFILE_UPDATE_PATH=/api/player/me
VITE_PLAYER_DASHBOARD_PATH=/api/player/dashboard
VITE_PLAYER_ORDERS_PATH=/api/player/orders
VITE_PLAYER_TOURNAMENTS_PATH=/api/player/tournaments
VITE_PLAYER_TOURNAMENT_REGISTER_PATH=/api/player/tournaments/:tournamentId
VITE_PLAYER_PREORDERS_PATH=/api/player/preorders
VITE_APP_AUTH_CALLBACK_URL=com.cardbastion.clientes://auth/callback
```

Los endpoints faltantes y el contrato esperado estan documentados en `docs/backend_endpoints_needed_for_player_app.md`.

## Google Login En Android

La app abre Google auth en el navegador del sistema y espera volver por deep link a:

```env
VITE_APP_AUTH_CALLBACK_URL=com.cardbastion.clientes://auth/callback
```

Para que el flujo funcione en produccion:

- el backend web debe recibir el callback de Google en `https://www.cardbastion.com/auth/google/callback`
- ese mismo URL debe existir en Google Cloud como `Authorized redirect URI`
- despues de autenticar, el backend debe redirigir a la app con el token del jugador usando el esquema `com.cardbastion.clientes://auth/callback`
- Android necesita `@capacitor/app` para capturar el deep link y `@capacitor/browser` para abrir el flujo externo

## Desarrollo

```powershell
npm install
npm run dev
```

## Validacion

```powershell
npm run build
```
