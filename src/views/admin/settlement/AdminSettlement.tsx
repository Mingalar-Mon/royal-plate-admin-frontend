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
    TbCash,
} from 'react-icons/tb'
import { getTransactionErrorMessage } from '@/services/TransactionService'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import TransactionSummaryCards from '@/views/transaction/TransactionList/components/TransactionSummaryCards'
import PayoutBreakdownCards, {
    PayoutCountsStrip,
} from './components/PayoutBreakdownCards'
import AdminRestaurantSelect from '../transactions/components/AdminRestaurantSelect'
import { useTransactionStore } from '@/store/transactionStore'
import { useGetRestaurantList } from '@/utils/custom-hooks/useRestaurant'
import {
    useCreatePayout,
    useGetPayoutPreview,
} from '@/utils/custom-hooks/usePayout'
import type { PayoutPreviewParams } from '@/services/TransactionService'

const AdminSettlement = () => {
    const tableData = useTransactionStore((state) => state.tableData)
    const selectedRestaurantId = tableData.restaurantId

    const { data: restaurantsResponse } = useGetRestaurantList()
    const selectedRestaurantName =
        restaurantsResponse?.data.find(
            (restaurant) => restaurant.id === selectedRestaurantId,
        )?.name || ''

    const [fromDate, setFromDate] = useState<Date | null>(null)
    const [toDate, setToDate] = useState<Date | null>(null)
    // Null until the operator searches; the query is disabled until then so a
    // half-filled form never fires a request.
    const [previewParams, setPreviewParams] =
        useState<PayoutPreviewParams | null>(null)
    const [confirmOpen, setConfirmOpen] = useState(false)

    const {
        data: previewResponse,
        isFetching,
        refetch,
        isError,
    } = useGetPayoutPreview(
        previewParams ?? {
            restaurantId: '',
            fromDate: '',
            toDate: '',
        },
    )

    const preview = previewResponse?.data
    const { mutate: createPayout, isPending: payoutPending } = useCreatePayout()

    // The API rejects today or later, so yesterday is the ceiling.
    const yesterday = dayjs().subtract(1, 'day').toDate()

    const canSearch = Boolean(selectedRestaurantId && fromDate && toDate)

    const handleSearch = () => {
        if (!selectedRestaurantId || !fromDate || !toDate) return
        setConfirmOpen(false)
        setPreviewParams({
            restaurantId: selectedRestaurantId,
            fromDate: dayjs(fromDate).format('YYYY-MM-DD'),
            toDate: dayjs(toDate).format('YYYY-MM-DD'),
        })
    }

    const handlePayout = () => {
        if (!preview || !previewParams) return

        setConfirmOpen(false)
        createPayout(
            {
                restaurantId: previewParams.restaurantId,
                fromDate: previewParams.fromDate,
                toDate: previewParams.toDate,
                // The preview's totals are strings; the API persists these four
                // exactly as sent, so they have to go over as numbers.
                totalPrice: Number(preview.totals.totalPrice),
                subTotal: Number(preview.totals.subTotal),
                commission_fee: Number(preview.totals.commission_fee),
                netAmount: Number(preview.totals.netAmount),
            },
            {
                onSuccess: () => {
                    toast.push(
                        <Notification type="success" title="Payout completed">
                            {preview.itemCount}{' '}
                            {preview.itemCount === 1 ? 'row' : 'rows'} settled
                            for {preview.code}.
                        </Notification>,
                    )
                    refetch()
                },
                onError: (error) => {
                    toast.push(
                        <Notification type="danger" title="Payout failed">
                            {getTransactionErrorMessage(
                                error,
                                'Could not complete the payout. Please try again.',
                            )}
                        </Notification>,
                    )
                },
            },
        )
    }

    // Nothing left to settle is the server's 400 case; the button should say
    // so before the operator tries.
    const nothingToSettle = Boolean(preview && preview.itemCount === 0)
    const canPayout = Boolean(preview) && !nothingToSettle

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
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-300">
                                        From
                                    </span>
                                    <DatePicker
                                        clearable
                                        size="sm"
                                        value={fromDate}
                                        maxDate={
                                            toDate
                                                ? dayjs(toDate).toDate()
                                                : yesterday
                                        }
                                        inputFormat="YYYY-MM-DD"
                                        className="w-52"
                                        onChange={(date) => setFromDate(date)}
                                    />
                                    <span className="whitespace-nowrap text-sm font-medium text-gray-600 dark:text-gray-300">
                                        To
                                    </span>
                                    <DatePicker
                                        clearable
                                        size="sm"
                                        value={toDate}
                                        maxDate={yesterday}
                                        minDate={
                                            fromDate
                                                ? dayjs(fromDate).toDate()
                                                : undefined
                                        }
                                        inputFormat="YYYY-MM-DD"
                                        className="w-52"
                                        onChange={(date) => setToDate(date)}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="solid"
                                        disabled={!canSearch}
                                        loading={isFetching}
                                        onClick={handleSearch}
                                    >
                                        Preview
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="default"
                                        disabled={!previewParams}
                                        loading={isFetching}
                                        onClick={() => refetch()}
                                    >
                                        Refresh
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="solid"
                                        icon={<TbCash />}
                                        disabled={!canPayout}
                                        loading={payoutPending}
                                        onClick={() => setConfirmOpen(true)}
                                    >
                                        Payout
                                    </Button>
                                </div>
                            </div>

                            {isError && (
                                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                                    Could not load the payout preview. Check the
                                    date range and try again.
                                </div>
                            )}

                            {preview && (
                                <>
                                    <PayoutCountsStrip
                                        itemCount={preview.itemCount}
                                        alreadySettled={preview.alreadySettled}
                                    />

                                    {nothingToSettle ? (
                                        <div className="rounded-xl border border-dashed border-gray-200 px-5 py-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                                            Nothing left to settle in this
                                            range. Every eligible row has
                                            already been paid out.
                                        </div>
                                    ) : (
                                        <>
                                            <TransactionSummaryCards
                                                summary={preview.totals}
                                                loading={isFetching}
                                            />
                                            <PayoutBreakdownCards
                                                breakdown={preview.breakdown}
                                            />
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>

                <ConfirmDialog
                    isOpen={confirmOpen}
                    type="warning"
                    title="Confirm payout"
                    confirmText="Confirm Payout"
                    confirmButtonProps={{
                        loading: payoutPending,
                        disabled: payoutPending,
                    }}
                    onClose={() => setConfirmOpen(false)}
                    onCancel={() => setConfirmOpen(false)}
                    onConfirm={handlePayout}
                >
                    {preview && (
                        <div className="flex flex-col gap-3">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                You are about to settle{' '}
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                    {preview.itemCount}{' '}
                                    {preview.itemCount === 1 ? 'row' : 'rows'}
                                </span>{' '}
                                for{' '}
                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                    {selectedRestaurantName}
                                </span>
                                .
                            </p>
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm dark:border-gray-700 dark:bg-gray-800/60">
                                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                    <span>Period</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {dayjs(preview.fromDate).format(
                                            'DD/MM/YYYY',
                                        )}{' '}
                                        ~{' '}
                                        {dayjs(preview.toDate).format(
                                            'DD/MM/YYYY',
                                        )}
                                    </span>
                                </div>
                                <div className="mt-1 flex justify-between text-gray-600 dark:text-gray-300">
                                    <span>Batch</span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {preview.code}
                                    </span>
                                </div>
                            </div>

                            {/* The split, not the blended figure: the two
                                scopes are charged at different rates. */}
                            <div className="space-y-1.5 rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-700">
                                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                    <span>
                                        Order commission (
                                        {preview.breakdown.orderCount})
                                    </span>
                                    <span className="font-medium text-amber-600 dark:text-amber-400">
                                        MMK{' '}
                                        {Number(
                                            preview.breakdown.orderCommission,
                                        ).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                    <span>
                                        Reservation commission (
                                        {preview.breakdown.reservationCount})
                                    </span>
                                    <span className="font-medium text-amber-600 dark:text-amber-400">
                                        MMK{' '}
                                        {Number(
                                            preview.breakdown
                                                .reservationCommission,
                                        ).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between border-t border-gray-200 pt-1.5 text-gray-600 dark:border-gray-300 dark:border-gray-700">
                                    <span>Net amount payable</span>
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                                        MMK{' '}
                                        {Number(
                                            preview.totals.netAmount,
                                        ).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {preview.alreadySettled > 0 && (
                                <p className="text-xs text-amber-600 dark:text-amber-400">
                                    {preview.alreadySettled} already-settled{' '}
                                    {preview.alreadySettled === 1
                                        ? 'row is'
                                        : 'rows are'}{' '}
                                    excluded from this payout.
                                </p>
                            )}

                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                This settles the listed rows and cannot be
                                undone.
                            </p>
                        </div>
                    )}
                </ConfirmDialog>
            </AdaptiveCard>
        </Container>
    )
}

export default AdminSettlement
