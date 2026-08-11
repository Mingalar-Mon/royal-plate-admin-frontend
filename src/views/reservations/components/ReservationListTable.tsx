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

    const columns: ColumnDef<Reservation>[] = useMemo(() => {
        const handleStatusChange = (
            id: string,
            newStatus: ReservationStatus,
        ) => {
            setStatusUpdatingId(id)
            updateStatus(
                { reservationId: id, status: newStatus },
                { onSettled: () => setStatusUpdatingId(null) },
            )
        }

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
                                handleStatusChange(id, newStatus)
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
    }, [navigate, statusUpdatingId, updateStatus])

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
        </>
    )
}

export default ReservationListTable
