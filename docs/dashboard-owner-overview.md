# Superadmin Owner Overview — `GET /api/dashboard/owner-overview`

Superadmin-only dashboard endpoint that reports revenue and transaction totals
for every owner, with a per-restaurant breakdown.

The aggregation rules mirror `GET /api/transaction` (`TransactionService.getTransactions`):
only settled transactions (`completed` and `no_show`) are counted, and the date
filter applies to `created_at`.

> Status: implemented in `src/routes/EDA/dashboard.route.ts`.

---

## Route

```
GET /api/dashboard/owner-overview
```

Mounted through the existing dashboard router in `src/routes/index.ts`:

```ts
app.use(`${PREFIX_ROUTE}/dashboard`, dashboardRoutes);
```

## Auth

| Layer | Requirement |
|---|---|
| `authMiddleware` | Valid bearer token |
| `superAdminGuard` | `Admin.role.name === "SUPER_ADMIN"` |

Owners and staff cannot call this endpoint.

## Query Parameters

| Param | Type | Required | Default | Notes |
|---|---|---|---|---|
| `ownerId` | UUID | no | — | Restrict the result to one owner |
| `search` | string | no | — | Match owner `name` or `email` |
| `fromDate` | ISO date | no | — | Start of the `created_at` range, Yangon business day |
| `toDate` | ISO date | no | — | End of the `created_at` range, Yangon business day |
| `page` | integer | no | `1` | Min `1` |
| `limit` | integer | no | `20` | Min `1`, max `100` |
| `sortBy` | string | no | `totalPrice` | `totalPrice`, `netAmount`, `commission_fee`, `orderCount`, `reservationCount`, `ownerName` |
| `sortOrder` | string | no | `DESC` | `ASC` or `DESC` |

Date boundaries are converted with `toBusinessDayStart` / `toBusinessDayEnd`
from `src/helpers/reservation-time.ts`, so a `toDate` of `2026-08-31` includes
the whole final day in Yangon time (UTC+06:30).

## Aggregation Rules

Only these statuses are included, matching the transaction endpoint:

```ts
[OrderStatus.COMPLETED, OrderStatus.NO_SHOW]
[ReservationStatus.COMPLETED, ReservationStatus.NO_SHOW]
```

For each restaurant:

| Field | Source |
|---|---|
| `totalPrice` | `SUM(order.totalPrice)` + `SUM(reservation.totalPrice)` |
| `subTotal` | `SUM(order.subTotal)` + `SUM(reservation.subTotal)` |
| `commission_fee` | `SUM(order.commission_fee)` + `SUM(reservation.commission_fee)` |
| `netAmount` | `SUM(order.netAmount)` + `SUM(reservation.netAmount)` |
| `orderCount` | `COUNT(orders)` |
| `reservationCount` | `COUNT(reservations)` |

Restaurant totals are rolled up per owner. Restaurants with no matching
transactions are still returned with zero totals, so the owner list stays
complete.

## Response — `200 OK`

```json
{
  "success": true,
  "paginator": {
    "totalItems": 1,
    "currentPage": 1,
    "totalPages": 1,
    "pageSize": 20
  },
  "summary": {
    "totalPrice": 125000,
    "subTotal": 118000,
    "commission_fee": 11800,
    "netAmount": 106200,
    "orderCount": 42,
    "reservationCount": 8
  },
  "data": [
    {
      "ownerId": "2c1f0f0e-1111-4c1e-9a8e-aaaaaaaaaaaa",
      "ownerName": "Owner Name",
      "ownerEmail": "owner@example.com",
      "ownerPhone": "+959000000000",
      "restaurantCount": 2,
      "totalPrice": 125000,
      "subTotal": 118000,
      "commission_fee": 11800,
      "netAmount": 106200,
      "orderCount": 42,
      "reservationCount": 8,
      "restaurants": [
        {
          "restaurantId": "3d2e1f0a-2222-4d2f-8b9f-bbbbbbbbbbbb",
          "restaurantName": "Restaurant A",
          "totalPrice": 80000,
          "subTotal": 75000,
          "commission_fee": 7500,
          "netAmount": 67500,
          "orderCount": 30,
          "reservationCount": 4
        }
      ]
    }
  ],
  "message": "Owner overview fetched successfully"
}
```

`summary` is computed over every owner matching the filters, before
pagination. `data` contains only the requested page of owners.

## Example cURL

```bash
# All owners, all time
curl -i "https://host/api/dashboard/owner-overview" \
  -H "Authorization: Bearer <superadmin-token>"

# One owner, date range
curl -i "https://host/api/dashboard/owner-overview?ownerId=<owner-uuid>&fromDate=2026-08-01&toDate=2026-08-31" \
  -H "Authorization: Bearer <superadmin-token>"

# Search by owner name/email and sort by net amount
curl -i "https://host/api/dashboard/owner-overview?search=owner&sortBy=netAmount&sortOrder=DESC&page=1&limit=20" \
  -H "Authorization: Bearer <superadmin-token>"
```

## Error Responses

| Status | Scenario |
|---|---|
| `401 Unauthorized` | Missing or invalid bearer token |
| `403 Forbidden` | Caller is not a `SUPER_ADMIN` |
| `422 Unprocessable Entity` | Invalid query param (UUID, date, page, limit, sort field) |

Standard error body:

```json
{
  "status": "error",
  "errorCode": 403,
  "message": "Access denied. Superadmin only.",
  "errors": ["Forbidden"]
}
```

## Implementation Notes

- Add `getOwnerOverview` to `dashboardValidator` in
  `src/routes/EDA/dashboard.request.ts`.
- Add `getOwnerOverview` to `DashboardController` and bind it in the
  constructor.
- Add `getOwnerOverview(filter)` to `DashboardService`.
- Aggregate with grouped SQL (`SUM` / `COUNT`) rather than loading all
  orders/reservations into memory.
- No database migration is required.
- Existing dashboard endpoints (`/get`, `/top-sale-dishes`, `/top-customers`)
  stay unchanged and remain owner-scoped.

## Related Files

- `src/routes/EDA/dashboard.route.ts`
- `src/routes/EDA/dashboard.request.ts`
- `src/controllers/DashboardController.ts`
- `src/services/dashboard.service.ts`
- `src/services/transaction.service.ts` — reference aggregation rules
- `src/middlewares/superadmin.guard.ts`
- `src/helpers/reservation-time.ts`
