# Admin CRUD — Frontend Integration (`/api/v1/admin`)

CRUD for the `Admin` entity (portal administrators). All five endpoints are
superadmin-only.

> **Coexistence note:** the older `/api/auth/super-admin/*` endpoints still exist
> and are untouched. This document covers the new versioned REST module only.
> New integrations should use `/api/v1/admin`.

- **Auth — all routes:** `authMiddleware` + `superAdminGuard`. Portal/admin JWT in
  `Authorization: Bearer <jwt>`; the caller's `Admin.role.name` must be
  `"ADMIN"` or `"SUPER_ADMIN"`. Owners and restaurant staff get `403`.
- **Route mount:** `/api/v1/admin` in `src/routes/index.ts`
- **Source files:** `src/routes/Admin/admin.route.ts`,
  `src/routes/Admin/admin.request.ts`, `src/controllers/AdminController.ts`,
  `src/services/admin.service.ts`
- **Entity:** `src/entities/Admin.ts` (unchanged)

---

## Endpoints

| Method | Path | Action | Success status |
|---|---|---|---|
| `POST` | `/api/v1/admin` | Create admin | `201` |
| `GET` | `/api/v1/admin` | List admins (paginated) | `200` |
| `GET` | `/api/v1/admin/:id` | Get one admin | `200` |
| `PATCH` | `/api/v1/admin/:id` | Update admin | `200` |
| `DELETE` | `/api/v1/admin/:id` | Delete admin | `200` |

`:id` is a UUID.

---

## Data model

`password` is **never returned** in any response. `banners` is not loaded.

```ts
interface AdminDTO {
  id: string;          // uuid
  name: string;
  email: string;       // unique
  phone: string | null; // unique when present
  code: string | null;
  role: {
    id: string;
    name: string;      // e.g. "SUPER_ADMIN", "ADMIN"
    description: string;
  } | null;
}
```

---

## 1. Create — `POST /api/v1/admin`

### Body

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | max 100 chars |
| `email` | string | yes | valid email, unique |
| `password` | string | yes | min 8 chars; stored bcrypt-hashed |
| `phone` | string | no | max 50 chars, unique when present; `""` is stored as `null` |
| `code` | string | no | max 100 chars |
| `roleId` | UUID or `null` | no | must reference an existing role; `null`/omitted = no role |

Duplicate `email` or `phone` → `400 "Email or phone is already in use."`
Unknown `roleId` → `404 "Role not found."`

```bash
curl -X POST "https://host/api/v1/admin" \
  -H "Authorization: Bearer <superadmin_jwt>" \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Jane Doe",
        "email": "jane@example.com",
        "password": "s3curePass!",
        "phone": "+959123456789",
        "roleId": "8c1f6f0e-0b2a-4f0c-9d3e-6a1b5c7d9e01"
      }'
```

### Response `201`

```json
{
  "success": true,
  "data": {
    "id": "9f1c2e3a-...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+959123456789",
    "code": null,
    "role": { "id": "8c1f6f0e-...", "name": "ADMIN", "description": "..." }
  },
  "message": "Admin created successfully."
}
```

---

## 2. List — `GET /api/v1/admin`

### Query

| Param | Type | Required | Default | Notes |
|---|---|---|---|---|
| `page` | integer | no | `1` | min 1 |
| `limit` | integer | no | `10` | min 1, max 100 |
| `search` | string | no | `""` | case-insensitive match on `name`, `email`, `phone` |

Results are ordered by `name` ascending.

```bash
curl "https://host/api/v1/admin?page=1&limit=20&search=jane" \
  -H "Authorization: Bearer <superadmin_jwt>"
```

### Response `200`

```json
{
  "success": true,
  "paginator": {
    "totalItems": 1,
    "currentPage": 1,
    "totalPages": 1,
    "pageSize": 20
  },
  "data": [ { "id": "9f1c2e3a-...", "name": "Jane Doe", "...": "..." } ],
  "message": "Admins retrieved successfully."
}
```

An empty result returns `data: []` with `totalItems: 0` and `totalPages: 1`.

---

## 3. Get one — `GET /api/v1/admin/:id`

```bash
curl "https://host/api/v1/admin/9f1c2e3a-..." \
  -H "Authorization: Bearer <superadmin_jwt>"
```

### Response `200`

```json
{
  "success": true,
  "data": {
    "id": "9f1c2e3a-...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+959123456789",
    "code": null,
    "role": { "id": "8c1f6f0e-...", "name": "ADMIN", "description": "..." }
  },
  "message": "Admin retrieved successfully."
}
```

Unknown id → `404 "Admin not found."`

---

## 4. Update — `PATCH /api/v1/admin/:id`

All fields are optional, but **at least one must be supplied**.

| Field | Type | Notes |
|---|---|---|
| `name` | string | max 100 chars |
| `email` | string | valid email, unique |
| `password` | string | min 8 chars; hashed only when supplied |
| `phone` | string or `null` | unique when present; `""` becomes `null` |
| `code` | string or `null` | max 100 chars |
| `roleId` | UUID or `null` | assign a role, or `null` to clear it |

Safety guards (all `400`):

- You cannot change **your own** role to a non-admin role (`ADMIN` / `SUPER_ADMIN` are allowed).
- You cannot remove **your own** role (`roleId: null`).
- Duplicate `email`/`phone` belonging to another admin is rejected.

```bash
curl -X PATCH "https://host/api/v1/admin/9f1c2e3a-..." \
  -H "Authorization: Bearer <superadmin_jwt>" \
  -H "Content-Type: application/json" \
  -d '{ "name": "Jane Smith", "password": "n3wPass123" }'
```

### Response `200`

```json
{
  "success": true,
  "data": { "id": "9f1c2e3a-...", "name": "Jane Smith", "...": "..." },
  "message": "Admin updated successfully."
}
```

---

## 5. Delete — `DELETE /api/v1/admin/:id`

```bash
curl -X DELETE "https://host/api/v1/admin/9f1c2e3a-..." \
  -H "Authorization: Bearer <superadmin_jwt>"
```

### Response `200`

```json
{
  "success": true,
  "message": "Admin deleted successfully."
}
```

- Deleting **your own** account is rejected with `400`.
- Unknown id → `404 "Admin not found."`
- Banners authored by this admin are deleted by database cascade
  (`Banner.authorAdmin` uses `onDelete: "CASCADE"`).
- Payout batches created by this admin keep the record but show `payoutBy: null`
  (`PayoutBatch.payoutBy` uses `ON DELETE SET NULL`).

---

## Errors

Validation failures (`422`) use:

```json
{
  "status": "error",
  "errorCode": 422,
  "message": "\"password\" is required",
  "errors": ["\"password\" is required", "..."]
}
```

Business/authorization errors use:

```json
{
  "status": "error",
  "errorCode": 400,
  "message": "Email or phone is already in use.",
  "errors": []
}
```

| Status | When |
|---|---|
| `401` | Missing/invalid bearer token |
| `403` | Caller is not an `ADMIN` / `SUPER_ADMIN` |
| `404` | Admin or role not found |
| `400` | Duplicate email/phone, self-delete, self role removal/downgrade, DB unique violation |
| `422` | Joi validation failure (bad UUID, short password, empty PATCH body, etc.) |

---

## TypeScript client sketch

```ts
interface Paginator {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

const BASE = "/api/v1/admin";
const token = "<superadmin_jwt>";

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.message ?? "Request failed");
  return body as T;
}

export const adminApi = {
  create: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string | null;
    code?: string | null;
    roleId?: string | null;
  }) => api<{ data: AdminDTO }>("", { method: "POST", body: JSON.stringify(data) }),

  list: (page = 1, limit = 10, search = "") =>
    api<{ data: AdminDTO[]; paginator: Paginator }>(
      `?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
    ),

  get: (id: string) => api<{ data: AdminDTO }>(`/${id}`),

  update: (
    id: string,
    data: {
      name?: string;
      email?: string;
      password?: string;
      phone?: string | null;
      code?: string | null;
      roleId?: string | null;
    },
  ) =>
    api<{ data: AdminDTO }>(`/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    api<{ success: boolean }>(`/${id}`, { method: "DELETE" }),
};
```

> Note: the shared response envelope is `{ success, data, message }` for
> create/get/list/update, and `{ success, message }` for delete. Validation and
> business errors use the `{ status: "error", ... }` envelope above — do not
> assume `success` exists on error responses.
