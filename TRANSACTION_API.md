# Transaction API for Frontend Integration

> **Base URL:** `/api/transaction`
> **Authentication:** Required. Send `Authorization: Bearer <token>` header.

Transactions are **not stored in the database**. This endpoint computes them on the fly by merging the `Order` and `Reservation` tables of a given restaurant, so it always reflects the latest data.

---

## Endpoint

### 1. Get Restaurant Transactions

Returns paginated transactions (orders + reservations) for a restaurant, newest created first, along with a **summary** of the money totals.

| | |
|---|---|
| **Method** | `GET` |
| **Path** | `/` |
| **Auth** | Required |
| **Query Params** | `restaurantId` (UUID, **required**)<br>`fromDate` (date `YYYY-MM-DD`, optional — filter `created_at >= fromDate`)<br>`toDate` (date `YYYY-MM-DD`, optional — filter `created_at <= toDate`, inclusive of the full last day)<br>`page` (number, default: 1)<br>`limit` (number, default: 10, max: 100) |

#### Request Example

Fetch one month of transactions for a restaurant:

```http
GET /api/transaction?restaurantId=123e4567-e89b-12d3-a456-426614174000&fromDate=2026-08-01&toDate=2026-08-31&page=1&limit=10
Authorization: Bearer <token>
```

#### Response `200`

```json
{
  "success": true,
  "paginator": {
    "totalItems": 3,
    "currentPage": 1,
    "totalPages": 1,
    "pageSize": 10
  },
  "data": [
    {
      "referenceId": "11111111-1111-1111-1111-111111111111",
      "type": "reservation",
      "totalPrice": 115.5,
      "subTotal": 110,
      "commission_fee": 11,
      "commissionBatch": {
        "id": "99999999-9999-9999-9999-999999999999",
        "code": "CBH-001",
        "percentage": "10",
        "is_active": true,
        "deactivated_date": null,
        "created_at": "2026-07-01T00:00:00.000Z",
        "updated_at": "2026-07-01T00:00:00.000Z"
      },
      "reservationNumber": "RSV-00012",
      "created_at": "2026-08-20T10:30:00.000Z"
    },
    {
      "referenceId": "22222222-2222-2222-2222-222222222222",
      "type": "order",
      "totalPrice": 105,
      "subTotal": 100,
      "commission_fee": 10,
      "commissionBatch": {
        "id": "99999999-9999-9999-9999-999999999999",
        "code": "CBH-001",
        "percentage": "10",
        "is_active": true,
        "deactivated_date": null,
        "created_at": "2026-07-01T00:00:00.000Z",
        "updated_at": "2026-07-01T00:00:00.000Z"
      },
      "orderNumber": "RP15-08-2026-00001",
      "created_at": "2026-08-15T08:00:00.000Z"
    },
    {
      "referenceId": "33333333-3333-3333-3333-333333333333",
      "type": "order",
      "totalPrice": 52.5,
      "subTotal": 50,
      "commission_fee": 5,
      "commissionBatch": null,
      "orderNumber": "RP10-08-2026-00002",
      "created_at": "2026-08-10T12:45:00.000Z"
    }
  ],
  "summary": {
    "totalPrice": 273,
    "subTotal": 260,
    "commission_fee": 26
  },
  "message": "Transactions fetched successfully"
}
```

---

## Response Fields

### Transaction record (`data[]`)

| Field | Type | Description |
|---|---|---|
| `referenceId` | `string` (UUID) | The `id` of the underlying order or reservation |
| `type` | `"order" \| "reservation"` | Which table the record comes from |
| `totalPrice` | `number` | `subTotal` + tax for that record |
| `subTotal` | `number \| null` | Pre-tax, pre-commission total (`null` for records created before the field existed) |
| `commission_fee` | `number \| null` | `subTotal × active commission batch %` (`null` for legacy records) |
| `commissionBatch` | `object \| null` | The commission batch applied at creation time (`null` for legacy records) |
| `orderNumber` | `string` | Present **only** when `type === "order"` |
| `reservationNumber` | `string` | Present **only** when `type === "reservation"` |
| `created_at` | `string` (ISO 8601) | When the order/reservation was created; used for sorting and date filters |

### Summary

| Field | Type | Description |
|---|---|---|
| `totalPrice` | `number` | Sum of `totalPrice` across **all** filtered records (not just the current page) |
| `subTotal` | `number` | Sum of `subTotal` (`null` counted as 0) |
| `commission_fee` | `number` | Sum of `commission_fee` (`null` counted as 0) |

All summary values are rounded to 2 decimal places.

---

## Error Responses

#### `401` — Missing / invalid token

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

#### `422` — Missing required query param (`restaurantId`)

```json
{
  "success": false,
  "message": "Validation Error",
  "errors": ["\"restaurantId\" is required"]
}
```

---

## TypeScript Types (for Frontend)

```typescript
export type TransactionType = 'order' | 'reservation';

export type TransactionItem = {
  referenceId: string;
  type: TransactionType;
  totalPrice: number;
  subTotal: number | null;
  commission_fee: number | null;
  commissionBatch: {
    id: string;
    code: string;
    percentage: string;
    is_active: boolean;
    deactivated_date: string | null;
    created_at: string;
    updated_at: string;
  } | null;
  orderNumber?: string;        // present when type === 'order'
  reservationNumber?: string;  // present when type === 'reservation'
  created_at: string;          // ISO 8601
};

export type TransactionSummary = {
  totalPrice: number;
  subTotal: number;
  commission_fee: number;
};

export type GetTransactionsResponse = {
  success: boolean;
  paginator: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    pageSize: number;
  };
  data: TransactionItem[];
  summary: TransactionSummary;
  message: string;
};
```

---

## Frontend Service Example

```typescript
// src/services/transaction.api.ts
import { ApiService } from './ApiService'; // your existing axios wrapper

const PREFIX = '/transaction';

export type GetTransactionsParams = {
  restaurantId: string;
  fromDate?: string; // YYYY-MM-DD
  toDate?: string;   // YYYY-MM-DD
  page?: number;
  limit?: number;
};

export async function apiGetTransactions(
  params: GetTransactionsParams
) {
  return ApiService.fetchDataWithAxios<GetTransactionsResponse>({
    url: `${PREFIX}`,
    method: 'get',
    params: { page: 1, limit: 10, ...params },
  });
}
```

---

## Notes for Frontend

1. **Month filter**
   - Pass `fromDate` = first day and `toDate` = last day of the month:
     `fromDate=2026-08-01&toDate=2026-08-31`.
   - The server normalizes `fromDate` to `00:00:00` and `toDate` to `23:59:59.999` of that day, so the entire last day is included.
   - Omit both to get all transactions (no date filter).

2. **Summary scope**
   - `summary` always covers the **entire filtered dataset** (matching `restaurantId` + date range), even when you are on page 2+. It is **not** a sum of just the current page.

3. **Sorting**
   - Records are returned newest `created_at` first. There is no `sortKey`/`sortOrder` on this endpoint.

4. **Nulls for legacy records**
   - Orders/reservations created before `subTotal`, `commission_fee`, and `commissionBatch` were introduced return `null` for those fields, and `commissionBatch` is `null`. Treat `null` as "unknown/not applicable" rather than 0 in the UI.

5. **Money formatting**
   - `commissionBatch.percentage` arrives as a string (Postgres `decimal`) — convert with `Number(...)` before using it in math.
   - `totalPrice`, `subTotal`, and `commission_fee` arrive as numbers.
