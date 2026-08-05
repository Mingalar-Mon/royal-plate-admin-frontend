import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import Checkbox from '@/components/ui/Checkbox'
import type { Control, FieldErrors } from 'react-hook-form'
import {
    type RestaurantProfileFormSchema,
    // type Cuisine,
} from '../types/restaurantProfile.type'
import { Cuisine } from '@/@types/cuisine'

interface CuisineSectionProps {
    control: Control<RestaurantProfileFormSchema>
    errors: FieldErrors<RestaurantProfileFormSchema>
    cuisines?: Cuisine[]
}

const CuisineSection = ({
    control,
    errors,
    cuisines = [],
}: CuisineSectionProps) => {
    return (
        <Card>
            <h4 className="mb-0">Cuisines</h4>
            {/* {(!field.value || field.value.length === 0) && ( */}
            <p className="text-xs text-gray-500 mb-3 ">
                Select at least one cuisine type
            </p>
            {/* )} */}
            <Controller
                name="cuisineIds"
                control={control}
                render={({ field }) => (
                    <FormItem
                        invalid={!!errors.cuisineIds}
                        errorMessage={errors.cuisineIds?.message}
                    >
                        <div className="grid grid-cols-2 gap-3">
                            {cuisines.map((cuisine) => (
                                <label
                                    key={cuisine.id}
                                    className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    <Checkbox
                                        checked={field.value?.includes(
                                            cuisine.id,
                                        )}
                                        onChange={(checked) => {
                                            if (checked) {
                                                field.onChange([
                                                    ...(field.value || []),
                                                    cuisine.id,
                                                ])
                                            } else {
                                                field.onChange(
                                                    field.value?.filter(
                                                        (id) =>
                                                            id !== cuisine.id,
                                                    ),
                                                )
                                            }
                                        }}
                                    />
                                    <div>
                                        <p className="font-medium">
                                            {cuisine.name}
                                        </p>
                                        {cuisine.description && (
                                            <p className="text-xs text-gray-500">
                                                {cuisine.description}
                                            </p>
                                        )}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </FormItem>
                )}
            />
        </Card>
    )
}

export default CuisineSection
