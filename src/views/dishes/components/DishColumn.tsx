import { Dish } from '@/@types/dish'
import { Cuisine } from '@/@types/restaurant'
import Avatar from '@/components/ui/Avatar'
import { FiPackage } from 'react-icons/fi'
// import type { Dish } from '../types/dish.type'

const DishColumn = ({ row }: { row: Dish & { cuisine: Cuisine } }) => {
    return (
        <div className="flex min-w-44 items-center gap-3">
            <Avatar
                shape="round"
                size={48}
                {...(row.coverImage
                    ? { src: row.coverImage.url }
                    : { icon: <FiPackage /> })}
                className="image-contain"
            />
            <div className="min-w-0">
                <div className="truncate font-semibold heading-text">{row.name}</div>
                <div className="mt-1 truncate text-xs text-content-muted">{row.cuisine.name}</div>
            </div>
        </div>
    )
}

export default DishColumn
