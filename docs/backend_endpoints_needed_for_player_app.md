# Backend endpoints needed for player app

La app cliente de Card Bastion ya quedo preparada para operar en modo `mock` o `api` sin depender de la API privada del POS. Este documento resume el contrato minimo que el backend Laravel debe exponer para que el MVP funcione completo.

## Base

- Base sugerida: `/api/player`
- Auth: `Bearer token`
- Formato sugerido de respuesta: `{ data: ... }` o JSON plano equivalente

## Auth

### `POST /api/player/auth/login`

- Auth requerida: no
- Payload:
```json
{
  "email": "cliente@cardbastion.com",
  "password": "secret",
  "device_name": "card-bastion-client-app"
}
```
- Response minima:
```json
{
  "data": {
    "token": "plain-text-token",
    "customer": {
      "id": 17,
      "name": "Damian Bastion",
      "email": "cliente@cardbastion.com",
      "phone": "555-010-2026",
      "profile_photo_url": null,
      "role": "player",
      "active": true,
      "account_status": "Cuenta al corriente",
      "credit_balance": 240,
      "available_credit": 240,
      "reward_points": 1320,
      "sales_count": 4,
      "tier_name": "Oro",
      "tier_code": "gold"
    }
  }
}
```

### `POST /api/player/auth/register`

- Auth requerida: no
- Payload:
```json
{
  "name": "Nuevo Cliente",
  "email": "nuevo@cardbastion.com",
  "phone": "555-000-0000",
  "password": "secret",
  "password_confirmation": "secret"
}
```
- Response minima: misma estructura que login

### `POST /api/player/auth/logout`

- Auth requerida: si
- Payload: vacio
- Response minima:
```json
{
  "data": {
    "success": true
  }
}
```

## Profile

### `GET /api/player/me`

- Auth requerida: si
- Payload: none
- Response minima: objeto `customer` con la misma estructura del login

### `PUT /api/player/me`

- Auth requerida: si
- Payload `multipart/form-data`:
  - `name`
  - `phone`
  - `profile_photo` opcional
  - `remove_profile_photo` opcional
- Response minima: perfil actualizado

## Dashboard

### `GET /api/player/dashboard`

- Auth requerida: si
- Payload: none
- Response minima:
```json
{
  "data": {
    "profile": {},
    "recent_orders": [],
    "recent_tournaments": [],
    "registered_tournaments": [],
    "preorders": [],
    "rewards": {
      "points_balance": 1320,
      "credit_balance": 240,
      "reward_balance": 1560,
      "expiring_points": 120,
      "expiring_at": "2026-06-30T23:59:00-06:00"
    },
    "tier_progress": {
      "current_tier": {},
      "next_tier": {},
      "progress_percentage": 68,
      "points_to_next_tier": 380,
      "current_points": 1320,
      "tracked_metric_label": "Puntos acumulados"
    },
    "notifications": [],
    "stats": {
      "attended": 7,
      "matches_played": 19,
      "wins": 11,
      "losses": 6,
      "draws": 2,
      "win_streak": 3,
      "wl_rate": 0.579
    }
  }
}
```

## Tournaments

### `GET /api/player/tournaments`

- Auth requerida: si
- Payload: none
- Response minima:
```json
{
  "data": {
    "upcoming": [],
    "mine": [],
    "history": [],
    "stats": {
      "attended": 7,
      "wins": 11,
      "losses": 6,
      "draws": 2,
      "wl_rate": 0.579
    }
  }
}
```

Cada torneo debe poder incluir:
```json
{
  "id": 72,
  "name": "Commander Weekend",
  "format": "Commander",
  "type": "Casual con premios",
  "starts_at": "2026-04-26T16:00:00-06:00",
  "ends_at": "2026-04-26T20:00:00-06:00",
  "status": "Abierto",
  "published": true,
  "capacity": 40,
  "registrations_count": 26,
  "entry_fee": 120,
  "prize_pool": 1800,
  "location": "Card Bastion Centro",
  "description": "Mesa casual con premios",
  "registration_closes_at": "2026-04-26T15:50:00-06:00",
  "check_in_required": false,
  "my_registration": {
    "id": 7002,
    "status": "paid",
    "label": "Inscrito pagado",
    "payment_status": "Pagado",
    "payment_pending": 0,
    "registered_at": "2026-04-12T10:20:00-06:00",
    "check_in_at": null,
    "final_position": null,
    "result": null,
    "notes": "Presentate 15 minutos antes"
  }
}
```

### `GET /api/player/tournaments/{tournamentId}`

- Auth requerida: si
- Payload: none
- Response minima: mismo torneo con extras:
  - `rules[]`
  - `prizes[]`
  - `next_steps[]`
  - `items_included[]`
  - `standings[]` opcional

### `POST /api/player/tournaments/{tournamentId}/register`

- Auth requerida: si
- Payload opcional:
```json
{
  "source": "mobile-app"
}
```
- Response minima: torneo actualizado con `my_registration`

## Orders

### `GET /api/player/orders`

- Auth requerida: si
- Payload: none
- Response minima:
```json
{
  "data": {
    "orders": [
      {
        "id": 4108,
        "sold_at": "2026-03-28T18:30:00-06:00",
        "total": 1399,
        "status": "Pagada",
        "order_channel": "storefront",
        "payment_method": "Tarjeta",
        "rewards_generated": 140,
        "credit_generated": 0,
        "summary": "Compra en mostrador",
        "items": [],
        "payments": []
      }
    ]
  }
}
```

### `GET /api/player/orders/{orderId}`

- Auth requerida: si
- Payload: none
- Response minima: mismo objeto de `orders` con `items[]`, `payments[]`, `summary`, `invoice_number`

## Preorders

### `GET /api/player/preorders`

- Auth requerida: si
- Payload: none
- Response minima:
```json
{
  "data": {
    "preorders": [
      {
        "id": 901,
        "title": "Caja de preventa Legends of Neon",
        "total": 1800,
        "paid": 900,
        "pending": 900,
        "payment_progress": 50,
        "status": "Abonada",
        "status_label": "Pago pendiente",
        "delivery_status": "Disponible en lanzamiento",
        "delivery_date": "2026-05-02T12:00:00-06:00",
        "created_at": "2026-03-22T13:00:00-06:00",
        "alerts": [],
        "items": []
      }
    ]
  }
}
```

### `GET /api/player/preorders/{preorderId}`

- Auth requerida: si
- Payload: none
- Response minima: mismo objeto con `notes`, `pickup_location`, `items[]`, `alerts[]`

## Rewards

### `GET /api/player/rewards`

- Auth requerida: si
- Payload: none
- Response minima:
```json
{
  "data": {
    "summary": {
      "points_balance": 1320,
      "credit_balance": 240,
      "reward_balance": 1560,
      "expiring_points": 120,
      "expiring_at": "2026-06-30T23:59:00-06:00"
    },
    "movements": [
      {
        "id": 1,
        "origin": "compra",
        "label": "Compra en tienda",
        "points": 140,
        "credit": 0,
        "amount": 1399,
        "status": "aplicado",
        "occurred_at": "2026-03-28T18:35:00-06:00",
        "expires_at": null,
        "description": "Generaste puntos por la compra #4108."
      }
    ]
  }
}
```

## Tiers

### `GET /api/player/tiers`

- Auth requerida: si
- Payload: none
- Response minima:
```json
{
  "data": {
    "current_tier": {
      "code": "gold",
      "name": "Oro",
      "level": 3,
      "benefits": [
        "10% extra en puntos",
        "Acceso preferente a torneos premium"
      ],
      "min_points": 1200,
      "max_points": 2499,
      "accent_color": "#f2b138"
    },
    "next_tier": {
      "code": "diamond",
      "name": "Diamante",
      "level": 4,
      "benefits": [],
      "min_points": 2500,
      "max_points": 999999,
      "accent_color": "#79d5ff"
    },
    "progress_percentage": 68,
    "points_to_next_tier": 1180,
    "current_points": 1320,
    "tracked_metric_label": "Puntos acumulados",
    "history": []
  }
}
```

## Notifications

### `GET /api/player/notifications`

- Auth requerida: si
- Payload: none
- Response minima:
```json
{
  "data": {
    "notifications": [
      {
        "id": 810,
        "title": "Pago pendiente en preventa",
        "message": "Tu preventa Legends of Neon tiene un saldo pendiente de $900.",
        "type": "preorder",
        "read_at": null,
        "created_at": "2026-04-17T09:15:00-06:00",
        "action_label": "Ver preventa",
        "action_to": "/preorders/901"
      }
    ]
  }
}
```

### `POST /api/player/notifications/{notificationId}/read`

- Auth requerida: si
- Payload: none
- Response minima: notificacion actualizada con `read_at`

## Recuperacion de password

La app ya soporta los flujos web existentes:

- `GET /recuperar-contrasena`
- `POST /recuperar-contrasena`
- `GET /restablecer-contrasena/{token}`
- `POST /restablecer-contrasena`

No es obligatorio exponer API JSON nueva para recovery si estas rutas web siguen disponibles.

## Callback social mobile

Para login externo mobile, la app espera un redirect final a:

- exito: `com.cardbastion.clientes://auth/callback?token=...&name=...&email=...`
- error: `com.cardbastion.clientes://auth/callback?error=...`

## Variables de entorno de la app

- `VITE_PLAYER_API_MODE`
- `VITE_PLAYER_AUTH_LOGIN_PATH`
- `VITE_PLAYER_AUTH_REGISTER_PATH`
- `VITE_PLAYER_AUTH_LOGOUT_PATH`
- `VITE_PLAYER_PROFILE_ME_PATH`
- `VITE_PLAYER_PROFILE_UPDATE_PATH`
- `VITE_PLAYER_DASHBOARD_PATH`
- `VITE_PLAYER_ORDERS_PATH`
- `VITE_PLAYER_ORDER_DETAIL_PATH`
- `VITE_PLAYER_TOURNAMENTS_PATH`
- `VITE_PLAYER_TOURNAMENT_DETAIL_PATH`
- `VITE_PLAYER_TOURNAMENT_REGISTER_PATH`
- `VITE_PLAYER_PREORDERS_PATH`
- `VITE_PLAYER_PREORDER_DETAIL_PATH`
- `VITE_PLAYER_REWARDS_PATH`
- `VITE_PLAYER_TIERS_PATH`
- `VITE_PLAYER_NOTIFICATIONS_PATH`
- `VITE_PLAYER_NOTIFICATION_READ_PATH`

## Nota operativa

Mientras el backend no exponga todo este contrato, mantener `VITE_PLAYER_API_MODE=mock` para asegurar una experiencia funcional en QA y demo.
