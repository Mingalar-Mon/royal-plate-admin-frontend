import { useState } from 'react'
import dayjs from 'dayjs'
import { TbChevronRight, TbClock, TbEdit, TbUsers } from 'react-icons/tb'
import { useTableStore } from '@/store/tableStore'
import { useUpdateTableMutation } from '@/utils/custom-hooks/useTable'
import type { Table, TableStatus } from '../../types/table.type'
import TableTypeBadge from '../../components/TableTypeBadge'
import TableStatusBadge from '../../components/TableStatusBadge'
import CardSkeleton from '@/components/shared/CardSkeletonGrid'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Pagination from '@/components/ui/Pagination'
import { Notification, toast } from '@/components/ui'
import TableForm from '../../components/TableForm'
import type { TableFormData } from '../../components/TableForm'

interface Props {
    data: Table[]
    total: number
    loading: boolean
}

const TableListCards = ({ data, total, loading }: Props) => {
    const tableData = useTableStore((state) => state.tableData)
    const setTableData = useTableStore((state) => state.setTableData)
    const { mutate: updateStatus, isPending: isUpdating } =
        useUpdateTableMutation()
    const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null)
    const [editingTable, setEditingTable] = useState<Table | null>(null)
    const [viewingTable, setViewingTable] = useState<Table | null>(null)

    const handleStatusChange = (table: Table, status: TableStatus) => {
        setStatusUpdatingId(table.id)
        updateStatus(
            { id: table.id, data: { status } },
            { onSettled: () => setStatusUpdatingId(null) },
        )
    }

    const handleUpdateTable = (id: string, formData: TableFormData) => {
        updateStatus(
            { id, data: formData },
            {
                onSuccess: () => {
                    setEditingTable(null)
                    toast.push(
                        <Notification type="success" title="Success">
                            Table updated successfully
                        </Notification>,
                        { placement: 'top-center' },
                    )
                },
                onError: (error: any) => {
                    toast.push(
                        <Notification type="danger" title="Error">
                            {error?.response?.data?.message ||
                                'Failed to update table'}
                        </Notification>,
                    )
                },
            },
        )
    }

    if (loading) {
        return <CardSkeleton count={6} />
    }

    if (data.length === 0) {
        return <div className="py-12 text-center text-gray-500">No tables found.</div>
    }

    return (
        <>
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
                                    onChange={(status: TableStatus) => handleStatusChange(table, status)}
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

                            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
                                <Button
                                    size="sm"
                                    variant="plain"
                                    icon={<TbEdit />}
                                    onClick={() => setEditingTable(table)}
                                >
                                    Edit
                                </Button>
<Button
                                size="sm"
                                variant="plain"
                                icon={<TbChevronRight />}
                                onClick={() => setViewingTable(table)}
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

            <Dialog
                isOpen={Boolean(editingTable)}
                onClose={() => setEditingTable(null)}
                onRequestClose={() => setEditingTable(null)}
                width={880}
                contentClassName="flex max-h-[90vh] flex-col overflow-y-auto"
                title="Edit Table"
            >
                {editingTable && (
                    <TableForm
                        isNew={false}
                        defaultValues={{
                            type: editingTable.type,
                            capacity: editingTable.capacity,
                            durationMinutes: editingTable.durationMinutes || null,
                            gap: editingTable.gap || null,
                            tableFee: editingTable.tableFee ?? undefined,
                            status: editingTable.status,
                            services: editingTable.services || [],
                        }}
                        onFormSubmit={(formData) =>
                            handleUpdateTable(editingTable.id, formData)
                        }
                    >
                        <div className="flex items-center justify-between">
                            <Button
                                type="button"
                                variant="plain"
                                onClick={() => setEditingTable(null)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" variant="solid" loading={isUpdating}>
                                Save Changes
                            </Button>
                        </div>
                    </TableForm>
                )}
            </Dialog>

            <Dialog
                isOpen={Boolean(viewingTable)}
                onClose={() => setViewingTable(null)}
                onRequestClose={() => setViewingTable(null)}
                width={640}
                contentClassName="flex max-h-[90vh] flex-col overflow-y-auto"
                title="Table Details"
            >
                {viewingTable && (
                    <div className="p-6">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                    Table #{viewingTable.id.slice(0, 8)}
                                </p>
                                <h3 className="mt-1 text-xl font-bold capitalize text-gray-900 dark:text-gray-100">
                                    {viewingTable.type}
                                </h3>
                            </div>
                            <TableStatusBadge
                                status={viewingTable.status}
                                isLoading={false}
                                onChange={() => undefined}
                            />
                        </div>

                        <div className="mt-4">
                            <TableTypeBadge type={viewingTable.type} />
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                            <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-700/60">
                                <div className="flex items-center gap-1 text-gray-500">
                                    <TbUsers /> Capacity
                                </div>
                                <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
                                    {viewingTable.capacity} persons
                                </p>
                            </div>
                            <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-700/60">
                                <div className="flex items-center gap-1 text-gray-500">
                                    <TbClock /> Duration
                                </div>
                                <p className="mt-1 font-semibold text-gray-900 dark:text-gray-100">
                                    {viewingTable.durationMinutes || '—'} min
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2 border-t border-gray-100 text-sm dark:border-gray-700">
                            <div className="flex justify-between gap-3 border-b border-gray-100 py-3 dark:border-gray-700">
                                <span className="text-gray-500">Gap between reservations</span>
                                <span className="font-medium">{viewingTable.gap || '—'} min</span>
                            </div>
                            <div className="flex justify-between gap-3 border-b border-gray-100 py-3 dark:border-gray-700">
                                <span className="text-gray-500">Table fee</span>
                                <span className="font-semibold">
                                    {viewingTable.tableFee?.toLocaleString() || '—'} MMK
                                </span>
                            </div>
                            <div className="flex justify-between gap-3 border-b border-gray-100 py-3 dark:border-gray-700">
                                <span className="text-gray-500">Created</span>
                                <span className="font-medium">
                                    {dayjs(viewingTable.created_at).format('DD MMM YYYY, HH:mm')}
                                </span>
                            </div>
                            <div className="flex justify-between gap-3 py-3">
                                <span className="text-gray-500">Updated</span>
                                <span className="font-medium">
                                    {dayjs(viewingTable.updated_at).format('DD MMM YYYY, HH:mm')}
                                </span>
                            </div>
                        </div>

                        {viewingTable.services && viewingTable.services.length > 0 && (
                            <div className="mt-6 border-t border-gray-100 pt-4 dark:border-gray-700">
                                <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    Services & Amenities
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {viewingTable.services.map((service) => (
                                        <span
                                            key={service}
                                            className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                                        >
                                            {service}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Dialog>
        </>
    )
}

export default TableListCards