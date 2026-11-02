import {
    TbBuildingStore,
    TbShoppingBag,
    TbCalendarCheck,
    TbCoin,
    TbPercentage,
} from 'react-icons/tb'
import type { OwnerOverviewRestaurant } from '@/@types/dashboard'

const formatNumber = (value: number | null | undefined) => {
    const n = Number(value ?? 0)
    return Number.isFinite(n) ? n.toLocaleString() : '0'
}

const formatCurrency = (value: number | null | undefined) =>
    `${formatNumber(value)} MMK`

type Props = {
    restaurants: OwnerOverviewRestaurant[]
}

const RestaurantBreakdown = ({ restaurants }: Props) => {
    if (!restaurants || restaurants.length === 0) {
        return (
            <div className="flex items-center justify-center py-6 text-sm text-gray-500 dark:text-gray-400">
                No restaurants found for this owner
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <TbBuildingStore className="text-lg text-primary" />
                <h5 className="font-semibold text-gray-900 dark:text-gray-100">
                    Restaurant Breakdown ({restaurants.length})
                </h5>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {restaurants.map((restaurant) => (
                    <div
                        key={restaurant.restaurantId}
                        className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50"
                    >
                        <div className="mb-3 flex items-start justify-between">
                            <h6 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                                {restaurant.restaurantName}
                            </h6>
                            <div className="ml-2 shrink-0 rounded-lg bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                                {formatCurrency(restaurant.totalPrice)}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 dark:bg-blue-900/20">
                                <TbShoppingBag className="text-blue-500" />
                                <div>
                                    <p className="text-[10px] uppercase text-blue-600 dark:text-blue-400">
                                        Orders
                                    </p>
                                    <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
                                        {formatNumber(restaurant.orderCount)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 dark:bg-amber-900/20">
                                <TbCalendarCheck className="text-amber-500" />
                                <div>
                                    <p className="text-[10px] uppercase text-amber-600 dark:text-amber-400">
                                        Reservations
                                    </p>
                                    <p className="text-sm font-bold text-amber-700 dark:text-amber-300">
                                        {formatNumber(restaurant.reservationCount)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-3 space-y-2 border-t border-gray-100 pt-3 dark:border-gray-700">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500 dark:text-gray-400">
                                    Subtotal
                                </span>
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {formatCurrency(restaurant.subTotal)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                    <TbPercentage className="text-orange-500" />
                                    Commission
                                </span>
                                <span className="font-medium text-orange-600 dark:text-orange-400">
                                    {formatCurrency(restaurant.commission_fee)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1 font-semibold text-gray-700 dark:text-gray-200">
                                    <TbCoin className="text-emerald-500" />
                                    Net Amount
                                </span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                    {formatCurrency(restaurant.netAmount)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RestaurantBreakdown
