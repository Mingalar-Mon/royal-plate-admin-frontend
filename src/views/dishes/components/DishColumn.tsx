import { Dish } from '@/@types/dish'
import { Cuisine } from '@/@types/restaurant'
import Avatar from '@/components/ui/Avatar'
import { FiPackage } from 'react-icons/fi'
// import type { Dish } from '../types/dish.type'

const DishColumn = ({ row }: { row: Dish & { cuisine: Cuisine } }) => {
    // console.log('Row: ', row)
    return (
        <div className="flex items-center gap-2">
            <Avatar
                shape="round"
                size={50}
                {...(row.coverImage
                    ? { src: row.coverImage.url }
                    : { icon: <FiPackage /> })}
                className="image-contain"
            />
            <div>
                <div className="font-bold heading-text mb-1">{row.name}</div>
                <div className="text-xs text-gray-500">{row.cuisine.name}</div>
            </div>
        </div>
    )
}

export default DishColumn
