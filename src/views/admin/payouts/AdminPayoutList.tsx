import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import {
    TbBuildingStore,
    TbCalendarMonth,
    TbListDetails,
} from 'react-icons/tb'
import { usePayoutStore } from '@/store/payoutStore'
import { useGetPayouts } from '@/utils/custom-hooks/usePayout'
import PayoutListTable from '@/views/payouts/components/PayoutListTable'
import PayoutListActionTools from '@/views/payouts/components/PayoutListActionTools'
import PayoutRestaurantSelect from '@/views/payouts/components/PayoutRestaurantSelect'

const AdminPayoutList = () => {
    const tableData = usePayoutStore((state) => state.tableData)
    const selectedRestaurantId = tableData.restaurantId

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
                    <PayoutRestaurantSelect />
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
                                Pick a restaurant above to view its payout
                                history.
                            </p>
                        </div>
                    ) : (
                        <PayoutListTable
                            data={payouts}
                            total={total}
                            loading={isLoading}
                        />
                    )}
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default AdminPayoutList