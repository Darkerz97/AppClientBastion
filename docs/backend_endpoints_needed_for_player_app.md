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
