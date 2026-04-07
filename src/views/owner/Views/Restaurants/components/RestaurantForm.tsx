import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import isEmpty from 'lodash/isEmpty'
import BasicInfoSection from './BasicInfoSection'
import PricingSection from './PricingSection'
import LocationSection from './LocationSection'
import ImageSection from './ImageSection'
import StaffSection from './StaffSection'
import {
    restaurantValidationSchema,
    type RestaurantFormSchema,
} from '../types/restaurantForm.types'

interface RestaurantFormProps {
    onFormSubmit: (values: RestaurantFormSchema) => void
    defaultValues?: RestaurantFormSchema
    isNew?: boolean
    useMockStaff?: boolean
    children?: React.ReactNode
}

const RestaurantForm = (props: RestaurantFormProps) => {
    const {
        onFormSubmit,
        defaultValues = { imageUrls: [], staffIds: [] },
        children,
        isNew = false,
        useMockStaff = true,
    } = props

    const {
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        control,
    } = useForm<RestaurantFormSchema>({
        defaultValues: defaultValues,
        resolver: zodResolver(restaurantValidationSchema),
    })

    // Reset form when defaultValues changes
    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
    }, [JSON.stringify(defaultValues), reset])

    const onSubmit = (values: RestaurantFormSchema) => {
        onFormSubmit(values)
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Container>
                {/* Header with buttons */}
                <div className="flex items-center justify-between mb-6">
                    {children}
                </div>

                {/* Two Column Layout */}
                <div className="flex flex-col xl:flex-row gap-6">
                    {/* Left Column */}
                    <div className="flex-1 flex flex-col gap-6">
                        <BasicInfoSection
                            control={control}
                            errors={errors}
                            isNew={isNew}
                        />
                        <PricingSection control={control} errors={errors} />
                        <LocationSection
                            control={control}
                            errors={errors}
                            isNew={isNew}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="lg:w-[440px] flex flex-col gap-6">
                        <ImageSection control={control} errors={errors} />
                        <StaffSection
                            control={control}
                            errors={errors}
                            useMockData={useMockStaff}
                        />
                    </div>
                </div>
            </Container>
        </Form>
    )
}

export default RestaurantForm
