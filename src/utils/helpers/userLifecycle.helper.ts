/**
 * Shared helpers for the user account lifecycle actions:
 *   DELETE /api/user/soft-delete-user/:userId  (deactivate)
 *   PATCH  /api/user/reactivate-user/:userId   (reactivate)
 *
 * Both are super-admin only, reversible pairs, and surface the same error
 * table, so the row-level triggers in `UserListTable` share one contract.
 */

/** Tolerant deleted-flag check — the list API may return any of these variants. */
export const isUserDeactivated = (user: any): boolean => {
    if (!user) return false
    return Boolean(user.deletedAt ?? user.deleted_at ?? user.deletedAtTimestamp)
}

/**
 * An account is only safe to soft-delete when it is genuinely active.
 *
 * ⚠️ A third state exists: `status = inactive` with `deletedAt = NULL`. Both
 * endpoints answer 400 there (deactivate → "already deactivated", reactivate →
 * "not deactivated"), so gating the trash on `!deletedAt` alone would render a
 * guaranteed-failing button. This keeps exactly one live action per row.
 */
export const isUserActive = (user: any): boolean =>
    !isUserDeactivated(user) && user?.status !== 'inactive'

/** Pulls the user id off a row, tolerating the usual id/UUID naming variants. */
export const getUserId = (user: any): string | undefined =>
    user?.id ?? user?.userId ?? user?.user_id ?? undefined

export type UserAction = 'deactivate' | 'reactivate'

type UserActionFailure = {
    type: 'warning' | 'danger'
    message: string
}

const ACTION_LABEL: Record<UserAction, string> = {
    deactivate: 'deactivate',
    reactivate: 'reactivate',
}

/**
 * Maps the documented error table onto a toast type + message:
 *   400 wrong current state · 401 not a super admin · 404 unknown user · 422 bad UUID
 *
 * The server always sends a precise `message`, which we prefer over our
 * fallbacks so the admin sees the backend's own wording.
 */
export const getUserActionFailure = (
    error: any,
    action: UserAction,
): UserActionFailure => {
    const response = error?.response
    const status = response?.status ?? error?.status ?? null
    const data = response?.data
    const serverMessage = data?.message
    const label = ACTION_LABEL[action]

    if (status === 400) {
        return {
            type: 'warning',
            message:
                serverMessage ||
                (action === 'deactivate'
                    ? 'This account is already deactivated.'
                    : 'This account is not deactivated, so there is nothing to reactivate.'),
        }
    }

    if (status === 401) {
        return {
            type: 'danger',
            message:
                serverMessage ||
                `Only a super admin can ${label} a user account.`,
        }
    }

    if (status === 404) {
        return {
            type: 'danger',
            message: serverMessage || 'No user record matches that ID.',
        }
    }

    if (status === 422) {
        return {
            type: 'danger',
            message: serverMessage || 'That is not a valid user ID.',
        }
    }

    return {
        type: 'danger',
        message:
            (typeof data === 'string' ? data : serverMessage) ||
            error?.message ||
            `Could not ${label} the user. Please try again.`,
    }
}
