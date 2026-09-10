import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import { usePayoutStore } from '@/store/payoutStore'
import { useGetPayouts } from '@/utils/custom-hooks/usePayout'
import PayoutListTable from './components/PayoutListTable'
import PayoutListActionTools from './components/PayoutListActionTools'

const PayoutList = () => {
    const tableData = usePayoutStore((state) => state.tableData)

    const { data, isLoading, refetch } = useGetPayouts(tableData)

    const payouts = data?.data || []
    const total = data?.paginator?.totalItems || 0

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <h3 className="text-primary">Payout History</h3>
                        <PayoutListActionTools onRefresh={refetch} />
                    </div>
                    <PayoutListTable
                        data={payouts}
                        total={total}
                        loading={isLoading}
                    />
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default PayoutList