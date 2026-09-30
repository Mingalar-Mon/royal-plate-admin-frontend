import { useState } from 'react'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import { useCommissionStore } from '@/store/commissionStore'
import { useGetCommissions } from '@/utils/custom-hooks/useCommission'
import CommissionListActionTools from './components/CommissionListActionTools'
import CommissionListTableTools from './components/CommissionListTableTools'
import CommissionListTable from './components/CommissionListTable'
import CommissionCreateModal from './components/CommissionCreateModal'
import CommissionCoveragePanel from './components/CommissionCoveragePanel'

const CommissionList = () => {
    const tableData = useCommissionStore((state) => state.tableData)
    const { data, isLoading } = useGetCommissions(tableData)

    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [presetRestaurantId, setPresetRestaurantId] = useState<
        string | undefined
    >(undefined)

    const commissions = data?.data || []
    const total = data?.paginator?.totalItems || 0

    const openCreateModal = (restaurantId?: string) => {
        setPresetRestaurantId(restaurantId)
        setCreateDialogOpen(true)
    }

    const closeCreateModal = () => {
        setCreateDialogOpen(false)
        setPresetRestaurantId(undefined)
    }

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h3>Commission Batches</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Per-restaurant commission configuration. Batches
                                are immutable — a rate change means a new batch.
                            </p>
                        </div>
                        <CommissionListActionTools
                            onAddCommission={() => openCreateModal()}
                        />
                    </div>
                    <CommissionCoveragePanel
                        onConfigure={(restaurantId) =>
                            openCreateModal(restaurantId)
                        }
                    />
                    <CommissionListTableTools />
                    <CommissionListTable
                        data={commissions}
                        total={total}
                        loading={isLoading}
                    />
                </div>
            </AdaptiveCard>

            <CommissionCreateModal
                isOpen={createDialogOpen}
                restaurantId={presetRestaurantId}
                onClose={closeCreateModal}
            />
        </Container>
    )
}

export default CommissionList
