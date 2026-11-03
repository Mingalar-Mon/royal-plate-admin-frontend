import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { TbToolsKitchen } from 'react-icons/tb'
import { ReservationItem } from '@/services/ReservationService'

const formatNumber = (value: number | string | null | undefined) => {
    const numericValue = Number(value ?? 0)
    return Number.isFinite(numericValue) ? Math.trunc(numericValue).toLocaleString() : '0'
}

const formatCurrency = (value: number | string | null | undefined) =>
    `${formatNumber(value)} MMK`

const DishesList = ({
    reservationItems,
}: {
    reservationItems?: ReservationItem[]
}) => {
    if (!reservationItems || reservationItems.length === 0) return null

    const totalItems = reservationItems.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0,
    )

    return (
        <Card
            header={{
                content: (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <TbToolsKitchen className="text-lg text-primary" />
                            <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">
                                Ordered Dishes
                            </h4>
                        </div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                            {reservationItems.length} item{reservationItems.length === 1 ? '' : 's'} · {totalItems} qty
                        </span>
                    </div>
                ),
                bordered: false,
                className: 'px-5 py-4',
            }}
            bodyClass="p-5"
        >
            <div className="space-y-3">
                {reservationItems.map((item, index) => {
                    const dish = item.dish
                    const lineTotal =
                        Number(item.quantity || 0) * Number(item.unitPrice || 0)
                    const imageUrl = dish.coverImageUrl

                    return (
                        <div
                            key={item.id}
                            className={`flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                                index !== reservationItems.length - 1 ? '' : ''
                            }`}
                        >
                            <Avatar
                                shape="square"
                                size={56}
                                src={imageUrl}
                                icon={<TbToolsKitchen />}
                                className="shrink-0 rounded-xl"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                    {dish.name || 'Unknown dish'}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                    Qty {item.quantity} × {formatCurrency(item.unitPrice)}
                                </p>
                            </div>
                            <div className="shrink-0 text-right">
                                <p className="text-base font-bold text-primary dark:text-gold">
                                    {formatCurrency(lineTotal)}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}

export default DishesList
