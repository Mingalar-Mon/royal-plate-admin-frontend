/**
 * Shared helper for the super-admin restaurant hard delete:
 *   DELETE /api/restaurant/super-admin/delete-restaurant/:restaurantId
 *
 * Mirrors `userLifecycle.helper.ts`. The endpoint is destructive, irreversible
 * and super-admin only, and surfaces a fixed error table, so the confirm dialog
 * on the admin restaurants page maps every documented status to a toast + type.
 */

export type HardDeleteFailure = {
    type: 'warning' | 'danger'
    message: string
}

/** Pull the first available validation error off a Joi-style `errors` array. */
const getServerError = (data: any): string | undefined => {
    if (!data || typeof data !== 'object') return undefined
    const errors = data.errors
    if (Array.isArray(errors) && errors.length > 0) {
        return typeof errors[0] === 'string' ? errors[0] : errors[0]?.message
    }
    return typeof data.message === 'string' ? data.message : undefined
}

/**
 * Maps the documented error table onto a toast type + message:
 *   400 name mismatch / missing confirmation · 401 session expired ·
 *   403 superadmin required · 404 unknown restaurant · 500 DB/S3 cleanup failed
 *
 * The server's own `message` (or first `errors[0]`) is preferred over our
 * fallbacks so the admin sees the backend's exact wording.
 */
export const getHardDeleteFailure = (error: any): HardDeleteFailure => {
    const response = error?.response
    const status = response?.status ?? error?.status ?? null
    const data = response?.data
    const serverMessage = getServerError(data)

    if (status === 400) {
        return {
            type: 'warning',
            message:
                serverMessage ||
                'The typed name did not match the restaurant name. Nothing was deleted.',
        }
    }

    if (status === 401) {
        return {
            type: 'danger',
            message:
                serverMessage || 'Your session expired. Please sign in again.',
        }
    }

    if (status === 403) {
        return {
            type: 'danger',
            message:
                serverMessage ||
                'Only a super admin can permanently delete a restaurant.',
        }
    }

    if (status === 404) {
        return {
            type: 'danger',
            message: serverMessage || 'This restaurant no longer exists.',
        }
    }

    if (status === 500) {
        return {
            type: 'danger',
            message:
                serverMessage ||
                'The server failed while cleaning up the restaurant data. Please try again.',
        }
    }

    return {
        type: 'danger',
        message:
            (typeof data === 'string' ? data : serverMessage) ||
            error?.message ||
            'Could not delete the restaurant. Please try again.',
    }
}
