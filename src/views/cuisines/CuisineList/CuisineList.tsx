import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import CuisineListActionTools from './components/CuisineListActionTools'
import CuisineListTableTools from './components/CuisineListTableTools'
import CuisineListCards from './components/CuisineListCards'
import CuisineListTable from './components/CuisineListTable'
import CuisineListDialogs from './components/CuisineListDialogs'
import { useCuisineStore } from '@/store/cuisineStore'
import { useGetCuisines } from '@/utils/custom-hooks/useCuisine'
import { useCuisineListActions } from './hooks/useCuisineListActions'

const CuisineList = () => {
    const tableData = useCuisineStore((state) => state.tableData)
    const viewMode = useCuisineStore((state) => state.viewMode)

    const { data, isLoading, refetch } = useGetCuisines(tableData)
    const actions = useCuisineListActions()

    const cuisineList = data?.data || []
    const cuisineTotal = data?.paginator.totalItems || 0

    const listProps = {
        data: cuisineList,
        total: cuisineTotal,
        loading: isLoading,
        onView: actions.setViewingCuisine,
        onEdit: actions.setEditingCuisine,
        onDeactivate: actions.setDeactivateTarget,
        onRestore: actions.setReactivateTarget,
        isCuisineBusy: actions.isCuisineBusy,
    }

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3>Cuisines</h3>
                        <CuisineListActionTools onRefresh={refetch} />
                    </div>
                    <CuisineListTableTools />
                    {viewMode === 'table' ? (
                        <CuisineListTable {...listProps} />
                    ) : (
                        <CuisineListCards {...listProps} />
                    )}
                </div>
            </AdaptiveCard>

            <CuisineListDialogs {...actions} />
        </Container>
    )
}

export default CuisineList
