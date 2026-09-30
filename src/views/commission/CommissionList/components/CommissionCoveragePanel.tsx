import { useMemo, useState } from 'react'
import classNames from 'classnames'
import { TbAlertTriangle, TbChevronDown, TbChevronRight } from 'react-icons/tb'
import { useGetRestaurantList } from '@/utils/custom-hooks/useRestaurant'
import { useActiveCommissionRestaurantIds } from '@/utils/custom-hooks/useCommission'

interface CommissionCoveragePanelProps {
    /** Pre-selects this restaurant when configuring a gap from the panel. */
    onConfigure: (restaurantId: string) => void
}

/**
 * A restaurant with no active batch still trades — it just pays 0%
 * commission. That is easy to miss, so the gap is surfaced rather than left
 * for someone to notice in the transaction ledger.
 */
const CommissionCoveragePanel = ({
    onConfigure,
}: CommissionCoveragePanelProps) => {
    const [expanded, setExpanded] = useState(false)

    const { data: restaurantsResponse, isLoading: restaurantsLoading } =
        useGetRestaurantList()
    const { data: activeRestaurantIds, isLoading: activeLoading } =
        useActiveCommissionRestaurantIds()

    const uncoveredRestaurants = useMemo(() => {
        const active = new Set(activeRestaurantIds)
        return (restaurantsResponse?.data || []).filter(
            (restaurant) => !active.has(restaurant.id),
        )
    }, [restaurantsResponse, activeRestaurantIds])

    if (restaurantsLoading || activeLoading) return null

    // Every restaurant is covered — stay quiet rather than adding noise.
    if (uncoveredRestaurants.length === 0) return null

    return (
        <div className="rounded-lg border border-amber-300/60 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10">
            <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                onClick={() => setExpanded((prev) => !prev)}
            >
                <span className="flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-300">
                    <TbAlertTriangle className="text-lg" />
                    {uncoveredRestaurants.length}{' '}
                    {uncoveredRestaurants.length === 1
                        ? 'restaurant has'
                        : 'restaurants have'}{' '}
                    no active commission batch
                </span>
                {expanded ? (
                    <TbChevronDown className="text-amber-700 dark:text-amber-400" />
                ) : (
                    <TbChevronRight className="text-amber-700 dark:text-amber-400" />
                )}
            </button>

            {expanded && (
                <div className="border-t border-amber-300/60 px-4 py-3 dark:border-amber-500/30">
                    <p className="mb-3 text-xs text-amber-800/80 dark:text-amber-300/80">
                        These restaurants are trading at 0% commission. Orders
                        and reservations still succeed — they just carry no
                        platform fee.
                    </p>
                    <ul className="space-y-1.5">
                        {uncoveredRestaurants.map((restaurant) => (
                            <li
                                key={restaurant.id}
                                className="flex items-center justify-between gap-3 text-sm"
                            >
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {restaurant.name}
                                </span>
                                <button
                                    type="button"
                                    className={classNames(
                                        'whitespace-nowrap font-semibold underline-offset-2 hover:underline',
                                        'text-amber-700 dark:text-amber-400',
                                    )}
                                    onClick={() => onConfigure(restaurant.id)}
                                >
                                    Configure
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default CommissionCoveragePanel
