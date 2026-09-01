import { useState } from 'react'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { useCommissionStore } from '@/store/commissionStore'
import {
    useCreateCommissionMutation,
    useGetCommissions,
} from '@/utils/custom-hooks/useCommission'
import CommissionListActionTools from './components/CommissionListActionTools'
import CommissionListTableTools from './components/CommissionListTableTools'
import CommissionListTable from './components/CommissionListTable'
import CommissionForm from '../components/CommissionForm'
import type { CommissionFormData } from '@/@types/commission'

const CommissionList = () => {
    const tableData = useCommissionStore((state) => state.tableData)
    const { data, isLoading } = useGetCommissions(tableData)
    const { mutate: createCommission, isPending } =
        useCreateCommissionMutation()

    const [createDialogOpen, setCreateDialogOpen] = useState(false)

    const commissions = data?.data || []
    const total = data?.paginator?.totalItems || 0

    const handleCreate = (formData: CommissionFormData) => {
        createCommission(formData, {
            onSuccess: () => setCreateDialogOpen(false),
        })
    }

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <h3>Restaurant Commissions</h3>
                        <CommissionListActionTools
                            onAddCommission={() =>
                                setCreateDialogOpen(true)
                            }
                        />
                    </div>
                    <CommissionListTableTools />
                    <CommissionListTable
                        data={commissions}
                        total={total}
                        loading={isLoading}
                    />
                </div>
            </AdaptiveCard>
            <Dialog
                isOpen={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                onRequestClose={() => setCreateDialogOpen(false)}
                width={560}
                contentClassName="max-h-[90vh] overflow-y-auto"
            >
                <div className="p-4">
                    <CommissionForm onFormSubmit={handleCreate}>
                        <Alert
                            showIcon
                            type="warning"
                            title="Heads up"
                        >
                            <p className="text-sm leading-relaxed">
                                Creating a new commission batch will
                                automatically deactivate all existing batches.
                                Only the newly created batch will remain
                                active.
                            </p>
                        </Alert>
                        <div className="flex items-center justify-end gap-2">
                            <Button
                                type="button"
                                variant="plain"
                                onClick={() => setCreateDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="solid"
                                loading={isPending}
                            >
                                Create Commission
                            </Button>
                        </div>
                    </CommissionForm>
                </div>
            </Dialog>
        </Container>
    )
}

export default CommissionList