import { useCallback, useMemo, useState } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import DataTable from '@/components/shared/DataTable'
import type { OnSortParam } from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import Switcher from '@/components/ui/Switcher'
import toast from '@/components/ui/toast'
import { TbEye } from 'react-icons/tb'
import { useCommissionStore } from '@/store/commissionStore'
import { getCommissionErrorMessage } from '@/services/CommissionService'
import { useUpdateCommissionStatus } from '@/utils/custom-hooks/useCommission'
import CommissionBatchDetailModal from './CommissionBatchDetailModal'
import {
    commissionBasisShortLabels,
    formatCommissionPercent,
    type Commission,
    type CommissionSortKey,
} from '@/@types/commission'

const validSortKeys = new Set<CommissionSortKey>([
    'id',
    'code',
    'perOrder',
    'perReservation',
    'orderPercent',
    'reservationPercent',
    'reservationBasis',
    'is_active',
    'deactivated_date',
    'created_at',
    'updated_at',
])

/** A scope that is switched off, or has no rate yet, reads as "Not charged". */
const RateCell = ({
    enabled,
    percent,
}: {
    enabled: boolean
    percent: string | null
}) => {
    if (!enabled) {
        return (
            <span className="text-xs text-gray-400 dark:text-gray-500">
                Not charged
            </span>
        )
    }

    return (
        <span className="font-semibold text-gray-900 dark:text-gray-100">
            {formatCommissionPercent(percent) ?? '0%'}
        </span>
    )
}

interface CommissionListTableProps {
    data: Commission[]
    total: number
    loading: boolean
}

const CommissionListTable = ({
    data,
    total,
    loading,
}: CommissionListTableProps) => {
    const tableData = useCommissionStore((state) => state.tableData)
    const setTableData = useCommissionStore((state) => state.setTableData)

    const { mutate: updateStatus } = useUpdateCommissionStatus()

    const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(
        null,
    )
    const [viewingBatch, setViewingBatch] = useState<Commission | null>(null)
    // A status change is always a confirm: deactivating strands the restaurant
    // at 0%, and activating silently retires whatever is live today.
    const [pendingStatusChange, setPendingStatusChange] = useState<{
        batch: Commission
        nextStatus: boolean
        retiredCode?: string
    } | null>(null)

    // The switch is optimistic-looking but nothing is applied until confirmed.
    const requestStatusChange = useCallback(
        (batch: Commission, nextStatus: boolean) => {
            if (nextStatus === batch.is_active) return

            // The batch this one will displace, so the confirm can name it.
            const currentActive = data.find(
                (item) =>
                    item.id !== batch.id &&
                    item.is_active &&
                    item.restaurant?.id === batch.restaurant?.id,
            )

            setPendingStatusChange({
                batch,
                nextStatus,
                retiredCode: nextStatus ? currentActive?.code : undefined,
            })
        },
        [data],
    )

    const confirmStatusChange = () => {
        if (!pendingStatusChange) return

        const { batch, nextStatus, retiredCode } = pendingStatusChange
        setUpdatingStatusId(batch.id)

        updateStatus(
            { id: batch.id, status: nextStatus },
            {
                onSuccess: () => {
                    toast.push(
                        <Notification
                            type="success"
                            title={
                                nextStatus ? 'Batch activated' : 'Batch retired'
                            }
                        >
                            {nextStatus
                                ? retiredCode
                                    ? `${batch.code} is now active. ${retiredCode} was retired.`
                                    : `${batch.code} is now active.`
                                : `${batch.code} is no longer charging commission.`}
                        </Notification>,
                    )
                },
                onError: (error) => {
                    toast.push(
                        <Notification
                            type="danger"
                            title="Status update failed"
                        >
                            {getCommissionErrorMessage(
                                error,
                                'Could not update commission status. Please try again.',
                            )}
                        </Notification>,
                    )
                },
                onSettled: () => {
                    setUpdatingStatusId(null)
                    setPendingStatusChange(null)
                },
            },
        )
    }

    const columns: ColumnDef<Commission>[] = useMemo(
        () => [
            {
                header: 'Batch Code',
                accessorKey: 'code',
                cell: (props) => (
                    <span className="whitespace-nowrap font-semibold text-gray-900 dark:text-gray-100">
                        {props.row.original.code || '—'}
                    </span>
                ),
            },
            {
                header: 'Restaurant',
                id: 'restaurant',
                enableSorting: false,
                cell: (props) => (
                    <div>
                        <span className="font-semibold">
                            {props.row.original.restaurant?.name || '—'}
                        </span>
                        {!props.row.original.restaurant?.name && (
                            <div className="text-xs text-gray-500">
                                {props.row.original.restaurant?.id}
                            </div>
                        )}
                    </div>
                ),
            },
            {
                header: 'Order Rate',
                accessorKey: 'orderPercent',
                cell: (props) => (
                    <RateCell
                        enabled={props.row.original.perOrder}
                        percent={props.row.original.orderPercent}
                    />
                ),
            },
            {
                header: 'Reservation Rate',
                accessorKey: 'reservationPercent',
                cell: (props) => (
                    <RateCell
                        enabled={props.row.original.perReservation}
                        percent={props.row.original.reservationPercent}
                    />
                ),
            },
            {
                header: 'Reservation Basis',
                accessorKey: 'reservationBasis',
                cell: (props) => {
                    const batch = props.row.original
                    if (!batch.perReservation) {
                        return (
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                —
                            </span>
                        )
                    }
                    return (
                        <span className="whitespace-nowrap text-gray-700 dark:text-gray-200">
                            {commissionBasisShortLabels[batch.reservationBasis]}
                        </span>
                    )
                },
            },
            {
                header: 'Status',
                accessorKey: 'is_active',
                cell: (props) => {
                    const batch = props.row.original
                    return (
                        <Switcher
                            checked={batch.is_active}
                            checkedContent={
                                <span className="inline-block w-16 text-xs font-semibold">
                                    Active
                                </span>
                            }
                            unCheckedContent={
                                <span className="inline-block w-16 text-xs font-semibold">
                                    Inactive
                                </span>
                            }
                            isLoading={updatingStatusId === batch.id}
                            onChange={(checked) =>
                                requestStatusChange(batch, checked)
                            }
                        />
                    )
                },
            },
            {
                header: 'Created',
                accessorKey: 'created_at',
                cell: (props) => (
                    <span className="whitespace-nowrap">
                        {dayjs(props.row.original.created_at).format(
                            'DD/MM/YYYY',
                        )}
                    </span>
                ),
            },
            {
                header: 'Retired',
                accessorKey: 'deactivated_date',
                cell: (props) => {
                    const batch = props.row.original
                    if (!batch.deactivated_date) {
                        return (
                            <span className="text-gray-400 dark:text-gray-500">
                                —
                            </span>
                        )
                    }
                    return (
                        <span className="whitespace-nowrap">
                            {dayjs(batch.deactivated_date).format('DD/MM/YYYY')}
                        </span>
                    )
                },
            },
            {
                header: '',
                id: 'actions',
                enableSorting: false,
                cell: (props) => (
                    <Button
                        size="xs"
                        variant="plain"
                        icon={<TbEye />}
                        onClick={() => setViewingBatch(props.row.original)}
                    />
                ),
            },
        ],
        [requestStatusChange, updatingStatusId],
    )

    const handlePaginationChange = (page: number) => {
        setTableData((prev) => ({ ...prev, page }))
    }

    const handleSelectChange = (limit: number) => {
        setTableData((prev) => ({ ...prev, limit, page: 1 }))
    }

    const handleSort = (sort: OnSortParam) => {
        const sortKey = String(sort.key) as CommissionSortKey
        if (!validSortKeys.has(sortKey)) return

        setTableData((prev) => ({
            ...prev,
            sortKey,
            sortOrder: sort.order === 'asc' ? 'ASC' : 'DESC',
            page: 1,
        }))
    }

    const deactivating = pendingStatusChange?.nextStatus === false

    return (
        <>
            <DataTable
                columns={columns}
                data={data}
                loading={loading}
                pagingData={{
                    total,
                    pageIndex: tableData.page,
                    pageSize: tableData.limit,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
            />

            <ConfirmDialog
                isOpen={Boolean(pendingStatusChange)}
                type={deactivating ? 'warning' : 'info'}
                title={
                    deactivating
                        ? 'Retire this commission batch?'
                        : 'Activate this commission batch?'
                }
                confirmText={deactivating ? 'Retire batch' : 'Activate batch'}
                confirmButtonProps={{
                    loading: updatingStatusId === pendingStatusChange?.batch.id,
                }}
                onCancel={() => setPendingStatusChange(null)}
                onConfirm={confirmStatusChange}
            >
                {pendingStatusChange && (
                    <div className="space-y-2 text-sm">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {pendingStatusChange.batch.code} —{' '}
                            {pendingStatusChange.batch.restaurant?.name}
                        </p>
                        {deactivating ? (
                            <p className="text-gray-600 dark:text-gray-300">
                                This restaurant will stop being charged
                                commission until you activate or create a batch.
                                Orders and reservations still go through — they
                                will simply carry a 0% commission fee.
                            </p>
                        ) : (
                            <p className="text-gray-600 dark:text-gray-300">
                                {pendingStatusChange.retiredCode
                                    ? `This will retire ${pendingStatusChange.retiredCode}, which is currently active for this restaurant.`
                                    : 'This batch will start charging commission immediately.'}
                            </p>
                        )}
                    </div>
                )}
            </ConfirmDialog>

            <CommissionBatchDetailModal
                batch={viewingBatch}
                onClose={() => setViewingBatch(null)}
            />
        </>
    )
}

export default CommissionListTable
