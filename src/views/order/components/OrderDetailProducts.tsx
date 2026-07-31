import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { NumericFormat } from 'react-number-format'
import { TbToolsKitchen } from 'react-icons/tb'
import { OrderItem } from '@/@types/order'

interface OrderDetailProductsProps {
    items: OrderItem[]
}

const OrderDetailProducts = ({ items }: OrderDetailProductsProps) => {
    const safeItems = items ?? []
    const totalQty = safeItems.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0,
    )

    return (
        <Card>
            <div className="flex items-center justify-between gap-3 mb-4">
                <h4 className="mb-0">Dishes Ordered</h4>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {safeItems.length} item{safeItems.length === 1 ? '' : 's'}
                    {totalQty > 0 ? ` · ${totalQty} qty` : ''}
                </span>
            </div>

            {safeItems.length === 0 ? (
                <div className="rounded-xl bg-gray-50 dark:bg-gray-700/50 px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No dishes found on this order.
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {safeItems.map((item) => {
                        const dish = item.dish
                        const lineTotal =
                            Number(item.quantity || 0) *
                            Number(item.unitPrice || 0)
                        const imageUrl = dish?.coverImage?.url

                        return (
                            <div
                                key={item.id}
                                className="rounded-xl bg-gray-50 dark:bg-gray-700/50 p-4"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3 min-w-0">
                                        <Avatar
                                            shape="round"
                                            size={50}
                                            src={imageUrl}
                                            icon={<TbToolsKitchen />}
                                        />
                                        <div className="min-w-0">
                                            <div className="heading-text font-bold truncate">
                                                {dish?.name || 'Unknown dish'}
                                            </div>
                                            {item.note && (
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    Note: {item.note}
                                                </div>
                                            )}
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                Qty {item.quantity} ×{' '}
                                                <NumericFormat
                                                    thousandSeparator
                                                    displayType="text"
                                                    value={item.unitPrice}
                                                    prefix="MMK "
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="heading-text font-bold">
                                            <NumericFormat
                                                thousandSeparator
                                                displayType="text"
                                                value={lineTotal}
                                                prefix="MMK "
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </Card>
    )
}

export default OrderDetailProducts
