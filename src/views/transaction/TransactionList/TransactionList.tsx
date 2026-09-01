import { useParams } from 'react-router'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import { useTransactionStore } from '@/store/transactionStore'
import { useGetTransactions } from '@/utils/custom-hooks/useTransaction'
import TransactionSummaryCards from './components/TransactionSummaryCards'
import TransactionListTableTools from './components/TransactionListTableTools'
import TransactionListTable from './components/TransactionListTable'

const TransactionList = () => {
    const { restaurantId } = useParams()
    const tableData = useTransactionStore((state) => state.tableData)
    const { data, isLoading, refetch } = useGetTransactions(
        restaurantId!,
        tableData,
    )

    const transactions = data?.data || []
    const total = data?.paginator?.totalItems || 0

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <h3 className="text-primary">Transactions</h3>
                    </div>
                    <TransactionSummaryCards
                        summary={data?.summary}
                        loading={isLoading}
                    />
                    <TransactionListTableTools onRefresh={refetch} />
                    <TransactionListTable
                        data={transactions}
                        total={total}
                        loading={isLoading}
                    />
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default TransactionList