import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import Textarea from '@/components/ui/Textarea'
import Checkbox from '@/components/ui/Checkbox'
import { TbArrowNarrowLeft } from 'react-icons/tb'
import PostLoginLayout from '@/components/layouts/PostLoginLayout'
import { useThemeStore } from '@/store/themeStore'
import CuisineSection from './CuisineSection'
import PaymentMethodsSection from './PaymentMethodsSection'
import {
    restaurantProfileValidationSchema,
    type RestaurantProfileFormSchema,
    MOCK_CUISINES,
    MOCK_PAYMENT_METHODS,
} from '../types/restaurantProfile.type'
import {
    useCreateRestaurantProfile,
    useUpdateRestaurantProfile,
    useGetAllCuisines,
    useGetAllPaymentMethods,
    useGetRestaurantProfile,
} from '../../../hooks/useRestaurantProfile'
import { dataTagSymbol } from '@tanstack/react-query'
import { useGetRestaurant } from '@/views/owner/hooks/useRestaurant'
import {
    RestaurantFormSchema,
    restaurantValidationSchema,
} from '../../Restaurants/types/restaurantForm.types'

interface RestaurantProfileFormProps {
    isEditMode: boolean
}

const RestaurantProfileForm = ({ isEditMode }: RestaurantProfileFormProps) => {
    const { restaurantId, profileId } = useParams()
    console.log(restaurantId, profileId)
    const navigate = useNavigate()
    const layoutType = useThemeStore((state) => state.layout.type)

    // Fetch existing profile if in edit mode
    const { data: existingProfile, isLoading: isLoadingProfile } =
        useGetRestaurantProfile(isEditMode ? (profileId as string) : '')
    // console.log('Existing profile', existingProfile)

    // Fetch cuisines and payment methods (use mock or real API)
    const { data: cuisines = MOCK_CUISINES, isLoading: isLoadingCuisines } =
        useGetAllCuisines()

    const {
        data: paymentMethods = MOCK_PAYMENT_METHODS,
        isLoading: isLoadingPaymentMethods,
    } = useGetAllPaymentMethods()

    // console.log('Payment methods: ', paymentMethods)

    const createMutation = useCreateRestaurantProfile()
    const updateMutation = useUpdateRestaurantProfile()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        watch,
    } = useForm<RestaurantFormSchema>({
        resolver: zodResolver(restaurantValidationSchema),
        defaultValues: {
            description: '',
            openingHour: 9,
            closingHour: 22,
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
        if (existingProfile && isEditMode) {
            reset({
                description: existingProfile.description,
                openingHour: existingProfile.openingHour,
                closingHour: existingProfile.closingHour,
                contactNumber: existingProfile.contactNumber,
                websiteUrl: existingProfile.websiteUrl || '',
                parking: existingProfile.parking,
                dressCode: existingProfile.dressCode || '',
                accessibility: existingProfile.accessibility || '',
                cuisineIds: existingProfile.cuisines.map((c) => c.id),
                paymentMethodIds: existingProfile.paymentMethods.map(
                    (p) => p.id,
                ),
            })
        }
    }, [existingProfile, isEditMode, reset])

    const onSubmit = async (data: RestaurantProfileFormSchema) => {
        console.log('Edit mode: ', isEditMode)
        console.log('Data to be updated: ', data)
        try {
            if (isEditMode) {
                console.log('data to be updated: ', data)
                await updateMutation.mutateAsync({
                    profileId: profileId as string,
                    data,
                })

                navigate(`/restaurant/profile/${profileId}`)
            } else {
                await createMutation.mutateAsync({
                    restaurantId: restaurantId as string,
                    data,
                })

                console.log('Success')

                navigate(`/restaurant/profile/${profileId}`)
            }
        } catch (error) {
            console.error('Form submission error:', error)
        }
    }

    if (isLoadingProfile || isLoadingCuisines || isLoadingPaymentMethods) {
        return (
            <PostLoginLayout layoutType={layoutType}>
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                </div>
            </PostLoginLayout>
        )
    }

    return (
        <PostLoginLayout layoutType={layoutType}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Container>
                    <div className="py-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <Button
                                type="button"
                                variant="plain"
                                icon={<TbArrowNarrowLeft />}
                                onClick={() =>
                                    navigate(
                                        profileId
                                            ? `/restaurant/profile/${restaurantId}`
                                            : `/owner/dashboard`,
                                        // `/restaurant/profile/${restaurantId ?? profileId}`,
                                    )
                                }
                            >
                                Back to Restaurant
                            </Button>
                            <Button
                                type="submit"
                                variant="solid"
                                loading={isSubmitting}
                            >
                                {isEditMode
                                    ? 'Update Profile'
                                    : 'Create Profile'}
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
                                                    invalid={
                                                        !!errors.openingHour
                                                    }
                                                    errorMessage={
                                                        errors.openingHour
                                                            ?.message
                                                    }
                                                >
                                                    <select
                                                        {...field}
                                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                Number(
                                                                    e.target
                                                                        .value,
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
                                                                          : i ===
                                                                              12
                                                                            ? '12:00 PM'
                                                                            : `${i - 12}:00 PM`}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                </FormItem>
                                            )}
                                        />
                                        <Controller
                                            name="closingHour"
                                            control={control}
                                            render={({ field }) => (
                                                <FormItem
                                                    label="Closing Time"
                                                    invalid={
                                                        !!errors.closingHour
                                                    }
                                                    errorMessage={
                                                        errors.closingHour
                                                            ?.message
                                                    }
                                                >
                                                    <select
                                                        {...field}
                                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                Number(
                                                                    e.target
                                                                        .value,
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
                                                                          : i ===
                                                                              12
                                                                            ? '12:00 PM'
                                                                            : `${i - 12}:00 PM`}
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    {closingHour <= openingHour && (
                                        <p className="text-red-500 text-sm mt-2">
                                            Closing time must be after opening
                                            time
                                        </p>
                                    )}
                                </Card>

                                {/* Contact Information */}
                                <Card>
                                    <h4 className="mb-4">
                                        Contact Information
                                    </h4>
                                    <div className="space-y-4">
                                        <Controller
                                            name="contactNumber"
                                            control={control}
                                            render={({ field }) => (
                                                <FormItem
                                                    label="Contact Number"
                                                    invalid={
                                                        !!errors.contactNumber
                                                    }
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
                                                    invalid={
                                                        !!errors.websiteUrl
                                                    }
                                                    errorMessage={
                                                        errors.websiteUrl
                                                            ?.message
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
                                {/* Cuisines */}
                                <CuisineSection
                                    control={control}
                                    errors={errors}
                                    cuisines={cuisines}
                                />

                                {/* Payment Methods */}
                                <PaymentMethodsSection
                                    control={control}
                                    errors={errors}
                                    paymentMethods={paymentMethods}
                                />

                                {/* Amenities */}
                                <Card>
                                    <h4 className="mb-4">
                                        Amenities & Policies
                                    </h4>
                                    <div className="space-y-4">
                                        <Controller
                                            name="parking"
                                            control={control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onChange={
                                                            field.onChange
                                                        }
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
                                                        errors.dressCode
                                                            ?.message
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
                                                    invalid={
                                                        !!errors.accessibility
                                                    }
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
        </PostLoginLayout>
    )
}

export default RestaurantProfileForm
