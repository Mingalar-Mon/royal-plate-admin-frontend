import { useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '@/components/shared/DataTable'
import Tag from '@/components/ui/Tag'
import dayjs from 'dayjs'
import cloneDeep from 'lodash/cloneDeep'
import {
    useReservations,
    useUpdateReservationStatus,
} from '@/utils/custom-hooks/useReservation'
import ReservationStatusBadge from '../components/ReservationStatusBadge'
import ActionColumn from '../components/ActionColumn'
import type {
    // Reservation,
    ReservationStatus,
    TableQueries,
} from '@/views/reservations/types/reservation.type'
import { useNavigate, useParams } from 'react-router'
import { NumericFormat } from 'react-number-format'
import { useReservationStore } from '@/store/reservationStore'
import { Reservation } from '@/services/ReservationService'

interface ReservationListTableProps {
    reservations: any[]
    total: number
    // tableData: any
    // setTableData: any
    isLoading: boolean
    // updateStatus: any
}

const ReservationListTable = ({
    reservations,
    total,
    // tableData,
    // setTableData,
    isLoading,
    // updateStatus,
}: ReservationListTableProps) => {
    // const { restaurantId } = useParams()
    // const {
    //     reservations,
    //     total,
    //     tableData,
    //     setTableData,
    //     isLoading,
    //     updateStatus,
    // } = useReservations(restaurantId)
    const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(
        null,
    )
    const navigate = useNavigate()
    const tableData = useReservationStore((state) => state.tableData)
    const setTableData = useReservationStore((state) => state.setTableData)
    const { mutate: updateStatus } = useUpdateReservationStatus()

    const columns: ColumnDef<Reservation>[] = useMemo(() => {
        const handleStatusChange = async (
            id: string,
            newStatus: ReservationStatus,
        ) => {
            setStatusUpdatingId(id)
            updateStatus({ reservationId: id, status: newStatus })
            setStatusUpdatingId(null)
        }

        const handleView = (reservation: Reservation) => {
            navigate(`/reservations/detail/${reservation.id}`)
        }
        return [
            {
                header: 'Customer',
                accessorKey: 'name',
                cell: (props) => (
                    <div>
                        <div className="font-semibold">
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
                header: 'Date & Time',
                accessorKey: 'startingTime',
                cell: (props) => (
                    <div>
                        <div>
                            {dayjs(props.row.original.startingTime).format(
                                'DD/MM/YYYY',
                            )}
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
                header: 'Pre-ordered Dishes',
                id: 'quantity', // change id to accessory key if you want to add sorting
                cell: (props) => {
                    const items = props.row.original.reservationItems || []
                    if (items.length === 0)
                        return (
                            <span className="text-xs text-gray-400">None</span>
                        )

                    // Renders a mini pill counter showing the total discrete dish types pre-ordered
                    return (
                        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-md font-semibold">
                            {items.length}{' '}
                            {items.length === 1 ? 'Dish' : 'Dishes'}
                        </span>
                    )
                },
            },
            {
                header: 'Table',
                id: 'table.type',
                cell: (props) => (
                    <span>
                        {props.row.original.table.type} (Cap.{' '}
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
                            onChange={(newStatus: ReservationStatus) =>
                                handleStatusChange(id, newStatus)
                            }
                        />
                    )
                },
            },
            {
                header: 'Total Price',
                accessorKey: 'totalPrice',
                cell: (props) => (
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                        <NumericFormat
                            thousandSeparator
                            displayType="text"
                            value={Number(props.row.original.totalPrice)}
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
    }, [statusUpdatingId, updateStatus, navigate])

    const handlePaginationChange = (page: number) => {
        // const newData = cloneDeep(tableData)
        // newData.pageIndex = page
        // setTableData(newData)
        setTableData((prev: any) => ({
            ...prev,
            pageIndex: page,
        }))
    }

    const handleSelectChange = (size: number) => {
        setTableData((prev: any) => ({
            ...prev,
            pageSize: size,
            pageIndex: 1,
        }))
        // const newData = cloneDeep(tableData)
        // newData.pageSize = size
        // newData.pageIndex = 1
        // setTableData(newData)
    }

    const handleSort = (sort: any) => {
        setTableData((prev: any) => ({
            ...prev,
            sort: sort,
            pageIndex: 1,
        }))
        // const newData = cloneDeep(tableData)
        // newData.sort = sort
        // setTableData(newData)
    }

    return (
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
    )
}

export default ReservationListTable
