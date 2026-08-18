import { useOwnerStore } from '@/store/ownerStore'
import { useOwnerListQuery } from '@/utils/custom-hooks/useOwner'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import OwnerListActionTools from './components/OwnerListActionTools'
import OwnerListTableTools from './components/OwnerListTableTools'
import OwnerListTable from './components/OwnerListTable'

const OwnerList = () => {
    // ✅ Extract a single global query snapshot from your store
    const tableData = useOwnerStore((state) => state.tableData)

    const { data, isLoading } = useOwnerListQuery(tableData)

    const ownersList = data?.data || []
    const ownersTotal = data?.paginator?.totalItems || 0

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3>Restaurant Owners</h3>
                        <OwnerListActionTools />
                    </div>
                    <OwnerListTableTools />
                    <OwnerListTable
                        data={ownersList}
                        total={ownersTotal}
                        loading={isLoading}
                    />
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default OwnerList
