# App Settings (Terms & Conditions, Support Phones) — Frontend Integration

Admin-managed key–value settings that the mobile app renders: **terms & conditions**, **customer support phone**, **service phone**, etc. Admins freely add/update/remove any setting; mobile fetches a single flattened config.

- **Auth — Admin writes:** `authMiddleware` (`src/middlewares/auth.middlewares.ts:31`) — portal/admin JWT (`Authorization: Bearer <jwt>`).
- **Auth — Reads (list / mobile-config / by id):** `basicAuth` (`src/middlewares/auth.middlewares.ts:101`) — Basic header from `BASIC_AUTH_USER` / `BASIC_AUTH_PASSWORD` env vars (same as AppVersion & Banner GET endpoints).
- **Entity:** `src/entities/AppSetting.ts` — table `app_settings`
  ```ts
  id:        string (uuid)
  key:       string  // unique, lowercase, e.g. "termsAndConditions"
  value:     string  // text — HTML allowed for rich content
  type:      "TEXT" | "PHONE" | "URL" | "HTML"  (default "TEXT")
  isActive:  boolean (default true)
  createdAt / updatedAt: ISO timestamptz
  ```
- **Route mount:** `/api/settings` @ `src/routes/index.ts:66`. Source files: `src/routes/AppSetting/appSetting.routes.ts`, `src/routes/AppSetting/appSetting.request.ts`, `src/services/appSetting.service.ts`, `src/controllers/AppSettingController.ts`.

---

## 1. Create Setting — `POST /api/settings` (admin)

### Auth

```
Authorization: Bearer <admin_jwt>
```

### Body

| Field | Type | Required | Validation (@ `appSetting.request.ts`) |
|-------|------|----------|------------|
| `key` | string | yes | unique, trimmed + lowercased server-side. Use kebab/camel case, e.g. `termsAndConditions` |
| `value` | string | yes | content or phone number; `""` allowed |
| `type` | `"TEXT"\|"PHONE"\|"URL"\|"HTML"` | no | default `"TEXT"`. **Terms & conditions should use `"URL"`** (hosted page/PDF link, not inline HTML) |
| `isActive` | boolean | no | default `true` |

### Example cURL

```bash
curl -X POST "https://host/api/settings" \
  -H "Authorization: Bearer <admin_jwt>" \
  -H "Content-Type: application/json" \
  -d '{"key":"termsAndConditions","value":"https://yourdomain.com/terms-and-conditions","type":"URL"}'
```

### TypeScript

```ts
interface CreateSettingBody {
  key: string;
  value: string;
  type?: "TEXT" | "PHONE" | "HTML";
  isActive?: boolean;
}

async function createSetting(body: CreateSettingBody) {
  const res = await fetch(`${BASE_URL}/api/settings`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${adminToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res.json();
}
```

### Success Response — `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "key": "termsAndConditions",
    "value": "https://yourdomain.com/terms-and-conditions",
    "type": "URL",
    "isActive": true
  },
  "message": "Created Successfully"
}
```

### Error Responses

| Status | Scenario |
|--------|----------|
| `400 Bad Request` | Joi validation failed (missing `key`/`value`, bad `type`) |
| `409 Conflict` | `key` already exists (unique constraint) |
| `401 Unauthorized` | Missing/invalid admin token |

---

## 2. List All Settings — `GET /api/settings`

Admin panel + debugging. Returns every row (active and inactive), newest first.

### Example cURL

```bash
curl "https://host/api/settings" \
  -H "Authorization: Basic <base64(username:password)>"
```

### Success Response — `200 OK`

```json
{
  "success": true,
  "data": [
    { "id": "...", "key": "termsAndConditions", "value": "https://yourdomain.com/terms-and-conditions", "type": "URL", "isActive": true },
    { "id": "...", "key": "customerSupportPhone", "value": "+959123456789", "type": "PHONE", "isActive": true },
    { "id": "...", "key": "servicePhone", "value": "+959987654321", "type": "PHONE", "isActive": true }
  ],
  "message": "Get Detail Data Successfully"
}
```

### Error Responses

| Status | Scenario |
|--------|----------|
| `401 Unauthorized` | Missing/invalid Basic credentials |

---

## 3. Mobile Config (Single Object) — `GET /api/settings/mobile` ⭐

**The endpoint the mobile app should use.** Returns **one object** mapping each active setting's `key` → `value` — ready to bind directly to UI fields. No pagination, no inactive rows, no array iteration needed.

> Alias: `GET /api/settings/mobile-config` behaves identically (kept for backward compatibility).

### Example cURL

```bash
curl "https://host/api/settings/mobile" \
  -H "Authorization: Basic <base64(username:password)>"
```

### Success Response — `200 OK`

```json
{
  "success": true,
  "data": {
    "termsAndConditions": "https://yourdomain.com/terms-and-conditions",
    "customerSupportPhone": "+959123456789",
    "servicePhone": "+959987654321",
    "privacyPolicy": "..."
  },
  "message": "Get Detail Data Successfully"
}
```

`data` is a plain object of `AppSetting` rows collapsed to `{ [key]: value }` (`src/services/appSetting.service.ts` → `getMobileConfig()`). Only `isActive: true` rows are included.

### Response Type

```ts
interface MobileConfigResponse {
  success: boolean;
  data: Record<string, string>; // { key: value } — one object, not an array
  message: string;
}
```

### Example cURL

```bash
curl "https://host/api/settings/mobile-config" \
  -H "Authorization: Basic <base64(username:password)>"
```

### Success Response — `200 OK`

```json
{
  "success": true,
  "data": {
    "termsAndConditions": "https://yourdomain.com/terms-and-conditions",
    "customerSupportPhone": "+959123456789",
    "servicePhone": "+959987654321",
    "privacyPolicy": "..."
  },
  "message": "Get Detail Data Successfully"
}
```

### Frontend Notes (Mobile)

- **Terms & Conditions screen:** `termsAndConditions` is a **URL** (hosted page/PDF), not inline HTML. Open it in a WebView or the system browser:
  - **Flutter:** `url_launcher` (`launchUrl`) or `webview_flutter` to keep users in-app.
  - **React Native:** `Linking.openURL(url)` or `react-native-webview`.
- **Contact / Support screens:** show clickable `tel:` links:
  - `tel:+959123456789` (customerSupportPhone)
  - `tel:+959987654321` (servicePhone)
- **Null handling:** a key the admin hasn't created yet is simply absent — treat as "not configured" and show an empty/disabled state (e.g., hide the "Call support" button if `customerSupportPhone` is missing).
- **Caching:** this payload changes rarely. Cache it (e.g., 6–12h, or on app launch) and invalidate on pull-to-refresh.

### Dart (Flutter)

```dart
class AppSettings {
  final String? termsAndConditions;
  final String? customerSupportPhone;
  final String? servicePhone;

  AppSettings.fromJson(Map<String, dynamic> json)
      : termsAndConditions = json['termsAndConditions'] as String?,
        customerSupportPhone = json['customerSupportPhone'] as String?,
        servicePhone = json['servicePhone'] as String?;
}

Future<AppSettings> fetchAppSettings() async {
  final creds = base64Encode(utf8.encode('$basicUser:$basicPass'));
  final res = await http.get(
    Uri.parse('$BASE_URL/api/settings/mobile'),
    headers: {'Authorization': 'Basic $creds'},
  );
  final json = jsonDecode(res.body) as Map<String, dynamic>;
  return AppSettings.fromJson(json['data'] as Map<String, dynamic>);
}
```

---

## 4. Mobile List (Full Records) — `GET /api/settings/mobile-list` ⭐

Returns **every active setting as a full record** (all fields), not just key→value. Use this when the mobile app needs to render a settings **list** (e.g., a "Legal & Support" menu showing id, type, status, timestamps) or iterate over entries generically.

> ⚠️ Registered **before** `/:id` in the router — use the full path `/api/settings/mobile-list`.

### Example cURL

```bash
curl "https://host/api/settings/mobile-list" \
  -H "Authorization: Basic <base64(username:password)>"
```

### Success Response — `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "key": "termsAndConditions",
      "value": "https://yourdomain.com/terms-and-conditions",
      "type": "URL",
      "isActive": true,
      "createdAt": "2026-09-25T04:00:00.000Z",
      "updatedAt": "2026-09-25T04:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "key": "customerSupportPhone",
      "value": "+959123456789",
      "type": "PHONE",
      "isActive": true,
      "createdAt": "2026-09-25T04:00:00.000Z",
      "updatedAt": "2026-09-25T04:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "key": "servicePhone",
      "value": "+959987654321",
      "type": "PHONE",
      "isActive": true,
      "createdAt": "2026-09-25T04:00:00.000Z",
      "updatedAt": "2026-09-25T04:00:00.000Z"
    }
  ],
  "message": "Get Detail Data Successfully"
}
```

### Response Type

```ts
interface AppSettingDTO {
  id: string;            // uuid
  key: string;           // unique setting key, e.g. "termsAndConditions"
  value: string;         // URL / phone / text
  type: "TEXT" | "PHONE" | "URL" | "HTML";
  isActive: boolean;
  createdAt: string;     // ISO timestamptz
  updatedAt: string;     // ISO timestamptz
}

interface MobileListResponse {
  success: boolean;
  data: AppSettingDTO[]; // active only, createdAt DESC
  message: string;
}
```

### Frontend Notes (Mobile)

- Inactive settings (`isActive: false`) are **excluded**.
- Ordered newest first (`createdAt DESC`).
- Same auth as `mobile-config` — Basic header.
- Typical use: `data.find(s => s.key === "termsAndConditions")` to pull a specific entry with its metadata.

---

## 5. Get Setting by ID — `GET /api/settings/:id`

### Example cURL

```bash
curl "https://host/api/settings/550e8400-e29b-41d4-a716-446655440001" \
  -H "Authorization: Basic <base64(username:password)>"
```

### Success Response — `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "key": "termsAndConditions",
    "value": "...",
    "type": "HTML",
    "isActive": true
  },
  "message": "Get Detail Data Successfully"
}
```

### Error Responses

| Status | Scenario |
|--------|----------|
| `400 Bad Request` | `id` param missing/invalid |
| `401 Unauthorized` | Missing/invalid Basic credentials |
| `404 Not Found` | Setting not found |

---

## 6. Update Setting — `PATCH /api/settings/:id` (admin)

Partial update. `key` is **immutable** — it cannot be changed; update `value`, `type`, or `isActive`. At least one field required (`.min(1)`).

### Auth

```
Authorization: Bearer <admin_jwt>
```

### Example cURL — deactivate a setting

```bash
curl -X PATCH "https://host/api/settings/550e8400-e29b-41d4-a716-446655440001" \
  -H "Authorization: Bearer <admin_jwt>" \
  -H "Content-Type: application/json" \
  -d '{"isActive": false, "value": "Terms updated 2026-10-01"}'
```

### Success Response — `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "key": "termsAndConditions",
    "value": "Terms updated 2026-10-01",
    "type": "TEXT",
    "isActive": false
  },
  "message": "Updated Data Successfully"
}
```

### Error Responses

| Status | Scenario |
|--------|----------|
| `400 Bad Request` | Empty body (`.min(1)`) or invalid field |
| `401 Unauthorized` | Missing/invalid admin token |
| `404 Not Found` | Setting not found |

### Frontend Notes (Portal / Admin)

- Editing form: `key` shown read-only (disabled input), `value` as text area (rich-text editor when `type === "HTML"`), dropdown for `type`, toggle for `isActive`.
- `isActive: false` hides a setting from the mobile app immediately (filtered in `mobile-config`) — use it instead of deleting when you might re-enable later.

---

## 7. Delete Setting — `DELETE /api/settings/:id` (admin)

Permanently removes the row.

```bash
curl -X DELETE "https://host/api/settings/550e8400-e29b-41d4-a716-446655440001" \
  -H "Authorization: Bearer <admin_jwt>"
```

### Success Response — `200 OK`

```json
{ "success": true, "message": "Deleted Data Successfully" }
```

### Error Responses

| Status | Scenario |
|--------|----------|
| `401 Unauthorized` | Missing/invalid admin token |
| `404 Not Found` | Setting not found |

### Frontend Notes (Portal / Admin)

- Confirm dialog before delete: "This will remove the setting from the app immediately."
- After delete, the key disappears from `mobile-config` responses.

---

## 8. API Summary

| Method | Path | Auth | Purpose | Returns |
|--------|------|------|---------|---------|
| `POST` | `/api/settings` | admin JWT | Create setting | 201, single object |
| `GET` | `/api/settings` | Basic | List all settings | 200, array |
| `GET` | `/api/settings/mobile` | Basic | **Active config as single `{key:value}` object — mobile** | 200, object |
| `GET` | `/api/settings/mobile-config` | Basic | Alias of `/mobile` (backward compat) | 200, object |
| `GET` | `/api/settings/mobile-list` | Basic | **Active settings as full records for mobile list** | 200, array |
| `GET` | `/api/settings/:id` | Basic | Single setting | 200, object |
| `PATCH` | `/api/settings/:id` | admin JWT | Update (key immutable) | 200, object |
| `DELETE` | `/api/settings/:id` | admin JWT | Delete setting | 200, message |

---

## 9. Error Handling Snippet

```ts
async function loadMobileConfig() {
  try {
    const res = await fetch(`${BASE_URL}/api/settings/mobile`, {
      headers: { Authorization: `Basic ${basicAuthHeader}` },
    });
    const body = await res.json();
    if (!res.ok || body.success === false) throw body;
    return body.data; // { termsAndConditions?, customerSupportPhone?, servicePhone?, ... }
  } catch (e: any) {
    if (e.status === 401) return null;           // bad Basic creds → surface config error
    console.warn("settings unavailable", e.message);
    return null;                                  // render fallback / hide support buttons
  }
}
```

---

## 10. DB / Deploy Note

The `app_settings` table auto-creates in dev (`synchronize: true @ src/config/data-source.ts:53`). For `synchronize: false` environments, run once:

```sql
CREATE TABLE IF NOT EXISTS "app_settings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "key" character varying NOT NULL UNIQUE,
  "value" text NOT NULL,
  "type" character varying(50) DEFAULT 'TEXT',
  "isActive" boolean DEFAULT true,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_app_setting_key" ON "app_settings" ("key");
```

### Initial setup (admin) — or use the seeder

Automate defaults with the idempotent seeder (skips keys that already exist):

```bash
npm run seed:appSettings   # ts-node src/seeder/AppSettingSeeder.ts
```

Or create these three rows manually from the admin panel (terms must be a **URL**, not HTML):

```json
{ "key": "termsAndConditions", "value": "https://yourdomain.com/terms-and-conditions", "type": "URL" }
{ "key": "customerSupportPhone", "value": "+959123456789", "type": "PHONE" }
{ "key": "servicePhone", "value": "+959987654321", "type": "PHONE" }
```