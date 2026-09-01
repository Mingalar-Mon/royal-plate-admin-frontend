import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import {
    TbBuildingStore,
    TbCalendarMonth,
    TbListDetails,
} from 'react-icons/tb'
import { useTransactionStore } from '@/store/transactionStore'
import { useGetTransactions } from '@/utils/custom-hooks/useTransaction'
import TransactionSummaryCards from '@/views/transaction/TransactionList/components/TransactionSummaryCards'
import TransactionListTableTools from '@/views/transaction/TransactionList/components/TransactionListTableTools'
import TransactionListTable from '@/views/transaction/TransactionList/components/TransactionListTable'
import AdminRestaurantSelect from './components/AdminRestaurantSelect'

const AdminTransactionList = () => {
    const tableData = useTransactionStore((state) => state.tableData)
    const selectedRestaurantId = tableData.restaurantId

    const { data, isLoading, refetch } = useGetTransactions(
        selectedRestaurantId,
        tableData,
    )

    const transactions = data?.data || []
    const total = data?.paginator?.totalItems || 0

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <h3 className="text-primary">Restaurant Transactions</h3>
                    </div>
                    <AdminRestaurantSelect />
                    {!selectedRestaurantId ? (
                        <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 px-5 text-center dark:border-gray-700">
                            <div className="rounded-2xl bg-gray-100 p-3 text-xl text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                                <TbBuildingStore />
                            </div>
                            <div className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                <TbListDetails />
                                No restaurant selected
                            </div>
                            <p className="mt-1 flex max-w-sm items-center gap-1.5 text-xs leading-5 text-gray-500 dark:text-gray-400">
                                <TbCalendarMonth />
                                Pick a restaurant above to see its transactions
                                and monthly summaries.
                            </p>
                        </div>
                    ) : (
                        <>
                            <TransactionSummaryCards
                                summary={data?.summary}
                                loading={isLoading}
                            />
                            <TransactionListTableTools
                                restaurantId={selectedRestaurantId}
                                onRefresh={refetch}
                            />
                            <TransactionListTable
                                data={transactions}
                                total={total}
                                loading={isLoading}
                            />
                        </>
                    )}
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default AdminTransactionList