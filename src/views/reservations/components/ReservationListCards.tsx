import { useState } from 'react'
import { useNavigate } from 'react-router'
import dayjs from 'dayjs'
import {
    TbCalendarEvent,
    TbChevronRight,
    TbClock,
} from 'react-icons/tb'
import { useUpdateReservationStatus } from '@/utils/custom-hooks/useReservation'
import { useReservationStore } from '@/store/reservationStore'
import ReservationStatusBadge from './ReservationStatusBadge'
import CardSkeleton from '@/components/shared/CardSkeletonGrid'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Pagination from '@/components/ui/Pagination'
import type { Reservation } from '@/services/ReservationService'
import type { ReservationStatus } from '@/views/reservations/types/reservation.type'

interface Props {
    reservations: Reservation[]
    total: number
    isLoading: boolean
}

const ReservationListCards = ({
    reservations,
    total,
    isLoading,
}: Props) => {
    const navigate = useNavigate()
    const tableData = useReservationStore((state) => state.tableData)
    const setTableData = useReservationStore((state) => state.setTableData)
    const { mutate: updateStatus, isPending: isUpdating } =
        useUpdateReservationStatus()
    const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(
        null,
    )
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
        setStatusUpdatingId(reservation.id)
        updateStatus(
            { reservationId: reservation.id, status: newStatus },
            {
                onSettled: () => {
                    setStatusUpdatingId(null)
                    setStatusChangePreview(null)
                },
            },
        )
    }

    if (isLoading) {
        return <CardSkeleton count={6} />
    }

    if (reservations.length === 0) {
        return (
            <div className="py-12 text-center text-gray-500">
                No reservations found.
            </div>
        )
    }

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {reservations.map((reservation) => {
                    const items = reservation.reservationItems || []
                    const quantity = items.reduce(
                        (sum, item) => sum + item.quantity,
                        0,
                    )

                    return (
                        <div
                            key={reservation.id}
                            className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <button
                                    type="button"
                                    className="text-left"
                                    onClick={() =>
                                        navigate(
                                            `/reservations/detail/${reservation.id}`,
                                        )
                                    }
                                >
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Reservation
                                    </p>
                                    <h5 className="text-lg font-bold text-primary hover:underline">
                                        #{reservation.reservationNumber || reservation.id}
                                    </h5>
                                </button>
                                <ReservationStatusBadge
                                    status={reservation.status}
                                    isLoading={statusUpdatingId === reservation.id}
                                    onChange={(status) =>
                                        handleStatusChange(reservation, status)
                                    }
                                />
                            </div>

                            <div className="mt-4 space-y-2 text-sm">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-gray-500">Customer</span>
                                    <span className="max-w-[60%] truncate text-right font-semibold">
                                        {reservation.user?.name || '-'}
                                    </span>
                                </div>
                                {reservation.user?.phone && (
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-gray-500">Phone</span>
                                        <span className="text-right font-medium">
                                            {reservation.user.phone}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between gap-3">
                                    <span className="flex items-center gap-1 text-gray-500">
                                        <TbCalendarEvent /> Date
                                    </span>
                                    <span className="font-medium">
                                        {dayjs(
                                            reservation.reservationDate ||
                                                reservation.startingTime,
                                        ).format('DD/MM/YYYY')}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="flex items-center gap-1 text-gray-500">
                                        <TbClock /> Time
                                    </span>
                                    <span className="font-medium">
                                        {dayjs(reservation.startingTime).format(
                                            'HH:mm',
                                        )}{' '}
                                        -{' '}
                                        {dayjs(reservation.endingTime).format(
                                            'HH:mm',
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-gray-500">Table</span>
                                    <span className="font-medium">
                                        {reservation.table?.type} (cap.{' '}
                                        {reservation.table?.capacity})
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 flex-1 border-t border-gray-100 pt-4 dark:border-gray-700">
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Pre-ordered dishes (
                                    {items.length})
                                </p>
                                <div className="space-y-1.5">
                                    {items.slice(0, 3).map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between gap-3 text-sm"
                                        >
                                            <span className="min-w-0 truncate">
                                                {item.dish?.name || 'Item'}
                                            </span>
                                            <span className="shrink-0 font-semibold text-gray-500">
                                                x{item.quantity}
                                            </span>
                                        </div>
                                    ))}
                                    {items.length > 3 && (
                                        <p className="text-xs text-gray-500">
                                            +{items.length - 3} more dish(es)
                                        </p>
                                    )}
                                    {items.length === 0 && quantity === 0 && (
                                        <p className="text-xs text-gray-400">
                                            No pre-ordered dishes
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
                                <div>
                                    <p className="text-xs text-gray-500">Total</p>
                                    <p className="font-bold text-primary">
                                        {Number(
                                            reservation.totalPrice || 0,
                                        ).toLocaleString()}{' '}
                                        MMK
                                    </p>
                                </div>
                                <Button
                                    size="sm"
                                    variant="plain"
                                    icon={<TbChevronRight />}
                                    onClick={() =>
                                        navigate(
                                            `/reservations/detail/${reservation.id}`,
                                        )
                                    }
                                >
                                    View details
                                </Button>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="flex justify-end">
                <Pagination
                    pageSize={tableData.pageSize}
                    currentPage={tableData.pageIndex}
                    total={total}
                    onChange={(page) =>
                        setTableData((prev) => ({
                            ...prev,
                            pageIndex: page,
                        }))
                    }
                />
            </div>

            <Dialog
                isOpen={Boolean(statusChangePreview)}
                onClose={() => {
                    if (!isUpdating) setStatusChangePreview(null)
                }}
                onRequestClose={() => {
                    if (!isUpdating) setStatusChangePreview(null)
                }}
                width={480}
                height="min(90vh, 760px)"
                contentClassName="flex max-h-[90vh] flex-col overflow-y-auto"
                title="Preview Reservation Status Change"
            >
                {statusChangePreview && (
                    <div className="flex flex-col gap-5 p-4">
                        <div className="shrink-0">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                Reservation
                            </p>
                            <h5 className="mt-1 text-xl font-bold text-primary">
                                #
                                {statusChangePreview.reservation
                                    .reservationNumber ||
                                    statusChangePreview.reservation.id}
                            </h5>
                        </div>

                        <div className="shrink-0 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                            <div className="flex items-center justify-between gap-3 text-sm">
                                <span className="text-gray-500">Current status</span>
                                <ReservationStatusBadge
                                    status={statusChangePreview.reservation.status}
                                    onChange={() => undefined}
                                    readOnly
                                />
                            </div>
                            <div className="my-3 border-t border-gray-200 dark:border-gray-700" />
                            <div className="flex items-center justify-between gap-3 text-sm">
                                <span className="text-gray-500">New status</span>
                                <ReservationStatusBadge
                                    status={statusChangePreview.newStatus}
                                    onChange={() => undefined}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="shrink-0 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                            <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                Schedule
                            </p>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-gray-500">Date</span>
                                    <span className="font-medium">
                                        {dayjs(
                                            statusChangePreview.reservation
                                                .reservationDate ||
                                                statusChangePreview.reservation
                                                    .startingTime,
                                        ).format('DD/MM/YYYY')}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-gray-500">Time</span>
                                    <span className="font-medium">
                                        {dayjs(
                                            statusChangePreview.reservation
                                                .startingTime,
                                        ).format('HH:mm')}{' '}
                                        -{' '}
                                        {dayjs(
                                            statusChangePreview.reservation
                                                .endingTime,
                                        ).format('HH:mm')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {statusChangePreview.reservation.remark && (
                            <div className="shrink-0 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
                                <p className="mb-1 font-semibold">Reservation note</p>
                                <p className="whitespace-pre-wrap break-words">
                                    {statusChangePreview.reservation.remark}
                                </p>
                            </div>
                        )}

                        <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                            <p className="mb-3 shrink-0 text-sm font-semibold text-amber-800">
                                Pre-ordered dishes (
                                {statusChangePreview.reservation
                                    .reservationItems?.length || 0})
                            </p>
                            <div className="max-h-[35vh] space-y-3 overflow-y-auto pb-2">
                                {(
                                    statusChangePreview.reservation
                                        .reservationItems || []
                                ).length > 0 ? (
                                    statusChangePreview.reservation.reservationItems?.map(
                                        (item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between gap-3 border-b border-gray-100 pb-3 text-sm last:border-b-0 dark:border-gray-700"
                                            >
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-amber-800">
                                                        {item.dish?.name || 'Item'}
                                                    </p>
                                                </div>
                                                <div className="shrink-0 text-right">
                                                    <p className="font-semibold">
                                                        x{item.quantity}
                                                    </p>
                                                    <p className="text-xs font-semibold text-green-500">
                                                        {(
                                                            Number(item.quantity) *
                                                            Number(item.unitPrice)
                                                        ).toLocaleString()}{' '}
                                                        MMK
                                                    </p>
                                                </div>
                                            </div>
                                        ),
                                    )
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        No pre-ordered dishes.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-700">
                            <Button
                                type="button"
                                variant="default"
                                disabled={isUpdating}
                                onClick={() => setStatusChangePreview(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="solid"
                                loading={isUpdating}
                                onClick={confirmStatusChange}
                            >
                                Change status
                            </Button>
                        </div>
                    </div>
                )}
            </Dialog>
        </div>
    )
}

export default ReservationListCards