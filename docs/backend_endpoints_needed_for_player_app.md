# backend_endpoints_needed_for_player_app

La app cliente quedo preparada para usar endpoints publicos/mobile de jugador sin depender de la API privada del POS.

## Endpoints recomendados

- `POST /api/player/auth/login`
  - Login publico del jugador.
  - Debe devolver token o sesion mobile y el perfil actual.

- `POST /api/player/auth/register`
  - Registro publico del jugador.
  - Debe crear cuenta de jugador y devolver sesion inicial.

- `POST /api/player/auth/logout`
  - Cierre de sesion mobile.

- `GET /api/player/me`
  - Perfil actual del jugador autenticado.

- `PUT /api/player/me`
  - Actualiza `name`, `phone`, `profile_photo`, `remove_profile_photo`.

- `GET /api/player/dashboard`
  - Resumen para home: `recentOrders`, `recentTournaments`, `stats`, `preorders`.

- `GET /api/player/orders`
  - Historial de compras del jugador ligadas al `customer` del storefront.

- `GET /api/player/tournaments`
  - Debe devolver al menos `upcoming`, `history`, `stats`.

- `POST /api/player/tournaments/{tournament}`
  - Registro del jugador en torneo.

- `GET /api/player/preorders`
  - Preventas del jugador con `total`, `paid`, `pending`, `status`, `delivery_status`.

## Nota

La app usa `VITE_PLAYER_API_MODE=mock` por defecto para no consumir accidentalmente la API privada actual de Sanctum restringida a `admin/manager/cashier`.

## Verificacion Contra Repo Remoto

Se comparo esta app con el repo remoto `Darkerz97/WebCardBastion` en GitHub y la rama `main` actual no trae:

- rutas `/api/player/...`
- `PlayerAuthController` API expuesto para mobile
- callback Google mobile hacia `com.cardbastion.clientes://auth/callback`

Eso explica que la app muestre:

- `La ruta API no existe en el servidor configurado.`
- retorno a pagina web en lugar de volver a la app al usar Google

## Contrato Esperado Para Google Mobile

Flujo esperado por la app:

- abrir `https://www.cardbastion.com/auth/google?platform=capacitor&redirect_uri=com.cardbastion.clientes://auth/callback`
- el backend debe conservar ese `redirect_uri` mobile hasta terminar el callback, incluso si el navegador o el hosting no preservan la sesion original
- si el backend autentica correctamente, responder con redirect a:
  - `com.cardbastion.clientes://auth/callback?token=...&name=...&email=...&phone=...&profile_photo_url=...`
- si falla, responder con redirect a:
  - `com.cardbastion.clientes://auth/callback?error=...`

## Recuperacion De Password

La app ya soporta estas rutas web existentes del servidor para recuperacion:

- `GET /recuperar-contrasena`
- `POST /recuperar-contrasena`
- `GET /restablecer-contrasena/{token}`
- `POST /restablecer-contrasena`

Del lado mobile:

- `/forgot-password` abre el flujo oficial del servidor
- `/reset-password/:token?` permite continuar desde un enlace recibido por correo

No se requiere API JSON nueva para password reset si el flujo web del servidor sigue disponible.

## Nota Operativa

Mientras el backend remoto no publique ese contrato, mantener:

- `VITE_PLAYER_API_MODE=mock`

o desplegar primero la version del servidor que implemente las rutas y el callback mobile.
