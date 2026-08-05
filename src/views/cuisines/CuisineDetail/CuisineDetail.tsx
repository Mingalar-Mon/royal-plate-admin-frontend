import { useParams, useNavigate } from 'react-router'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import {
    TbEdit,
    TbArrowNarrowLeft,
    TbCalendar,
    TbInfoCircle,
} from 'react-icons/tb'

import { useCuisineDetailQuery } from '@/utils/custom-hooks/useCuisine'
import dayjs from 'dayjs'

const CuisineDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: cuisineResponse, isLoading } = useCuisineDetailQuery(id!)

    if (isLoading) return <div className="p-8 text-center">Loading...</div>
    if (!cuisineResponse)
        return <div className="p-8 text-center">Cuisine not found</div>

    console.log('Cuisine: ', cuisineResponse)

    const cuisine = cuisineResponse.data

    return (
        <Container>
            <div className="py-6">
                <div className="flex  items-center justify-between mb-6">
                    <Button
                        variant="plain"
                        icon={<TbArrowNarrowLeft />}
                        onClick={() => navigate('/cuisines')}
                    >
                        Back to Cuisines
                    </Button>
                    <Button
                        variant="solid"
                        icon={<TbEdit />}
                        onClick={() => navigate(`/cuisines/edit/${cuisine.id}`)}
                    >
                        Edit Cuisine
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-3 space-y-6">
                        {' '}
                        {/*lg:col-span-2 */}
                        <Card>
                            <h1 className="text-3xl font-bold mb-2">
                                {cuisine.name}
                            </h1>
                            {cuisine.description && (
                                <p className="text-gray-700 dark:text-gray-300 mt-4">
                                    {cuisine.description}
                                </p>
                            )}
                        </Card>
                    </div>
                    <div className="space-y-6 lg:col-span-3 ">
                        <Card>
                            <h4 className="mb-4">Details</h4>
                            <div className="space-y-3">
                                {cuisine.image && (
                                    <div>
                                        <img
                                            src={cuisine.image.url}
                                            alt={cuisine.name}
                                            className="w-full object-contain rounded-lg"
                                        />
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <TbCalendar className="text-gray-500" />
                                    <span>
                                        Created:{' '}
                                        {dayjs(cuisine.created_at).format(
                                            'DD MMM YYYY',
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <TbInfoCircle className="text-gray-500" />
                                    <span>
                                        Last updated:{' '}
                                        {dayjs(cuisine.updated_at).format(
                                            'DD MMM YYYY',
                                        )}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default CuisineDetail
