import { useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import DataTable from '@/components/shared/DataTable'
import Tag from '@/components/ui/Tag'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import Switcher from '@/components/ui/Switcher'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { FormItem } from '@/components/ui/Form'
import { TbPencil } from 'react-icons/tb'
import { useCommissionStore } from '@/store/commissionStore'
import {
    useUpdateCommissionPercentage,
    useUpdateCommissionStatus,
} from '@/utils/custom-hooks/useCommission'
import {
    commissionValidationSchema,
    type Commission,
} from '@/@types/commission'

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

    const { mutate: updateStatus, isPending: statusPending } =
        useUpdateCommissionStatus()
    const { mutate: updatePercentage, isPending: percentagePending } =
        useUpdateCommissionPercentage()

    const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(
        null,
    )
    const [editingCommission, setEditingCommission] =
        useState<Commission | null>(null)
    const [percentageInput, setPercentageInput] = useState('')
    const [percentageError, setPercentageError] = useState<
        string | undefined
    >()

    const getRestaurantLabel = (commission: Commission) =>
        commission.restaurantName ||
        commission.restaurant?.name ||
        commission.restaurantId ||
        'All Restaurants'

    const handleStatusToggle = (
        commission: Commission,
        nextStatus: boolean,
    ) => {
        setUpdatingStatusId(commission.id)
        updateStatus(
            { id: commission.id, status: nextStatus },
            {
                onSuccess: () => {
                    toast.push(
                        <Notification type="success" title="Status updated">
                            Commission status has been updated successfully.
                        </Notification>,
                    )
                },
                onError: () => {
                    const isDeactivation =
                        commission.is_active === true && nextStatus === false

                    toast.push(
                        <Notification
                            type="danger"
                            title="Status update failed"
                        >
                            {isDeactivation
                                ? 'At least one commission batch must remain active.'
                                : 'Could not update commission status. Please try again.'}
                        </Notification>,
                    )
                },
                onSettled: () => setUpdatingStatusId(null),
            },
        )
    }

    const openPercentageDialog = (commission: Commission) => {
        setEditingCommission(commission)
        setPercentageInput(String(commission.percentage))
        setPercentageError(undefined)
    }

    const closePercentageDialog = () => {
        setEditingCommission(null)
        setPercentageError(undefined)
    }

    const handleSavePercentage = () => {
        if (!editingCommission) return

        const result = commissionValidationSchema.safeParse({
            percentage: percentageInput,
        })
        if (!result.success) {
            setPercentageError(result.error.issues[0]?.message)
            return
        }

        updatePercentage(
            {
                id: editingCommission.id,
                percentage: result.data.percentage,
            },
            {
                onSuccess: () => {
                    toast.push(
                        <Notification
                            type="success"
                            title="Percentage updated"
                        >
                            Commission percentage has been updated
                            successfully.
                        </Notification>,
                    )
                    closePercentageDialog()
                },
                onError: () => {
                    toast.push(
                        <Notification type="danger" title="Update failed">
                            Could not update commission percentage. Please try
                            again.
                        </Notification>,
                    )
                },
            },
        )
    }

    const columns: ColumnDef<Commission>[] = useMemo(
        () => [
            {
                header: 'Restaurant',
                id: 'restaurant',
                cell: (props) => (
                    <div>
                        <span className="font-semibold">
                            {getRestaurantLabel(props.row.original)}
                        </span>
                        {props.row.original.restaurantId &&
                            !props.row.original.restaurantName &&
                            !props.row.original.restaurant?.name && (
                                <div className="text-xs text-gray-500">
                                    {props.row.original.restaurantId}
                                </div>
                            )}
                    </div>
                ),
            },
            {
                header: 'Percentage',
                accessorKey: 'percentage',
                cell: (props) => (
                    <div className="flex items-center gap-1.5">
                        <span className="font-semibold">
                            {props.row.original.percentage}%
                        </span>
                        <Button
                            size="xs"
                            variant="plain"
                            icon={<TbPencil />}
                            onClick={() =>
                                openPercentageDialog(props.row.original)
                            }
                        />
                    </div>
                ),
            },
            {
                header: 'Status',
                accessorKey: 'is_active',
                cell: (props) => {
                    const commission = props.row.original
                    const isActive = commission.is_active
                    if (isActive === undefined) {
                        return '—'
                    }
                    return (
                        <Switcher
                            checked={isActive}
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
                            isLoading={updatingStatusId === commission.id}
                            onChange={(checked) =>
                                handleStatusToggle(commission, checked)
                            }
                        />
                    )
                },
            },
            {
                header: 'Created',
                id: 'createdAt',
                cell: (props) => {
                    const date =
                        props.row.original.createdAt ||
                        props.row.original.created_at
                    return date ? dayjs(date).format('DD/MM/YYYY') : '—'
                },
            },
            {
                header: 'Updated',
                id: 'updatedAt',
                cell: (props) => {
                    const date =
                        props.row.original.updatedAt ||
                        props.row.original.updated_at
                    return date ? dayjs(date).format('DD/MM/YYYY') : '—'
                },
            },
        ],
        [statusPending, updatingStatusId],
    )

    const handlePaginationChange = (page: number) => {
        setTableData((prev) => ({ ...prev, page }))
    }

    const handleSelectChange = (limit: number) => {
        setTableData((prev) => ({ ...prev, limit, page: 1 }))
    }

    const handleSort = (sort: { key: string | number; order: 'asc' | 'desc' | '' }) => {
        setTableData((prev) => ({
            ...prev,
            sortKey: String(sort.key),
            sortOrder: sort.order || 'DESC',
            page: 1,
        }))
    }

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
            <Dialog
                isOpen={Boolean(editingCommission)}
                onClose={closePercentageDialog}
                onRequestClose={closePercentageDialog}
                width={480}
            >
                <div className="p-4">
                    <h4 className="mb-1">Update Commission Percentage</h4>
                    <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                        {editingCommission
                            ? getRestaurantLabel(editingCommission)
                            : ''}
                    </p>
                    <FormItem
                        label="Percentage"
                        asterisk
                        extra="0–100"
                        invalid={Boolean(percentageError)}
                        errorMessage={percentageError}
                    >
                        <Input
                            type="number"
                            min={0}
                            max={100}
                            step="any"
                            value={percentageInput}
                            onChange={(e) => {
                                setPercentageInput(e.target.value)
                                setPercentageError(undefined)
                            }}
                            placeholder="Enter commission percentage"
                        />
                    </FormItem>
                    <div className="mt-6 flex items-center justify-end gap-2">
                        <Button
                            type="button"
                            variant="plain"
                            onClick={closePercentageDialog}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="solid"
                            loading={percentagePending}
                            onClick={handleSavePercentage}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default CommissionListTable