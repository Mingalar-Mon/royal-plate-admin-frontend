import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import TableListActionTools from './components/TableListActionTools'
import TableListTableTools from './components/TableListTableTools'
import TableListCards from './components/TableListCards'
import { useTableStore } from '@/store/tableStore'
import { useParams } from 'react-router'
import { useTableListQuery } from '@/utils/custom-hooks/useTable'

const statusFilters = [
    { value: '', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'maintenance', label: 'Maintenance' },
] as const

const TableList = () => {
    const { restaurantId } = useParams()
    const tableData = useTableStore((state) => state.tableData)
    const setTableData = useTableStore((state) => state.setTableData)
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
                        <h3 className='text-primary'>Tables</h3>
                        <TableListActionTools onRefresh={refetch} />
                    </div>
                    <TableListTableTools />
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Status:
                        </span>
                        <div className="flex rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
                            {statusFilters.map((filter) => (
                                <button
                                    key={filter.value || 'all'}
                                    type="button"
                                    className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition ${
                                        tableData.status === filter.value
                                            ? 'bg-white text-primary shadow-sm dark:bg-gray-700'
                                            : 'text-gray-500 hover:text-primary'
                                    }`}
                                    onClick={() =>
                                        setTableData((prev) => ({
                                            ...prev,
                                            status: filter.value,
                                            pageIndex: 1,
                                        }))
                                    }
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <TableListCards
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
