import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import type { Control, FieldErrors } from 'react-hook-form'
import type {
    RestaurantFormInput,
    RestaurantFormSchema,
} from '../types/restaurantForm.types'

interface BasicInfoSectionProps {
    control: Control<RestaurantFormInput>
    errors: FieldErrors<RestaurantFormInput>
    isNew?: boolean
}

const BasicInfoSection = ({ control, errors }: BasicInfoSectionProps) => {
    return (
        <Card>
            <h4 className="mb-4">Basic Information</h4>
            <div className="space-y-4">
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <FormItem
                            label="Restaurant Name"
                            invalid={!!errors.name}
                            errorMessage={errors.name?.message}
                        >
                            <Input
                                {...field}
                                placeholder="Enter restaurant name"
                            />
                        </FormItem>
                    )}
                />

                <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                        <FormItem
                            label="Address"
                            invalid={!!errors.address}
                            errorMessage={errors.address?.message}
                        >
                            <Input {...field} placeholder="Full address" />
                        </FormItem>
                    )}
                />
            </div>
        </Card>
    )
}

export default BasicInfoSection
