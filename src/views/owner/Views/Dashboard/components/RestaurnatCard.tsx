import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { TbEye, TbEdit, TbTrash, TbMapPin } from 'react-icons/tb'
// import { useRestaurantStore } from '../../../store/restaurantStore'

import { useNavigate } from 'react-router'

import { useRestaurantStore } from '@/store/restaurantStore'
import { Restaurant } from '@/@types/restaurant'

interface RestaurantCardProps {
    restaurant: Restaurant
}

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
    const navigate = useNavigate()
    // const { deleteRestaurant } = useRestaurantStore()
    const { openProfileDialog } = useRestaurantStore()
    // const openDialog = useDialogStore((state) => state.openDialog)

    // console.log('Restaurant in card: ', restaurant)

    const handleViewDetails = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (restaurant.profile !== null) {
            return navigate(`/restaurants/${restaurant.id}/eda-dashboard`)
        } else {
            openProfileDialog('CREATE_PROFILE', {
                id: restaurant.id,
                name: restaurant.name,
            })
        }
    }

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation()
        // openDialog('EDIT_RESTAURANT', restaurant)
        console.log('Editing restaurant:', restaurant)
        return navigate(`/restaurant/update-restaurant/${restaurant.id}`)
    }

    const handleDelete = async () => {
        /**
         * ====================================
         * Ask this with a standard dialog box
         * ====================================
         */

        openProfileDialog('DELETE_CONFIRM', {
            id: restaurant.id,
            name: restaurant.name,
        })
        // TODO: add soft delete
    }

    const mainImage = restaurant.images[0] || '/placeholder-image.jpg'

    const priceRange = `${restaurant.startingPrice.toLocaleString()} - ${restaurant.endingPrice.toLocaleString()} MMK`

    return (
        <Card
            className="hover:shadow-lg hover:ring-1 hover:ring-gold transition-all duration-200 w-full cursor-pointer"
            bodyClass="p-0"
            // onClick={handleViewDetails}
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img
                    src={mainImage.url}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                />
                {/* Price badge */}
                <div className="absolute bottom-2 right-2 bg-gold text-primary-deep px-2 py-1 rounded text-sm font-semibold">
                    {priceRange}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h4 className="font-serif font-semibold text-lg mb-2 text-primary">
                    {restaurant.name}
                </h4>

                {/* Address */}
                <div className="flex items-start gap-2 text-gray-600 mb-3">
                    <TbMapPin className="mt-0.5 shrink-0" />
                    <span className="text-sm">{restaurant.address}</span>
                </div>

                {/* Owner info */}
                <div className="text-sm text-gray-500 mb-4">
                    Owner: {restaurant.owner.name}
                </div>

                {/* Action buttons */}
                <div className="flex gap-2  overflow-scroll">
                    <Button
                        variant="solid"
                        size="sm"
                        icon={<TbEye />}
                        onClick={handleViewDetails}
                    >
                        View
                    </Button>
                    <Button
                        size="sm"
                        icon={<TbEdit />}
                        // variant="plain"
                        className=" hover:ring-0"
                        onClick={handleEdit}
                    >
                        Edit
                    </Button>
                    <Button
                        size="sm"
                        icon={<TbTrash />}
                        variant="plain"
                        className="text-red-500 hover:text-red-600 border"
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </Card>
    )
}

export default RestaurantCard
