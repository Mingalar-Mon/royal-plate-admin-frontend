import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import dayjs from 'dayjs'
import { TbChevronRight, TbClock, TbUsers } from 'react-icons/tb'
import { useTableStore } from '@/store/tableStore'
import { useUpdateTableMutation } from '@/utils/custom-hooks/useTable'
import type { Table, TableStatus } from '../../types/table.type'
import TableTypeBadge from '../../components/TableTypeBadge'
import TableStatusBadge from '../../components/TableStatusBadge'
import CardSkeleton from '@/components/shared/CardSkeletonGrid'
import Button from '@/components/ui/Button'
import Pagination from '@/components/ui/Pagination'

interface Props {
    data: Table[]
    total: number
    loading: boolean
}

const TableListCards = ({ data, total, loading }: Props) => {
    const navigate = useNavigate()
    const { restaurantId } = useParams()
    const tableData = useTableStore((state) => state.tableData)
    const setTableData = useTableStore((state) => state.setTableData)
    const { mutate: updateStatus } = useUpdateTableMutation()
    const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null)

    const handleStatusChange = (table: Table, status: TableStatus) => {
        setStatusUpdatingId(table.id)
        updateStatus(
            { id: table.id, data: { status } },
            { onSettled: () => setStatusUpdatingId(null) },
        )
    }

    if (loading) {
        return <CardSkeleton count={6} />
    }

    if (data.length === 0) {
        return <div className="py-12 text-center text-gray-500">No tables found.</div>
    }

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {data.map((table) => (
                    <div
                        key={table.id}
                        className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Table
                                </p>
                                <h5 className="mt-1 text-lg font-bold capitalize">
                                    {table.type}
                                </h5>
                            </div>
                            <TableStatusBadge
                                status={table.status}
                                isLoading={statusUpdatingId === table.id}
                                onChange={(status) => handleStatusChange(table, status)}
                            />
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                            <TableTypeBadge type={table.type} />
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                            <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-700/60">
                                <div className="flex items-center gap-1 text-gray-500">
                                    <TbUsers /> Capacity
                                </div>
                                <p className="mt-1 font-semibold">{table.capacity} persons</p>
                            </div>
                            <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-700/60">
                                <div className="flex items-center gap-1 text-gray-500">
                                    <TbClock /> Duration
                                </div>
                                <p className="mt-1 font-semibold">
                                    {table.durationMinutes || '—'} min
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex-1 space-y-2 border-t border-gray-100 pt-4 text-sm dark:border-gray-700">
                            <div className="flex justify-between gap-3">
                                <span className="text-gray-500">Gap</span>
                                <span className="font-medium">{table.gap || '—'} min</span>
                            </div>
                            <div className="flex justify-between gap-3">
                                <span className="text-gray-500">Table fee</span>
                                <span className="font-semibold">
                                    {table.tableFee?.toLocaleString() || '—'} MMK
                                </span>
                            </div>
                            <div className="flex justify-between gap-3">
                                <span className="text-gray-500">Created</span>
                                <span className="font-medium">
                                    {dayjs(table.created_at).format('DD/MM/YYYY')}
                                </span>
                            </div>
                        </div>

                        {table.services && table.services.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                {table.services.map((service) => (
                                    <span
                                        key={service}
                                        className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                                    >
                                        {service}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="mt-5 flex justify-end border-t border-gray-100 pt-4 dark:border-gray-700">
                            <Button
                                size="sm"
                                variant="plain"
                                icon={<TbChevronRight />}
                                onClick={() =>
                                    navigate(`/restaurants/${restaurantId}/tables/${table.id}`)
                                }
                            >
                                View details
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end">
                <Pagination
                    pageSize={tableData.pageSize}
                    currentPage={tableData.pageIndex}
                    total={total}
                    onChange={(page) => setTableData((prev) => ({ ...prev, pageIndex: page }))}
                />
            </div>
        </div>
    )
}

export default TableListCards
