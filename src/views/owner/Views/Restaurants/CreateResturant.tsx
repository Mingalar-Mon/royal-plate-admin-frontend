import { useNavigate } from 'react-router'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import RestaurantForm from './components/RestaurantForm'
import type { RestaurantFormSchema } from './types/restaurantForm.types'

import { useCreateRestaurant } from '@/utils/custom-hooks/useRestaurant'
import { toast } from '@/components/ui'
import { RestaurantFormInput } from '@/@types/restaurant.type'
// import { useCreateRestaurant } from '../../hooks/useRestaurant'

const CreateRestaurant = () => {
    const navigate = useNavigate()

    // const createMutation = useCreateRestaurant()

    const { mutate: createRestaurant, isPending: isCreating } =
        useCreateRestaurant()

    const defaultValues: Partial<RestaurantFormSchema> = {
        name: '',
        address: '',
        startingPrice: 0,
        endingPrice: 0,
        latitude: 16.878639794964585,
        longitude: 96.19036674499512,
        images: [],
        // staffIds: [],
    }

    const handleFormSubmit = async (formData: RestaurantFormSchema) => {
        console.log('Form Data for creation: ', formData)
        try {
            // 1. create a FormData instance
            const body = new FormData()
            // 2. Append simple fields
            body.append('name', formData.name)
            body.append('address', formData.address)
            body.append('startingPrice', String(formData.startingPrice))
            body.append('endingPrice', String(formData.endingPrice))
            body.append('latitude', String(formData.latitude))
            body.append('longitude', String(formData.longitude))
            body.append('tax', String(formData.tax))

            // 3. handle images
            formData.images.forEach((img) => {
                if (img instanceof File) body.append('images', img)
            })
            if (formData.logoImage && formData.logoImage instanceof File) {
                body.append('logo', formData.logoImage)
            }

            // 4.send to mutation
            createRestaurant(body, {
                onSuccess: (response) => {
                    navigate(
                        `/restaurant/create-restaurant-profile/${response.data[0].id}`,
                    )
                },
                onError: (error) => {
                    console.error('Error:', error)
                    alert(
                        'Failed to create restaurant. Check console for details.',
                    )
                },
            }) // go to create profile page instead of dashboard
        } catch (error: any) {
            toast.push(
                <Notification type="danger">
                    Error creating restaurant{error.message}
                </Notification>,
            )
        }
        // console.log('Submitting with these data: ', formData)
        // const { staffIds, ...cleanedData } = formData
        // createRestaurant(cleanedData, {
        //     onSuccess: () => {
        //         toast.push(toastNotification)

        //         navigate('/owner/dashboard')
        //     },
        //     onError: (error) => {
        //         console.error('Error:', error)
        //         alert('Failed to create restaurant. Check console for details.')
        //     },
        // })
    }

    const handleBack = () => navigate('/owner/dashboard')

    return (
        <RestaurantForm
            defaultValues={defaultValues as RestaurantFormInput}
            isNew={true}
            disabled={isCreating}
            onFormSubmit={handleFormSubmit}
        >
            <Button
                type="button"
                variant="plain"
                icon={<TbArrowNarrowLeft />}
                onClick={handleBack}
            >
                Back to Dashboard
            </Button>
            <Button type="submit" variant="solid" loading={isCreating}>
                Create Restaurant
            </Button>
        </RestaurantForm>
    )
}

export default CreateRestaurant
