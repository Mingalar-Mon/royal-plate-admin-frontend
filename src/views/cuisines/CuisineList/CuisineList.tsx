import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import CuisineListActionTools from './components/CuisineListActionTools'
import CuisineListTableTools from './components/CuisineListTableTools'
import CuisineListTable from './components/CuisineListTable'
import { useCuisineStore } from '@/store/cuisineStore'
import { useGetCuisines } from '@/utils/custom-hooks/useCuisine'

const CuisineList = () => {
    const tableData = useCuisineStore((state) => state.tableData)
    // const setTableData = useCuisineStore((state) => state.setTableData)

    const { data, isLoading, refetch } = useGetCuisines(tableData)

    const cuisineList = data?.data || []
    const cuisineTotal = data?.paginator.totalItems || 0

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3>Cuisines</h3>
                        <CuisineListActionTools onRefresh={refetch} />
                    </div>
                    <CuisineListTableTools />
                    <CuisineListTable
                        data={cuisineList}
                        total={cuisineTotal}
                        loading={isLoading}
                    />
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default CuisineList
