import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import type { Control, FieldErrors, UseFormGetValues } from 'react-hook-form'
import type { RestaurantFormInput } from '@/@types/restaurant.type'

interface PricingSectionProps {
    control: Control<RestaurantFormInput>
    errors: FieldErrors<RestaurantFormInput>
    getValues: UseFormGetValues<RestaurantFormInput>
}

const PricingSection = ({ control, errors }: PricingSectionProps) => {
    return (
        <Card>
            <h4 className="mb-4">Pricing</h4>
            <div className="grid grid-cols-2 gap-4">
                <Controller
                    name="startingPrice"
                    control={control}
                    render={({
                        field: { onChange, onBlur, value, name, ref },
                    }) => (
                        <FormItem
                            label="Starting Price (MMK)"
                            invalid={!!errors.startingPrice}
                            errorMessage={errors.startingPrice?.message}
                        >
                            <Input
                                ref={ref}
                                name={name}
                                type="number"
                                placeholder="Minimum price"
                                value={
                                    (value as string | number | undefined) ?? ''
                                }
                                onChange={(e) => {
                                    const val = e.target.value
                                    onChange(val === '' ? '' : Number(val))
                                }}
                                onBlur={onBlur}
                            />
                        </FormItem>
                    )}
                />

                {/* {console.log('Error fields: ', errors)} */}
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
                                value={
                                    (field.value as
                                        | string
                                        | number
                                        | undefined) || ''
                                }
                                onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                }
                            />
                        </FormItem>
                    )}
                />
            </div>
            <div>
                <Controller
                    name="tax"
                    control={control}
                    render={({ field }) => {
                        console.log('Field: ', field)
                        return (
                            <FormItem
                                label="Tax (%)"
                                invalid={!!errors.tax}
                                errorMessage={errors.tax?.message}
                            >
                                <Input
                                    {...field}
                                    type="number"
                                    placeholder="0%"
                                    value={
                                        (field.value as
                                            | string
                                            | number
                                            | undefined) || ''
                                    }
                                />
                            </FormItem>
                        )
                    }}
                />
            </div>
        </Card>
    )
}

export default PricingSection
