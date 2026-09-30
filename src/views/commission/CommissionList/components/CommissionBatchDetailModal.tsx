import dayjs from 'dayjs'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import {
    commissionBasisShortLabels,
    formatCommissionPercent,
    type Commission,
} from '@/@types/commission'

interface CommissionBatchDetailModalProps {
    batch: Commission | null
    onClose: () => void
}

const DetailRow = ({
    label,
    children,
}: {
    label: string
    children: React.ReactNode
}) => (
    <div className="flex items-start justify-between gap-4 py-2 text-sm">
        <span className="text-gray-500 dark:text-gray-400">{label}</span>
        <span className="text-right font-medium text-gray-900 dark:text-gray-100">
            {children}
        </span>
    </div>
)

const CommissionBatchDetailModal = ({
    batch,
    onClose,
}: CommissionBatchDetailModalProps) => {
    return (
        <Dialog
            isOpen={Boolean(batch)}
            width={520}
            onClose={onClose}
            onRequestClose={onClose}
        >
            {batch && (
                <div className="space-y-4 p-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {batch.code}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {batch.restaurant?.name || '—'}
                        </p>
                    </div>

                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        <DetailRow label="Order commission">
                            {batch.perOrder
                                ? `${formatCommissionPercent(batch.orderPercent) ?? '0%'} of the food subtotal`
                                : 'Not charged'}
                        </DetailRow>
                        <DetailRow label="Reservation commission">
                            {batch.perReservation
                                ? `${formatCommissionPercent(batch.reservationPercent) ?? '0%'} of ${
                                      batch.reservationBasis ===
                                      'TABLE_FEE_ONLY'
                                          ? 'the table fee'
                                          : 'the total bill'
                                  }`
                                : 'Not charged'}
                        </DetailRow>
                        <DetailRow label="Reservation basis">
                            {batch.perReservation
                                ? commissionBasisShortLabels[
                                      batch.reservationBasis
                                  ]
                                : '—'}
                        </DetailRow>
                        <DetailRow label="Status">
                            {batch.is_active ? 'Active' : 'Inactive'}
                        </DetailRow>
                        <DetailRow label="Created">
                            {dayjs(batch.created_at).format('DD/MM/YYYY HH:mm')}
                        </DetailRow>
                        <DetailRow label="Retired">
                            {batch.deactivated_date
                                ? dayjs(batch.deactivated_date).format(
                                      'DD/MM/YYYY HH:mm',
                                  )
                                : '—'}
                        </DetailRow>
                    </div>

                    <p className="rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                        This configuration is immutable. To charge a different
                        rate, create a new batch — activating it will retire
                        this one and record the date.
                    </p>

                    <div className="flex justify-end">
                        <Button variant="plain" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            )}
        </Dialog>
    )
}

export default CommissionBatchDetailModal
