export const paymentStatusMap: Record<
    string,
    { label: string; bgClass: string; textClass: string }
> = {
    paid: {
        label: 'Paid',
        bgClass: 'bg-success-subtle',
        textClass: 'text-success',
    },
    pending: {
        label: 'Pending',
        bgClass: 'bg-warning-subtle',
        textClass: 'text-warning',
    },
    failed: {
        label: 'Failed',
        bgClass: 'bg-error-subtle',
        textClass: 'text-error',
    },
}
