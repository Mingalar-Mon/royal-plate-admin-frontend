import { useState } from 'react'
import dayjs from 'dayjs'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import {
    TbBuildingStore,
    TbCalendarMonth,
    TbListDetails,
    TbAlertTriangle,
} from 'react-icons/tb'
import { apiGetPayoutPreview } from '@/services/TransactionService'
import TransactionSummaryCards from '@/views/transaction/TransactionList/components/TransactionSummaryCards'
import TransactionListTable from '@/views/transaction/TransactionList/components/TransactionListTable'
import AdminRestaurantSelect from '../transactions/components/AdminRestaurantSelect'
import { useTransactionStore } from '@/store/transactionStore'
import type { TransactionItem, TransactionSummary } from '@/@types/transaction'

const AdminSettlement = () => {
    const tableData = useTransactionStore((state) => state.tableData)
    const selectedRestaurantId = tableData.restaurantId

    const [fromDate, setFromDate] = useState<Date | null>(null)
    const [toDate, setToDate] = useState<Date | null>(null)
    const [loading, setLoading] = useState(false)
    const [transactions, setTransactions] = useState<TransactionItem[]>([])
    const [summary, setSummary] = useState<TransactionSummary | undefined>()
    const [total, setTotal] = useState(0)
    const [alreadySettled, setAlreadySettled] = useState(false)
    const [hasFetched, setHasFetched] = useState(false)

    const canFetch = !!selectedRestaurantId && fromDate && toDate

    const fetchData = async () => {
        if (!selectedRestaurantId || !fromDate || !toDate) return

        setLoading(true)
        setAlreadySettled(false)
        setHasFetched(false)
        try {
            const response = await apiGetPayoutPreview({
                restaurantId: selectedRestaurantId,
                fromDate: dayjs(fromDate).format('YYYY-MM-DD'),
                toDate: dayjs(toDate).format('YYYY-MM-DD'),
                page: tableData.page,
                limit: tableData.limit,
            })

            const hasSettled = response.data.some((item) => item.isSettle)

            if (hasSettled) {
                setAlreadySettled(true)
                setTransactions([])
                setSummary(undefined)
                setTotal(0)
            } else {
                setTransactions(response.data)
                setSummary(response.summary)
                setTotal(response.paginator?.totalItems || 0)
            }
            setHasFetched(true)
        } catch {
            toast.push(
                <Notification type="danger" title="Fetch failed">
                    Could not fetch payout preview. Please try again.
                </Notification>,
            )
        } finally {
            setLoading(false)
        }
    }

    const handleRefresh = () => {
        fetchData()
    }

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <h3 className="text-primary">Settlement</h3>
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
                                Pick a restaurant above to view settlement
                                details.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-300">
                                        From
                                    </span>
                                    <DatePicker
                                        size="sm"
                                        value={fromDate}
                                        onChange={(date) => setFromDate(date)}
                                        maxDate={
                                            toDate
                                                ? dayjs(toDate)
                                                      .toDate()
                                                : dayjs()
                                                      .subtract(1, 'day')
                                                      .toDate()
                                        }
                                        inputFormat="YYYY-MM-DD"
                                        clearable
                                        className="w-52"
                                    />
                                    <span className="whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-300">
                                        To
                                    </span>
                                    <DatePicker
                                        size="sm"
                                        value={toDate}
                                        onChange={(date) => setToDate(date)}
                                        maxDate={dayjs()
                                            .subtract(1, 'day')
                                            .toDate()}
                                        minDate={fromDate ? dayjs(fromDate).toDate() : undefined}
                                        inputFormat="YYYY-MM-DD"
                                        clearable
                                        className="w-52"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="solid"
                                        onClick={fetchData}
                                        disabled={!canFetch}
                                        loading={loading}
                                    >
                                        Search
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="default"
                                        onClick={handleRefresh}
                                        disabled={!canFetch || alreadySettled}
                                    >
                                        Refresh
                                    </Button>
                                </div>
                            </div>

                            {alreadySettled && (
                                <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                                    <div className="shrink-0 rounded-full bg-amber-100 p-2 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                                        <TbAlertTriangle className="text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                                            Already settled transactions exist in
                                            your date filter.
                                        </p>
                                        <p className="mt-0.5 text-xs text-amber-600 dark:text-amber-400">
                                            Please adjust the date range to
                                            exclude already settled transactions.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {hasFetched && !alreadySettled && (
                                <>
                                    <TransactionSummaryCards
                                        summary={summary}
                                        loading={loading}
                                    />
                                    <TransactionListTable
                                        data={transactions}
                                        total={total}
                                        loading={loading}
                                    />
                                </>
                            )}
                        </>
                    )}
                </div>
            </AdaptiveCard>
        </Container>
    )
}

export default AdminSettlement
