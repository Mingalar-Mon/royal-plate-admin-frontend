# Backend Plan: Red Dot for New Reviews (No Sound)

**Goal:** Show a red dot / notification badge on the navbar "Guest Ratings" nav item when new, unread reviews arrive — without playing notification sound (unlike orders/reservations).

**Bottom line:** Backend changes ARE required. Frontend-only is not possible because (a) no notification is created when a review is submitted, (b) the unread-count endpoint doesn't filter by category, and (c) there's no `category` query param on `/count`.

---

## Current Backend State (as-is)

| Item | File | Status |
|------|------|--------|
| `NotificationType` enum | `src/config/types/index.ts:85-92` | Already has `RATING = "rating"` |
| `Notification` entity | `src/entities/Notification.ts` | Already has `notificationType`, `ratingId`, `status` (UNREAD/READ), `recipientId`, `restaurantId` |
| `GET /notification/count` | `src/controllers/NotificationController.ts:19-25` | Counts ALL unread notifications for a `restaurantId` — **no category filter** |
| `GET /notification/list` | `src/controllers/NotificationController.ts:27-56` | Supports `category` filter, but Joi only allows `"order" \| "reservation"` |
| Rating creation | `src/services/rating.service.ts:54-139` | Creates a `Rating` but does **NOT** create a `Notification` |
| Rating owner-response | `src/services/rating.service.ts:426-528` | Creates a `Notification` (type `RATING`) when owner replies — **only for replies, not new reviews** |
| Enum seeder | `src/seeder/ensureNotificationEnum.ts` | Only ensures `'blog'` exists in Postgres enum — does **not** ensure `'rating'` |

---

## Backend Changes Required

### Change 1: Ensure `'rating'` exists in the Postgres native enum

**File:** `src/seeder/ensureNotificationEnum.ts`

Add `'rating'` alongside `'blog'` so the native Postgres enum `notifications_notificationtype_enum` accepts `NotificationType.RATING`.

```ts
await AppDataSource.query(
  `ALTER TYPE notifications_notificationtype_enum ADD VALUE IF NOT EXISTS 'rating';`,
);
```

Run this seeder once after deploying (idempotent via `IF NOT EXISTS`).

---

### Change 2: Create a Notification when a new review is submitted

**File:** `src/services/rating.service.ts` — inside `createRating()`, after the transaction commits.

Currently `createRating` saves the `Rating` and updates restaurant metadata, but never creates a `Notification`. Add fire-and-forget notification creation (same pattern as `respondToRating`, lines 468-524) so the restaurant owner/staff gets an unread review notification.

**Logic:**
- After `savedRating` is created inside the transaction, create a `Notification` record:
  - `notificationType: NotificationType.RATING`
  - `eventType: NotificationEventType.CREATED`
  - `restaurantId`
  - `recipientId`: the restaurant **owner** (and/or staff) — look up `Restaurant.owner.id`
  - `referenceId`: `RestaurantProfile.id` (or fall back to `restaurant.id`)
  - `ratingId: savedRating.id`
  - `title`: "New guest review"
  - `body`: truncated review text or score summary
  - `status`: defaults to `UNREAD`

**FCM push (optional, for real-time):** Send a push to the owner's device tokens with `type: NotificationType.RATING`. Do **not** differentiate sound here — sound is controlled entirely on the frontend.

---

### Change 3: Add `category` filter to `GET /notification/count`

**Files:**
- `src/services/notification.service.ts` — `getUnreadCount(restaurantId)` → `getUnreadCount(restaurantId, category?)`
- `src/controllers/NotificationController.ts:19-25` — `getCount` — read `category` from `req.query` and pass through
- `src/routes/Notification/notification.request.ts:5-8` — `getCount` Joi schema — add optional `category` valid `"order" \| "reservation" \| "rating" \| "transaction" \| "in_app" \| "blog"`

**New query:** `GET /notification/count?restaurantId=<uuid>&category=rating`

Returns `{ success: true, count: <number of UNREAD rating notifications> }`.

---

### Change 4: Allow `"rating"` in `GET /notification/list` category validator

**File:** `src/routes/Notification/notification.request.ts:10-18`

Update `getList` Joi schema:

```ts
category: Joi.string().valid("order", "reservation", "rating", "transaction", "in_app", "blog").optional(),
```

This lets the frontend fetch review notifications specifically if needed.

---

## What Does NOT Need Backend Changes

- **Sound control** — Sound is handled 100% on the frontend (`src/App.tsx` FCM handler + `src/utils/notificationQueue.ts`). The backend just needs to tag pushes with `type: 'rating'` so the frontend can skip `playSound()` for review types.
- **`NotificationType.RATING`** — Already exists in the enum.
- **`Notification.ratingId` column** — Already exists.

---

## Suggested Implementation Order

1. Update `src/seeder/ensureNotificationEnum.ts` to add `'rating'`, then run it.
2. Update `src/services/rating.service.ts` `createRating()` to create a `Notification` (type `RATING`, status `UNREAD`) for the restaurant owner after saving the review.
3. Update `src/services/notification.service.ts` `getUnreadCount` to accept optional `category`.
4. Update `src/controllers/NotificationController.ts` `getCount` to pass `category` from query.
5. Update `src/routes/Notification/notification.request.ts` `getCount` schema to allow `category`; update `getList` schema to include `"rating"`.
6. (Optional) Add FCM push in `createRating()` for real-time delivery.

---

## Verification Checklist (backend)

- [ ] `POST /mobile/api/rating/create-rating/:restaurantId` creates a `Notification` row with `notificationType = 'rating'`, `status = 'unread'`, linked to the restaurant owner.
- [ ] `GET /api/notification/count?restaurantId=<uuid>&category=rating` returns the unread review count for that restaurant.
- [ ] `ensureNotificationEnum` seeder runs without error and `'rating'` is a valid enum value.
- [ ] Existing `respondToRating` notifications (owner replies) still work unchanged.

---

## Frontend Note (for later phase)

Once backend is done, frontend will:
- Call `GET /notification/count?category=rating` to get the unread review count.
- Show a red dot on the "Guest Ratings" nav item when count > 0.
- In the FCM handler (`App.tsx`), add a `case 'review'`/`'rating'` that invalidates the ratings query but does **not** call `playSound()` (silent).

---
