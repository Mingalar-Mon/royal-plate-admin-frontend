import { z } from 'zod'

/**
 * What a reservation commission is applied to.
 * `SUBTOTAL` charges on food + table fee, `TABLE_FEE_ONLY` on the table fee alone.
 */
export type CommissionBasis = 'SUBTOTAL' | 'TABLE_FEE_ONLY'

/**
 * The commission batch rows the server hands back. `orderPercent` /
 * `reservationPercent` are `numeric` columns, so they arrive as JSON strings
 * ("10.00") and are `null` whenever their scope flag is off.
 */
export type Commission = {
    id: string
    code: string
    restaurant: {
        id: string
        name: string
    }
    perOrder: boolean
    perReservation: boolean
    orderPercent: string | null
    reservationPercent: string | null
    reservationBasis: CommissionBasis
    is_active: boolean
    deactivated_date: string | null
    created_at: string
    updated_at: string
}

export type CommissionQuery = {
    status?: boolean
    restaurantId?: string
    page: number
    limit: number
    sortKey: CommissionSortKey
    sortOrder: 'ASC' | 'DESC' | 'asc' | 'desc'
    search: string
    fromDate?: Date
    toDate?: Date
}

/** Mirrors the server's `sortKey` enum for `GET /api/commission-batch`. */
export type CommissionSortKey =
    | 'id'
    | 'code'
    | 'perOrder'
    | 'perReservation'
    | 'orderPercent'
    | 'reservationPercent'
    | 'reservationBasis'
    | 'is_active'
    | 'deactivated_date'
    | 'created_at'
    | 'updated_at'

export type CommissionFormData = {
    restaurantId: string
    perOrder: boolean
    perReservation: boolean
    orderPercent?: number
    reservationPercent?: number
    reservationBasis: CommissionBasis
    is_active: boolean
}

export type CommissionFormInput = {
    restaurantId: string
    perOrder: boolean
    perReservation: boolean
    /** Kept as a string in the form so a half-typed "10." doesn't collapse. */
    orderPercent: string
    reservationPercent: string
    reservationBasis: CommissionBasis
    is_active: boolean
}

const percentField = (label: string) =>
    z
        .string()
        .trim()
        .min(1, { message: `${label} is required` })
        .refine((value) => Number.isFinite(Number(value)), {
            message: `${label} must be a number`,
        })
        .refine((value) => Number(value) >= 0 && Number(value) <= 100, {
            message: `${label} must be between 0 and 100`,
        })
        .refine((value) => /^\d+(\.\d{1,2})?$/.test(value), {
            message: `${label} allows at most 2 decimal places`,
        })

export const commissionValidationSchema = z
    .object({
        restaurantId: z
            .string()
            .trim()
            .min(1, { message: 'Please select a restaurant' }),
        perOrder: z.boolean(),
        perReservation: z.boolean(),
        orderPercent: z.string(),
        reservationPercent: z.string(),
        reservationBasis: z.enum(['SUBTOTAL', 'TABLE_FEE_ONLY']),
        is_active: z.boolean(),
    })
    .superRefine((values, ctx) => {
        // A batch that charges nothing is rejected by the server with a 400.
        if (!values.perOrder && !values.perReservation) {
            ctx.addIssue({
                code: 'custom',
                path: ['perOrder'],
                message:
                    'Turn on at least one scope — a batch that charges nothing is not allowed',
            })
        }

        // Each percentage is required if and only if its scope flag is on.
        if (values.perOrder) {
            const result = percentField('Order percentage').safeParse(
                values.orderPercent,
            )
            if (!result.success) {
                result.error.issues.forEach((issue) =>
                    ctx.addIssue({ ...issue, path: ['orderPercent'] }),
                )
            }
        }

        if (values.perReservation) {
            const result = percentField('Reservation percentage').safeParse(
                values.reservationPercent,
            )
            if (!result.success) {
                result.error.issues.forEach((issue) =>
                    ctx.addIssue({ ...issue, path: ['reservationPercent'] }),
                )
            }
        }
    })

export type CommissionFormOutput = z.output<typeof commissionValidationSchema>

export const commissionDefaultValues: CommissionFormInput = {
    restaurantId: '',
    perOrder: true,
    perReservation: false,
    orderPercent: '',
    reservationPercent: '',
    reservationBasis: 'SUBTOTAL',
    is_active: true,
}

/**
 * Drops the percentages whose scope flag is off. The API answers 422 if a
 * percentage is sent while its flag is false, so the keys must be absent
 * rather than merely empty.
 */
export function buildCommissionPayload(
    values: CommissionFormOutput,
): CommissionFormData {
    const payload: CommissionFormData = {
        restaurantId: values.restaurantId,
        perOrder: values.perOrder,
        perReservation: values.perReservation,
        reservationBasis: values.reservationBasis,
        is_active: values.is_active,
    }

    if (values.perOrder && values.orderPercent !== '') {
        payload.orderPercent = Number(values.orderPercent)
    }

    if (values.perReservation && values.reservationPercent !== '') {
        payload.reservationPercent = Number(values.reservationPercent)
    }

    return payload
}

/**
 * `numeric` columns arrive as strings, so parse before arithmetic. Renders
 * "10%" for a charged scope and `null` for one that isn't charged.
 */
export function formatCommissionPercent(
    percent: string | null | undefined,
): string | null {
    if (percent === null || percent === undefined || percent === '') {
        return null
    }

    const parsed = Number(percent)
    if (!Number.isFinite(parsed)) return null

    return `${parsed}%`
}

export const commissionBasisLabels: Record<CommissionBasis, string> = {
    SUBTOTAL: 'Total bill (food + table fee)',
    TABLE_FEE_ONLY: 'Table fee only',
}

export const commissionBasisShortLabels: Record<CommissionBasis, string> = {
    SUBTOTAL: 'Total bill',
    TABLE_FEE_ONLY: 'Table fee only',
}

export type CommissionListResponse = {
    success: boolean
    data: Commission[]
    paginator: {
        totalItems: number
        totalPages: number
        pageSize: number
        currentPage: number
    }
    message: string
}

export type CommissionCreateResponse = {
    success: boolean
    data: Commission
    message: string
}
