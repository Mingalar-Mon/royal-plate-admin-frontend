import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import {
    useTableDetailQuery,
    useUpdateTableMutation,
    useDeleteTableMutation,
} from '@/utils/custom-hooks/useTable'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Spinner from '@/components/ui/Spinner'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import TableForm from '../components/TableForm'
import type { TableFormData } from '../components/TableForm'

const TableEdit = () => {
    const { id, restaurantId } = useParams()
    const navigate = useNavigate()
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

    // 1. Fetch live server details and bind asynchronous mutations loaders straight from your hooks
    const { data: tableResponse, isLoading } = useTableDetailQuery(id!)
    const { mutate: updateTable, isPending: isUpdating } =
        useUpdateTableMutation()
    const { mutate: deleteTable } = useDeleteTableMutation()

    if (isLoading) {
        return (
            <div className="p-8 text-center flex justify-center">
                <Spinner size={30} />
            </div>
        )
    }

    const table = tableResponse?.data // Safe extraction of your backend TypeORM response envelope
    if (!table)
        return <div className="p-8 text-center">Table record not found</div>

    // 2. Hydrate your form default boundaries using production primitive datatypes
    const defaultValues: TableFormData = {
        type: table.type,
        capacity: table.capacity,
        durationMinutes: table.durationMinutes || null,
        gap: table.gap || null,
        tableFee: table.tableFee || null,
        status: table.status,
        services: table.services || [],
    }

    const handleSubmit = (formData: TableFormData) => {
        updateTable(
            {
                id: id!,
                data: formData, // Pure JSON parameters payload matches your TypeORM controller expectations
            },
            {
                onSuccess: () => {
                    toast.push(
                        <Notification type="success" title="Success">
                            Table updated successfully
                        </Notification>,
                        { placement: 'top-center' },
                    )
                    navigate(`/restaurants/${restaurantId}/tables`)
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

    const handleDelete = () => {
        deleteTable(id!, {
            onSuccess: () => {
                toast.push(
                    <Notification type="success" title="Success">
                        Table deleted successfully
                    </Notification>,
                    { placement: 'top-center' },
                )
                navigate(`/restaurants/${restaurantId}/tables`)
            },
            onError: (error: any) => {
                toast.push(
                    <Notification type="danger" title="Error">
                        {error?.response?.data?.message ||
                            'Failed to remove table'}
                    </Notification>,
                )
            },
        })
        setDeleteConfirmationOpen(false)
    }

    return (
        <AdaptiveCard>
            <TableForm
                onFormSubmit={handleSubmit}
                defaultValues={defaultValues}
                isNew={false}
            >
                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="plain"
                        icon={<TbArrowNarrowLeft />}
                        onClick={() =>
                            navigate(`/restaurants/${restaurantId}/tables`)
                        }
                    >
                        Back
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="default"
                            icon={<TbTrash />}
                            className="text-red-500 hover:text-red-600"
                            onClick={() => setDeleteConfirmationOpen(true)}
                        >
                            Delete
                        </Button>
                        <Button
                            type="submit"
                            variant="solid"
                            loading={isUpdating} // Hooked directly to mutation loading statuses
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>
            </TableForm>

            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove Restaurant Table"
                onClose={() => setDeleteConfirmationOpen(false)}
                onCancel={() => setDeleteConfirmationOpen(false)}
                onConfirm={handleDelete}
            >
                <p>
                    Are you sure you want to permanently delete this{' '}
                    <strong>{table.type}</strong> table with seating capacity
                    for <strong>{table.capacity}</strong> persons? This action
                    cannot be undone.
                </p>
            </ConfirmDialog>
        </AdaptiveCard>
    )
}

export default TableEdit
