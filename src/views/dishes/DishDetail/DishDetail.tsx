import { useParams, useNavigate } from 'react-router'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import {
    TbEdit,
    TbArrowNarrowLeft,
    TbTag,
    TbCurrencyDollar,
    TbClock,
    // TbFlame,
} from 'react-icons/tb'

import { useGetDish } from '@/utils/custom-hooks/useDish'
import DishStatusBadge from '../components/DishStatusBadge'
import { useRestaurantStore } from '@/store/restaurantStore'
import { useState } from 'react'
import { LightboxModal } from '../components/LightboxModal'

const DishDetail = () => {
    const { dishId } = useParams()
    const navigate = useNavigate()

    const [isLightboxOpen, setIsLightboxOpen] = useState(false)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const { activeRestaurant } = useRestaurantStore()

    const { data: dish, isLoading } = useGetDish(dishId!)

    const detailImages = dish?.data.detailImages || []

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index)
        setIsLightboxOpen(true)
    }

    if (isLoading) return <div className="p-8 text-center">Loading...</div>
    if (!dish) return <div className="p-8 text-center">Dish not found</div>

    return (
        <Container>
            <div className="py-4 sm:py-6">
                <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                        variant="plain"
                        icon={<TbArrowNarrowLeft />}
                        onClick={() =>
                            navigate(
                                `/restaurants/${activeRestaurant?.id}/dishes`,
                            )
                        }
                    >
                        Back to Menu
                    </Button>
                    <Button
                        variant="solid"
                        icon={<TbEdit />}
                        onClick={() => navigate(`/dishes/edit/${dish.data.id}`)}
                    >
                        Edit Dish
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-bold sm:text-2xl">
                                    {dish.data.name}
                                </h3>
                                <DishStatusBadge
                                    available={dish.data.availableForOrder}
                                />
                            </div>
                            {dish.data.description && (
                                <p className="mt-4 text-gray-700 dark:text-gray-300">
                                    {dish.data.description}
                                </p>
                            )}
                        </Card>
                        <Card>
                            <h4 className="mb-4">Details</h4>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div className="flex items-center gap-2">
                                    <TbCurrencyDollar className="text-gray-500" />
                                    <span>
                                        Price:{' '}
                                        {dish.data.price.toLocaleString()} MMK
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TbTag className="text-gray-500" />
                                    <span>
                                        Category: {dish.data.cuisine.name}
                                    </span>
                                </div>
                                {/* I think preparation time is needed */}
                                {dish.data.preparationTime && (
                                    <div className="flex items-center gap-2">
                                        <TbClock className="text-gray-500" />
                                        <span>
                                            Prep time:{' '}
                                            {dish.data.preparationTime} min
                                        </span>
                                    </div>
                                )}
                                {/* {dish.spicyLevel && (
                                        <div className="flex items-center gap-2">
                                            <TbFlame className="text-gray-500" />
                                            <span>
                                                Spicy level:{' '}
                                                {dish.spicyLevel === 1
                                                    ? 'Mild'
                                                    : dish.spicyLevel === 2
                                                      ? 'Medium'
                                                      : 'Hot'}
                                            </span>
                                        </div>
                                    )} */}
                            </div>
                        </Card>
                    </div>
                    <div className="space-y-6">
                        <Card>
                            <h4 className="mb-4">Dish Image</h4>
                            {dish.data.coverImage ? (
                                <img
                                    src={dish.data.coverImage.url}
                                    alt={dish.data.coverImage.key}
                                    className="max-h-72 w-full rounded-xl object-cover sm:max-h-96"
                                />
                            ) : (
                                <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                    No image
                                </div>
                            )}
                        </Card>

                        <Card>
                            <h4 className="mb-4">Detail Images</h4>
                            {detailImages.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                    {detailImages
                                        .slice(0, 6)
                                        .map((img, index) => {
                                            const isLastSlot = index === 5
                                            const hasMoreImages =
                                                detailImages.length > 6
                                            const extraCount =
                                                detailImages.length - 5

                                            return (
                                                <div
                                                    key={img.key || index}
                                                    className="relative aspect-square rounded-md overflow-hidden bg-gray-100 group cursor-pointer"
                                                    onClick={() =>
                                                        openLightbox(index)
                                                    }
                                                >
                                                    <img
                                                        src={img.url}
                                                        alt={
                                                            img.key ||
                                                            `Detail ${index + 1}`
                                                        }
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                    />

                                                    {isLastSlot &&
                                                        hasMoreImages && (
                                                            <div className="absolute inset-0 bg-black/60 hover:bg-black/50 transition-colors flex items-center justify-center text-white text-xl font-semibold w-full h-full">
                                                                +{extraCount}{' '}
                                                                more
                                                            </div>
                                                        )}
                                                </div>
                                            )
                                        })}
                                </div>
                            ) : (
                                <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                    No detail images
                                </div>
                            )}
                        </Card>
                        {/* Lightbox Modal Component */}
                        {isLightboxOpen && (
                            <LightboxModal
                                images={detailImages}
                                currentIndex={currentImageIndex}
                                setCurrentIndex={setCurrentImageIndex}
                                onClose={() => setIsLightboxOpen(false)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default DishDetail
