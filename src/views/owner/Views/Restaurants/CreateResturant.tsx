import { useState } from 'react'
import { useNavigate } from 'react-router'
import Button from '@/components/ui/Button'
// import Notification from '@/components/ui/Notification'
// import toast from '@/components/ui/toast'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import RestaurantForm from './components/RestaurantForm'
import type { RestaurantFormSchema } from './types/restaurantForm.types'
import PostLoginLayout from '@/components/layouts/PostLoginLayout'
import { useThemeStore } from '@/store/themeStore'
import { useCreateRestaurant } from '../../hooks/useRestaurant'

const CreateRestaurant = () => {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const layoutType = useThemeStore((state) => state.layout.type)
    const createMutation = useCreateRestaurant()

    const defaultValues: Partial<RestaurantFormSchema> = {
        name: '',
        address: '',
        startingPrice: 0,
        endingPrice: 0,
        latitude: 16.878639794964585,
        longitude: 96.19036674499512,
        imageUrls: [],
        staffIds: [],
    }

    const handleFormSubmit = async (formData: RestaurantFormSchema) => {
        setIsSubmitting(true)
        try {
            createMutation.mutate(formData)
            // console.log('Success:', response)
            alert('Restaurant created successfully!') // Temporary alert
            // navigate('/owner/dashboard')
        } catch (error) {
            console.error('Error:', error)
            alert('Failed to create restaurant. Check console for details.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleBack = () => navigate('/owner/dashboard')

    return (
        <PostLoginLayout layoutType={layoutType}>
            <RestaurantForm
                defaultValues={defaultValues as RestaurantFormSchema}
                isNew={true}
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
                <Button type="submit" variant="solid" loading={isSubmitting}>
                    Create Restaurant
                </Button>
            </RestaurantForm>
        </PostLoginLayout>
    )
}

export default CreateRestaurant
