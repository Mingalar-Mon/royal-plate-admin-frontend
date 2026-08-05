import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import TableListActionTools from './components/TableListActionTools'
import TableListTableTools from './components/TableListTableTools'
import TableListTable from './components/TableListTable'
import { useTableStore } from '@/store/tableStore'
import { useParams } from 'react-router'
import { useTableListQuery } from '@/utils/custom-hooks/useTable'

const TableList = () => {
    const { restaurantId } = useParams()
    const tableData = useTableStore((state) => state.tableData)
    const { data, isLoading, refetch } = useTableListQuery(
        restaurantId!,
        tableData,
    )

    const tablesList = data?.data || []
    const tablesTotal = data?.paginator?.totalItems || 0

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3>Tables</h3>
                        <TableListActionTools onRefresh={refetch} />
                    </div>
                    <TableListTableTools />
                    <TableListTable
                        data={tablesList}
                        total={tablesTotal}
                        loading={isLoading}
                    />
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default TableList
