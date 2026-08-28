import { useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import type { OnSortParam } from '@/components/shared/DataTable'
import DataTable from '@/components/shared/DataTable'
import dayjs from 'dayjs'
import { TbCalendarEvent, TbX } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import { NumericFormat } from 'react-number-format'
import { useUpdateReservationStatus } from '@/utils/custom-hooks/useReservation'
import ReservationStatusBadge from './ReservationStatusBadge'
import ActionColumn from './ActionColumn'
import type { ReservationStatus } from '@/views/reservations/types/reservation.type'
import { useReservationStore } from '@/store/reservationStore'
import type { Reservation } from '@/services/ReservationService'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'

interface ReservationListTableProps {
    reservations: Reservation[]
    total: number
    isLoading: boolean
}

const ReservationListTable = ({
    reservations,
    total,
    isLoading,
}: ReservationListTableProps) => {
    const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(
        null,
    )
    const navigate = useNavigate()
    const tableData = useReservationStore((state) => state.tableData)
    const setTableData = useReservationStore((state) => state.setTableData)
    const { mutate: updateStatus } = useUpdateReservationStatus()
    const [statusChangePreview, setStatusChangePreview] = useState<{
        reservation: Reservation
        newStatus: ReservationStatus
    } | null>(null)

    const handleStatusChange = (
        reservation: Reservation,
        newStatus: ReservationStatus,
    ) => {
        setStatusChangePreview({ reservation, newStatus })
    }

    const confirmStatusChange = () => {
        if (!statusChangePreview) return

        const { reservation, newStatus } = statusChangePreview
        setStatusChangePreview(null)
        setStatusUpdatingId(reservation.id)
        updateStatus(
            { reservationId: reservation.id, status: newStatus },
            { onSettled: () => setStatusUpdatingId(null) },
        )
    }

    const columns: ColumnDef<Reservation>[] = useMemo(() => {
        const handleView = (reservation: Reservation) => {
            navigate(`/reservations/detail/${reservation.id}`)
        }

        return [
            {
                header: 'Customer',
                id: 'name',
                cell: (props) => (
                    <div className="min-w-36">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                            {props.row.original.user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                            {props.row.original.user.phone ||
                                props.row.original.user.email ||
                                '-'}
                        </div>
                    </div>
                ),
            },
            {
                header: 'Reservation No.',
                accessorKey: 'reservationNumber',
                cell: (props) => (
                    <span className="font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        {props.row.original.reservationNumber || '-'}
                    </span>
                ),
            },
            {
                header: 'Date & time',
                accessorKey: 'startingTime',
                cell: (props) => (
                    <div className="whitespace-nowrap">
                        <div className="font-medium">
                            {dayjs(
                                props.row.original.reservationDate ||
                                    props.row.original.startingTime,
                            ).format('DD/MM/YYYY')}
                        </div>
                        <div className="text-xs text-gray-500">
                            {dayjs(props.row.original.startingTime).format(
                                'HH:mm',
                            )}{' '}
                            -{' '}
                            {dayjs(props.row.original.endingTime).format(
                                'HH:mm',
                            )}
                        </div>
                    </div>
                ),
            },
            {
                header: 'Pre-ordered dishes',
                id: 'quantity',
                cell: (props) => {
                    const items = props.row.original.reservationItems || []
                    const quantity = items.reduce(
                        (total, item) => total + item.quantity,
                        0,
                    )

                    if (items.length === 0) {
                        return (
                            <span className="text-xs text-gray-400">None</span>
                        )
                    }

                    return (
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                {items.length}{' '}
                                {items.length === 1 ? 'dish' : 'dishes'}
                            </span>
                            <span className="text-xs text-gray-500">
                                {quantity} total{' '}
                                {quantity === 1 ? 'item' : 'items'}
                            </span>
                        </div>
                    )
                },
            },
            {
                header: 'Table',
                id: 'table.type',
                cell: (props) => (
                    <span className="whitespace-nowrap">
                        {props.row.original.table.type} (cap.{' '}
                        {props.row.original.table.capacity})
                    </span>
                ),
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const { id, status } = props.row.original
                    return (
                        <ReservationStatusBadge
                            status={status}
                            isLoading={statusUpdatingId === id}
                            onChange={(newStatus) =>
                                handleStatusChange(props.row.original, newStatus)
                            }
                        />
                    )
                },
            },
            {
                header: 'Total price',
                accessorKey: 'totalPrice',
                cell: (props) => (
                    <span className="font-bold text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        <NumericFormat
                            thousandSeparator
                            displayType="text"
                            value={Number(props.row.original.totalPrice || 0)}
                            prefix="MMK "
                        />
                    </span>
                ),
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onView={() => handleView(props.row.original)}
                    />
                ),
            },
        ]
    }, [navigate, statusUpdatingId])

    const handlePaginationChange = (page: number) => {
        setTableData((prev) => ({ ...prev, pageIndex: page }))
    }

    const handleSelectChange = (size: number) => {
        setTableData((prev) => ({
            ...prev,
            pageSize: size,
            pageIndex: 1,
        }))
    }

    const handleSort = (sort: OnSortParam) => {
        setTableData((prev) => ({ ...prev, sort, pageIndex: 1 }))
    }

    const dateRangeActive = Boolean(tableData.dateFrom || tableData.dateTo)

    const handleClearDateRange = () => {
        setTableData((prev) => ({
            ...prev,
            dateFrom: '',
            dateTo: '',
            pageIndex: 1,
        }))
    }

    return (
        <>
            {dateRangeActive && (
                <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        <TbCalendarEvent />
                        {tableData.dateFrom
                            ? `From ${dayjs(tableData.dateFrom).format(
                                  'DD/MM/YYYY',
                              )}`
                            : 'Any start date'}
                        <span className="text-primary/50">—</span>
                        {tableData.dateTo
                            ? `To ${dayjs(tableData.dateTo).format(
                                  'DD/MM/YYYY',
                              )}`
                            : 'Any end date'}
                    </span>
                    <Button
                        size="xs"
                        variant="plain"
                        icon={<TbX />}
                        onClick={handleClearDateRange}
                    >
                        Clear dates
                    </Button>
                </div>
            )}
            <DataTable
                columns={columns}
                data={reservations}
                loading={isLoading}
                pagingData={{
                    total,
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.pageSize,
                }}
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
            />
            <Dialog
                isOpen={Boolean(statusChangePreview)}
                onClose={() => setStatusChangePreview(null)}
                onRequestClose={() => setStatusChangePreview(null)}
                width={480}
                contentClassName="max-h-[90vh] overflow-y-auto"
                title="Preview Reservation"
            >
                {statusChangePreview && (
                    <div className="p-4">
                        <div className="mb-5 rounded-xl bg-gradient-to-r from-primary/10 via-blue-50 to-purple-50 p-4 dark:from-primary/20 dark:via-blue-950/40 dark:to-purple-950/40">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                                        Reservation Preview
                                    </p>
                                    <h5 className="mt-1 text-lg font-bold">
                                        #{statusChangePreview.reservation.reservationNumber || statusChangePreview.reservation.id}
                                    </h5>
                                </div>
                                <ReservationStatusBadge
                                    status={statusChangePreview.newStatus}
                                    readOnly
                                />
                            </div>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                Review the pre-ordered dishes before changing the reservation status.
                            </p>
                        </div>

                        {statusChangePreview.reservation.remark && (
                            <div className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                                <span className="font-semibold">Remark:</span>{' '}
                                {statusChangePreview.reservation.remark}
                            </div>
                        )}

                        <div className="max-h-[45vh] overflow-y-auto pr-1">
                            {statusChangePreview.reservation.reservationItems?.length ? (
                                statusChangePreview.reservation.reservationItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between border-b border-gray-200/70 py-3 first:pt-0 last:border-b-0 last:pb-0 dark:border-gray-700"
                                    >
                                        <div className="min-w-0">
                                            <div className="font-medium text-primary-700 dark:text-primary-300">
                                                {item.dish.name}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-purple-700 dark:text-purple-300">
                                                x{item.quantity}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {(item.quantity * item.unitPrice).toLocaleString()} MMK
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="py-6 text-center text-gray-500">
                                    No pre-ordered dishes found.
                                </p>
                            )}
                        </div>

                        <div className="mt-4 flex justify-end gap-2 border-t border-primary/10 bg-white pt-4 dark:bg-gray-900">
                            <Button
                                type="button"
                                onClick={() => setStatusChangePreview(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="solid"
                                onClick={confirmStatusChange}
                            >
                                Change Status
                            </Button>
                        </div>
                    </div>
                )}
            </Dialog>
        </>
    )
}

export default ReservationListTable
