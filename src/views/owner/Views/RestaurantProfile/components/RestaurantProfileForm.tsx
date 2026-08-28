import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'

import Checkbox from '@/components/ui/Checkbox'
import { TbArrowNarrowLeft } from 'react-icons/tb'

import CuisineSection from './CuisineSection'
import PaymentMethodsSection from './PaymentMethodsSection'
import {
    restaurantProfileValidationSchema,
    type RestaurantProfileFormSchema,
} from '../types/restaurantProfile.type'
import { useRestaurantStore } from '@/store/restaurantStore'

import {
    useGetRestaurantProfile,
    useCreateRestaurantProfile,
    useUpdateRestaurantProfile,
} from '@/utils/custom-hooks/useRestaurantProfile'

import { useGetCuisines } from '@/utils/custom-hooks/useCuisine'
import { useGetPaymentMethods } from '@/utils/custom-hooks/usePayment'
import { useCuisineStore } from '@/store/cuisineStore'

interface RestaurantProfileFormProps {
    isEditMode: boolean
}

const RestaurantProfileForm = ({ isEditMode }: RestaurantProfileFormProps) => {
    const { restaurantId: urlRestaurantId, profileId } = useParams()
    const navigate = useNavigate()
    const { activeRestaurant } = useRestaurantStore()
    // Use URL parameter if available, otherwise fall back to globally selected restaurant
    const restaurantId = urlRestaurantId || (activeRestaurant?.id || '')
    // console.log(restaurantId, profileId)
    const { tableData } = useCuisineStore()

    // Fetch existing profile if in edit mode

    // This API endpoint fetches the profile by restaurant ID
    const { data: existingProfile, isLoading: isLoadingProfile } =
        useGetRestaurantProfile(isEditMode ? restaurantId : '')

    // Fetch cuisines and payment methods (use mock or real API)
    const { data: cuisines, isLoading: isLoadingCuisines } =
        useGetCuisines(tableData)

    const { data: paymentMethods, isLoading: isLoadingPaymentMethods } =
        useGetPaymentMethods()

    // console.log('Payment methods: ', paymentMethods)

    // const createMutation = useCreateRestaurantProfile()
    const { mutate: updateRestaurantProfile } = useUpdateRestaurantProfile()
    const { mutate: createRestaurantProfile } = useCreateRestaurantProfile()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        watch,
    } = useForm<RestaurantProfileFormSchema>({
        resolver: zodResolver(restaurantProfileValidationSchema),
        defaultValues: {
            description: '',

            openingHour: 540,
            closingHour: 1200,
            contactNumber: '',
            websiteUrl: '',
            parking: false,
            dressCode: '',
            accessibility: '',

            cuisineIds: [],
            paymentMethodIds: [],
        },
    })

    const openingHour = watch('openingHour')
    const closingHour = watch('closingHour')

    // Populate form with existing data
    useEffect(() => {
        const profile = existingProfile?.data
        if (!profile || !isEditMode) return

        reset({
            description: profile.description ?? '',
            openingHour: profile.openingHour ?? 540,
            closingHour: profile.closingHour ?? 1200,
            contactNumber: profile.contactNumber ?? '',
            websiteUrl: profile.websiteUrl ?? '',
            parking: !!profile.parking,
            dressCode: profile.dressCode ?? '',
            accessibility: profile.accessibility ?? '',
            cuisineIds: (profile.cuisines ?? []).map((c) => c.id),
            paymentMethodIds: (profile.paymentMethods ?? []).map((p) => p.id),
        })
    }, [existingProfile, isEditMode, reset])

    const onSubmit = async (data: RestaurantProfileFormSchema) => {
        // console.log('Edit mode: ', isEditMode)
        // console.log('Data to be updated: ', data)
        try {
            if (isEditMode) {
                updateRestaurantProfile(
                    { profileId: profileId as string, data },
                    {
                        onSuccess: () => {
                            // The profile view page fetches by restaurant ID
                            navigate(
                                `/restaurant/restaurant-profile/${restaurantId}`,
                            )
                        },
                    },
                )
            } else {
                createRestaurantProfile(
                    { restaurantId: restaurantId as string, data },
                    {
                        onSuccess: () =>
                            navigate(
                                `/restaurants/${restaurantId}/eda-dashboard`,
                            ),
                    },
                )
            }
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    if (isLoadingProfile || isLoadingCuisines || isLoadingPaymentMethods) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary border-t-transparent mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">Loading profile...</p>
            </div>
        )
    }

    // Helper to generate 30-min intervals (0 to 1410 minutes)
    // const timeOptions = Array.from({ length: 48 }, (_, i) => {
    //     const totalMinutes = i * 30
    //     const hours = Math.floor(totalMinutes / 60)
    //     const minutes = totalMinutes % 60
    //     const ampm = hours >= 12 ? 'PM' : 'AM'
    //     const displayHours = hours % 12 || 12
    //     const displayMinutes = minutes.toString().padStart(2, '0')

    //     return {
    //         label: `${displayHours}:${displayMinutes} ${ampm}`,
    //         value: totalMinutes,
    //     }
    // })

    const timeToMinutes = (timeString: string) => {
        if (!timeString) return 0
        const [hrs, mins] = timeString.split(':').map(Number)
        return hrs * 60 + mins
    }

    const minutesToTime = (totalMinutes: number) => {
        const hrs = Math.floor(totalMinutes / 60)
            .toString()
            .padStart(2, '0')
        const mins = (totalMinutes % 60).toString().padStart(2, '0')
        return `${hrs}:${mins}`
    }

    // const minutesToDate = (totalMinutes) => {
    //     const date = new Date()
    //     date.setHours(Math.floor(totalMinutes / 60), totalMinutes % 60, 0, 0)
    //     return date
    // }

    // const dateToMinutes = (date) => {
    //     if (!(date instanceof Date)) return 0
    //     return date.getHours() * 60 + date.getMinutes()
    // }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Container>
                <div className="py-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <Button
                            type="button"
                            variant="plain"
                            icon={<TbArrowNarrowLeft />}
                            onClick={() => {
                                if (profileId) {
                                    navigate(`/restaurant/restaurant-profile/${restaurantId}`)
                                }
                            }}
                        >
                            Back to Restaurant
                        </Button>
                        <Button
                            type="submit"
                            variant="solid"
                            loading={isSubmitting}
                        >
                            {isEditMode ? 'Update Profile' : 'Create Profile'}
                        </Button>
                    </div>

                    {/* Form Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Description */}
                            <Card>
                                <h4 className="mb-4">Description</h4>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem
                                            label="Restaurant Description"
                                            invalid={!!errors.description}
                                            errorMessage={
                                                errors.description?.message
                                            }
                                        >
                                            <Input
                                                textArea
                                                {...field}
                                                rows={6}
                                                placeholder="Describe your restaurant, its atmosphere, specialties, and what makes it unique..."
                                            />
                                        </FormItem>
                                    )}
                                />
                            </Card>

                            {/* Operating Hours */}
                            <Card>
                                <h4 className="mb-4">Operating Hours</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <Controller
                                        name="openingHour"
                                        control={control}
                                        render={({ field }) => (
                                            <FormItem
                                                label="Opening Time"
                                                invalid={!!errors.openingHour}
                                                errorMessage={
                                                    errors.openingHour?.message
                                                }
                                            >
                                                <input
                                                    type="time"
                                                    {...field}
                                                    value={minutesToTime(
                                                        field.value,
                                                    )}
                                                    className={`
                                                        w-full h-11 px-4 bg-white dark:bg-gray-900 
                                                        border rounded-lg transition-all duration-200
                                                        text-gray-700 dark:text-gray-200
                                                        focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                                                        ${errors.closingHour ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                                                        `}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            timeToMinutes(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                />
                                                {/* <select
                                                    {...field}
                                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    {Array.from(
                                                        { length: 24 },
                                                        (_, i) => (
                                                            <option
                                                                key={i}
                                                                value={i}
                                                            >
                                                                {i === 0
                                                                    ? '12:00 AM'
                                                                    : i < 12
                                                                      ? `${i}:00 AM`
                                                                      : i === 12
                                                                        ? '12:00 PM'
                                                                        : `${i - 12}:00 PM`}
                                                            </option>
                                                        ),
                                                    )}
                                                </select> */}
                                            </FormItem>
                                        )}
                                    />
                                    <Controller
                                        name="closingHour"
                                        control={control}
                                        render={({ field }) => (
                                            <FormItem
                                                label="Closing Time"
                                                invalid={!!errors.closingHour}
                                                errorMessage={
                                                    errors.closingHour?.message
                                                }
                                            >
                                                <input
                                                    type="time"
                                                    {...field}
                                                    value={minutesToTime(
                                                        field.value,
                                                    )}
                                                    className={`
                                                        w-full h-11 px-4 bg-white dark:bg-gray-900 
                                                        border rounded-lg transition-all duration-200
                                                        text-gray-700 dark:text-gray-200
                                                        focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                                                        ${errors.closingHour ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                                                        `}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            timeToMinutes(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {closingHour <= openingHour && (
                                    <p className="text-red-500 text-sm mt-2">
                                        Closing time must be after opening time
                                    </p>
                                )}
                            </Card>

                            {/* Contact Information */}
                            <Card>
                                <h4 className="mb-4">Contact Information</h4>
                                <div className="space-y-4">
                                    <Controller
                                        name="contactNumber"
                                        control={control}
                                        render={({ field }) => (
                                            <FormItem
                                                label="Contact Number"
                                                invalid={!!errors.contactNumber}
                                                errorMessage={
                                                    errors.contactNumber
                                                        ?.message
                                                }
                                            >
                                                <Input
                                                    {...field}
                                                    placeholder="+959123456789"
                                                />
                                            </FormItem>
                                        )}
                                    />
                                    <Controller
                                        name="websiteUrl"
                                        control={control}
                                        render={({ field }) => (
                                            <FormItem
                                                label="Website URL (Optional)"
                                                invalid={!!errors.websiteUrl}
                                                errorMessage={
                                                    errors.websiteUrl?.message
                                                }
                                            >
                                                <Input
                                                    {...field}
                                                    placeholder="https://www.example.com"
                                                />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </Card>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <CuisineSection
                                control={control}
                                errors={errors}
                                cuisines={cuisines?.data}
                            />

                            {/* Payment Methods */}
                            <PaymentMethodsSection
                                control={control}
                                errors={errors}
                                paymentMethods={paymentMethods?.data}
                            />

                            {/* Amenities */}
                            <Card>
                                <h4 className="mb-4">Amenities & Policies</h4>
                                <div className="space-y-4">
                                    <Controller
                                        name="parking"
                                        control={control}
                                        render={({ field }) => (
                                            <FormItem>
                                                <Checkbox
                                                    checked={field.value}
                                                    onChange={field.onChange}
                                                >
                                                    Parking Available
                                                </Checkbox>
                                            </FormItem>
                                        )}
                                    />
                                    <Controller
                                        name="dressCode"
                                        control={control}
                                        render={({ field }) => (
                                            <FormItem
                                                label="Dress Code (Optional)"
                                                invalid={!!errors.dressCode}
                                                errorMessage={
                                                    errors.dressCode?.message
                                                }
                                            >
                                                <Input
                                                    {...field}
                                                    placeholder="e.g., Casual, Formal, Smart Casual"
                                                />
                                            </FormItem>
                                        )}
                                    />
                                    <Controller
                                        name="accessibility"
                                        control={control}
                                        render={({ field }) => (
                                            <FormItem
                                                label="Accessibility Information (Optional)"
                                                invalid={!!errors.accessibility}
                                                errorMessage={
                                                    errors.accessibility
                                                        ?.message
                                                }
                                            >
                                                <Input
                                                    {...field}
                                                    placeholder="e.g., Wheelchair accessible, Elevator available"
                                                />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </Container>
        </form>
    )
}

export default RestaurantProfileForm
