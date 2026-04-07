import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import Checkbox from '@/components/ui/Checkbox'
import type { Control, FieldErrors } from 'react-hook-form'
import {
    type RestaurantProfileFormSchema,
    type Cuisine,
    MOCK_CUISINES,
} from '../types/restaurantProfile.type'

interface CuisineSectionProps {
    control: Control<RestaurantProfileFormSchema>
    errors: FieldErrors<RestaurantProfileFormSchema>
    cuisines?: Cuisine[]
}

const CuisineSection = ({
    control,
    errors,
    cuisines = MOCK_CUISINES,
}: CuisineSectionProps) => {
    return (
        <Card>
            <h4 className="mb-4">Cuisines</h4>
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
                        {(!field.value || field.value.length === 0) && (
                            <p className="text-sm text-gray-500 mt-2">
                                Select at least one cuisine type
                            </p>
                        )}
                    </FormItem>
                )}
            />
        </Card>
    )
}

export default CuisineSection
