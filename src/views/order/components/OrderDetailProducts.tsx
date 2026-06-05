// components/OrderDetailProducts.tsx
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import { NumericFormat } from 'react-number-format'
import { FiPackage } from 'react-icons/fi'

import { TbToolsKitchen } from 'react-icons/tb'
import { OrderItem } from '@/@types/order'

interface OrderDetailProductsProps {
    items: OrderItem[]
}
const OrderDetailProducts = ({ items }: OrderDetailProductsProps) => {
    return (
        <Card>
            <h4 className="mb-4">Dishes Ordered</h4>
            <div className="flex flex-col gap-4">
                {items.map((item, idx) => {
                    const dish = item.dish
                    if (!dish) return null // Safety fallback if dish wa

                    return (
                        <div
                            key={idx}
                            className="rounded-xl bg-gray-50 dark:bg-gray-700 p-4"
                        >
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <Avatar
                                        shape="round"
                                        size={50}
                                        src={dish.coverImage.url}
                                        icon={<TbToolsKitchen />}
                                    />
                                    <div>
                                        <div className="heading-text font-bold">
                                            {dish.name}
                                        </div>
                                        {item.note && (
                                            <div className="text-xs text-gray-500">
                                                Note: {item.note}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="heading-text font-bold">
                                        <NumericFormat
                                            thousandSeparator
                                            displayType="text"
                                            value={item.unitPrice}
                                            prefix="MMK "
                                        />
                                    </div>
                                    <div>Qty: {item.quantity}</div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </Card>
    )
}

export default OrderDetailProducts
