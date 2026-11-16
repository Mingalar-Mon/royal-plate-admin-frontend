# Super Admin — Delete Restaurant (Hard Delete)

Hard-delete a restaurant and **all** of its child data. Destructive and irreversible — the restaurant row plus every related table is removed from the database. Super admin only.

- **Auth:** `authMiddleware` (`src/middlewares/auth.middlewares.ts:31`) **+ `superAdminGuard`** (`src/middlewares/superadmin.guard.ts:5`). Portal/admin JWT (`Authorization: Bearer <jwt>`) belonging to an `Admin` whose `role.name === "SUPER_ADMIN"`.
- **Entity:** `src/entities/Restaurant.ts` — table `restaurants`
- **Route mount:** `/api/restaurant` @ `src/routes/index.ts`
- **Source files:** `src/routes/Restaurant/restaurant.route.ts`, `src/routes/Restaurant/restaurant.request.ts`, `src/services/restaurant.service.ts`, `src/controllers/ResturantController.ts`

> **Existing endpoint unchanged:** `DELETE /api/restaurant/delete-restaurant/:restaurantId` remains owner-only (filters `owner.id = currentUserId`). This new endpoint is separate and allows a super admin to delete **any** restaurant. No existing payload or response structure was modified.

---

## DELETE — `/api/restaurant/super-admin/delete-restaurant/:restaurantId` (superadmin)

### URL Params

| Param | Type | Required | Notes |
|-------|------|----------|-------|
| `restaurantId` | uuid | yes | Restaurant to delete |

### Body (confirmation)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `restaurantName` | string | yes | Must match the restaurant's current `name` exactly. Mismatch → `400` and deletion is aborted. |

### Example cURL

```bash
curl -X DELETE "https://host/api/restaurant/super-admin/delete-restaurant/550e8400-e29b-41d4-a716-446655440001" \
  -H "Authorization: Bearer <superadmin_jwt>" \
  -H "Content-Type: application/json" \
  -d '{
        "restaurantName": "Royal Plate Bistro"
      }'
```

### TypeScript

```ts
interface DeleteRestaurantBySuperAdminBody {
  restaurantName: string;
}

async function deleteRestaurantBySuperAdmin(
  superAdminToken: string,
  restaurantId: string,
  restaurantName: string,
) {
  const res = await fetch(
    `${BASE_URL}/api/restaurant/super-admin/delete-restaurant/${restaurantId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${superAdminToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ restaurantName }),
    },
  );
  return res.json();
}
```

### Success Response — `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Royal Plate Bistro",
    "address": "...",
    "logoUrl": "...",
    "imageUrls": [...],
    "startingPrice": 50000,
    "endingPrice": 200000,
    "latitude": 16.8,
    "longitude": 96.1,
    "averageRating": 4.5,
    "totalReviews": 12,
    "tax": 0.05,
    "created_at": "2026-01-10T08:00:00.000Z",
    "updated_at": "2026-03-15T10:30:00.000Z"
  },
  "message": "Restaurant and all associated data deleted by super admin."
}
```

### Tables Deleted (all 10)

The service deletes every child table before removing the restaurant row, inside a single transaction:

| Table | FK Column | Deleted? |
|-------|-----------|----------|
| `restaurants` | — | ✅ Yes (parent row) |
| `restaurant_staff` | `restaurantId` | ✅ Yes |
| `dishes` | `restaurantId` | ✅ Yes |
| `ratings` | `restaurantId` | ✅ Yes |
| `blogs` | `restaurantId` | ✅ Yes |
| `commission_batches` | `restaurantId` | ✅ Yes |
| `reservations` | `restaurantId` | ✅ Yes |
| `orders` | `restaurantId` | ✅ Yes |
| `tables` | `restaurantId` | ✅ Yes |
| `restaurant_profiles` | `restaurantId` | ✅ Yes (OneToOne) |

**S3 cleanup:** `logoUrl`, every entry in `imageUrls[]`, and each dish's `coverImageUrl` + `detailImageUrls[]` are purged from S3 before the DB transaction.

> No `@OnDelete("CASCADE")` is declared on the TypeORM relations, so child rows are deleted explicitly via `DELETE ... WHERE restaurantId = :restaurantId` in the service. Behavior is deterministic regardless of your Postgres FK cascade settings.

### Error Responses

| Status | Scenario |
|--------|----------|
| `400 Bad Request` | `restaurantName` missing (Joi), or name does not match the restaurant record (confirmation failed) |
| `401 Unauthorized` | Missing/invalid/expired token |
| `403 Forbidden` | Token valid but the admin is not `SUPER_ADMIN` |
| `404 Not Found` | No restaurant with that `restaurantId` |
| `500` | DB or S3 cleanup failure |

---

## Frontend Notes

- **Show a confirm dialog** before calling this endpoint. The restaurant name must be typed exactly (or re-fetched and displayed for the admin to confirm). Never hard-code the name.
- **Hard delete is irreversible.** Once called, the restaurant and every order, reservation, rating, dish, table, staff record, blog, commission batch, and profile tied to it are gone from the DB (and images from S3).
- **Do not reuse this endpoint for the owner-only delete flow.** Owners continue to use `DELETE /api/restaurant/delete-restaurant/:restaurantId` (no name confirmation required, but restricted to their own restaurant).
- After deletion, remove the restaurant from any admin restaurant list UI immediately — do not poll for it, it will not exist.

---

## Error Handling Snippet

```ts
async function deleteRestaurantBySuperAdmin(
  superAdminToken: string,
  restaurantId: string,
  restaurantName: string,
) {
  const res = await fetch(
    `${BASE_URL}/api/restaurant/super-admin/delete-restaurant/${restaurantId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${superAdminToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ restaurantName }),
    },
  );

  const json = await res.json();

  if (res.status === 403) throw new Error("Superadmin access required");
  if (res.status === 401) throw new Error("Session expired, please sign in again");

  // 400 = confirmation name mismatch or missing body field
  if (res.status === 400) {
    throw new Error(json?.errors?.[0] ?? json?.message ?? "Invalid confirmation");
  }

  if (res.status === 404) throw new Error("Restaurant not found");
  if (!res.ok) throw new Error(json?.message ?? "Failed to delete restaurant");

  return json.data;
}
```
