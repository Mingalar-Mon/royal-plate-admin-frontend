import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import type { Control, FieldErrors } from 'react-hook-form'
import type {
    RestaurantFormInput,
    RestaurantFormSchema,
} from '../types/restaurantForm.types'

interface PricingSectionProps {
    control: Control<RestaurantFormInput>
    errors: FieldErrors<RestaurantFormInput>
}

const PricingSection = ({ control, errors }: PricingSectionProps) => {
    return (
        <Card>
            <h4 className="mb-4">Pricing</h4>
            <div className="grid grid-cols-2 gap-4">
                <Controller
                    name="startingPrice"
                    control={control}
                    render={({ field }) => (
                        <FormItem
                            label="Starting Price (MMK)"
                            invalid={!!errors.startingPrice}
                            errorMessage={errors.startingPrice?.message}
                        >
                            <Input
                                {...field}
                                type="number"
                                placeholder="Minimum price"
                                value={field.value || ''}
                                onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                }
                            />
                        </FormItem>
                    )}
                />

                <Controller
                    name="endingPrice"
                    control={control}
                    render={({ field }) => (
                        <FormItem
                            label="Ending Price (MMK)"
                            invalid={!!errors.endingPrice}
                            errorMessage={errors.endingPrice?.message}
                        >
                            <Input
                                {...field}
                                type="number"
                                placeholder="Maximum price"
                                value={field.value || ''}
                                onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                }
                            />
                        </FormItem>
                    )}
                />
            </div>
        </Card>
    )
}

export default PricingSection
