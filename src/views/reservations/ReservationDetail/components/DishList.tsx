import { Dish } from '@/@types/dish'
import Card from '@/components/ui/Card'
import { ReservationItem } from '@/services/ReservationService'
import { NumericFormat } from 'react-number-format'

const DishesList = ({
    reservationItems,
}: {
    reservationItems?: ReservationItem[]
}) => {
    if (!reservationItems || reservationItems.length === 0) return null

    // const {dish} = reservationItem;

    return (
        <Card>
            <h4 className="mb-4">Dishes Ordered</h4>
            <div className="space-y-2">
                {reservationItems.map((item) => (
                    <div
                        key={item.id}
                        className="flex justify-between items-center py-2 border-b last:border-0"
                    >
                        <span>{item.dish.name}</span>
                        {item.dish.price && (
                            <NumericFormat
                                displayType="text"
                                value={item.dish.price}
                                prefix="MMK "
                                thousandSeparator
                            />
                        )}
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default DishesList
