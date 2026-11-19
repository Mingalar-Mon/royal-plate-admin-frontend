# Backend Plan: Red Dot for New Reviews (No Sound)

**Goal:** Show a red dot / notification badge on the navbar "Guest Ratings" nav item when new, unread reviews arrive — without playing notification sound (unlike orders/reservations). Clear the red dot when staff actually sees or handles those reviews.

**Bottom line:** Backend changes ARE required. Frontend-only is not possible because (a) no notification is created when a review is submitted, (b) the unread-count endpoint doesn't filter by category, and (c) there's no `category` query param on `/count`.

**Sticky red-dot bug (confirmed):** Guest Ratings has **no mark-as-read at all**. After the owner replies, the navbar still shows `1` forever. The original plan never covered this.

Why it stays at 1:

1. **Review page never marks read.** `RatingList` / `useRating` never call `PATCH /notification/:id/read` or `PATCH /notification/read-all`. The bell dropdown is the only UI that marks read, and it does not even navigate for `category === 'rating'`.
2. **Owner reply creates a new `rating` notification** (`respondToRating`), it does **not** mark the original "new review" row as `READ`. If `/count?category=rating` keys off `restaurantId` only, that reply row (usually meant for the **guest**) is counted as restaurant unread.
3. **Foreground FCM** (`App.tsx`) calls `incrementUnreadReviewCount()` on every `type === 'rating'` push. A reply push therefore **increments** the badge instead of clearing it.

Fix: count only **owner-facing new-review** unread rows, support `category` on read-all, mark those rows read when staff opens Guest Ratings (and/or when they reply), and do not increment the badge on owner-reply pushes.

---

## Current Backend State (as-is)

| Item | File | Status |
|------|------|--------|
| `NotificationType` enum | `src/config/types/index.ts:85-92` | Already has `RATING = "rating"` |
| `Notification` entity | `src/entities/Notification.ts` | Already has `notificationType`, `ratingId`, `status` (UNREAD/READ), `recipientId`, `restaurantId` |
| `GET /notification/count` | `src/controllers/NotificationController.ts:19-25` | Counts ALL unread notifications for a `restaurantId` — **no category filter** |
| `GET /notification/list` | `src/controllers/NotificationController.ts:27-56` | Supports `category` filter, but Joi only allows `"order" \| "reservation"` |
| Rating creation | `src/services/rating.service.ts:54-139` | Creates a `Rating` but does **NOT** create a `Notification` |
| Rating owner-response | `src/services/rating.service.ts:426-528` | Creates a `Notification` (type `RATING`) when owner replies — **guest-facing; must not inflate restaurant unread count** |
| `PATCH /notification/:id/read` | Notification controller | Exists; unused by Guest Ratings |
| `PATCH /notification/read-all` | Notification controller | Exists; body is `{ restaurantId }` only — **no `category`**, so it would mark order/reservation too |
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

Returns `{ success: true, count: <number of UNREAD rating notifications for this restaurant's staff> }`.

**Count rules (required, or the red dot never clears):**

- Filter `notificationType = rating` **and** `status = unread`.
- Count only notifications **for restaurant staff** (`recipientId` = owner/staff, not the guest).
- Count only **new-review** events (`eventType = CREATED`). Owner-reply rows from `respondToRating` must be excluded even if they share `restaurantId` and type `rating`.

---

### Change 4: Allow `"rating"` in `GET /notification/list` category validator

**File:** `src/routes/Notification/notification.request.ts:10-18`

Update `getList` Joi schema:

```ts
category: Joi.string().valid("order", "reservation", "rating", "transaction", "in_app", "blog").optional(),
```

This lets the frontend fetch review notifications specifically if needed.

---

### Change 5: Support `category` on `PATCH /notification/read-all`

**Files:** notification request schema, controller, `markAllRead` service.

**New body:** `{ restaurantId, category?: 'rating' | 'order' | ... }`

When `category=rating`, mark **only** unread owner-facing new-review notifications for that restaurant as `READ`. Do **not** mark guest reply notifications, and do **not** mark orders/reservations.

Without this, Guest Ratings cannot clear its badge without wiping every other unread type.

---

### Change 6: On owner reply, mark the original review notification as read

**File:** `src/services/rating.service.ts` — `respondToRating()`

After saving the owner response:

1. Keep creating the **guest** notification (reply) unchanged.
2. Set `status = READ` on the restaurant's existing unread notification for that `ratingId` (`notificationType = rating`, `eventType = CREATED`, staff recipient).

Reply is a valid "I've seen this review" signal. Opening the Guest Ratings page should still mark remaining unread reviews as read (Change 5), because staff may look without replying.

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
6. Add optional `category` to `PATCH /notification/read-all`.
7. In `respondToRating()`, mark the original staff new-review notification `READ` (do not count the guest reply toward restaurant unread).
8. (Optional) Add FCM push in `createRating()` for real-time delivery. Payload `type` must be `rating`; reply pushes to guests must **not** be delivered as restaurant-staff `rating` unread.

---

## Verification Checklist (backend)

- [ ] `POST /mobile/api/rating/create-rating/:restaurantId` creates a `Notification` row with `notificationType = 'rating'`, `eventType = CREATED`, `status = 'unread'`, recipient = restaurant owner/staff.
- [ ] `GET /api/notification/count?restaurantId=<uuid>&category=rating` returns only unread **staff** new-review notifications (not guest reply rows).
- [ ] After owner replies, that rating's staff notification is `READ` and count drops (does not stay at 1).
- [ ] `PATCH /notification/read-all` with `{ restaurantId, category: 'rating' }` clears only rating unread for staff.
- [ ] `ensureNotificationEnum` seeder runs without error and `'rating'` is a valid enum value.
- [ ] Guest still receives the existing `respondToRating` notification.

---

## Frontend Note (required, not later-only)

Guest Ratings currently never reads. Wire this after backend Changes 3, 5, 6:

- Call `GET /notification/count?category=rating` for the nav badge (`unreadReviewCount`).
- On Guest Ratings mount (and after a successful reply), call `PATCH /notification/read-all` with `{ restaurantId, category: 'rating' }`, then `fetchUnreadReviewCount` so the badge goes to 0.
- Do **not** use unscoped `read-all` (that would clear orders/reservations too).
- In `App.tsx` FCM: keep skipping sound for `rating`. Increment the badge **only** for new-review / `CREATED` staff pushes. Do not increment on owner-reply payloads (that is why the dot jumps to 1 after publish).
- Bell dropdown: if `category === 'rating'`, navigate to Guest Ratings and mark that item read.

---
