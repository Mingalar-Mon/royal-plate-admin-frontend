import Card from '@/components/ui/Card'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import Checkbox from '@/components/ui/Checkbox'
import type { Control, FieldErrors } from 'react-hook-form'
import type {
    RestaurantProfileFormSchema,
    PaymentMethod,
} from '../types/restaurantProfile.types'

interface PaymentMethodsSectionProps {
    control: Control<RestaurantProfileFormSchema>
    errors: FieldErrors<RestaurantProfileFormSchema>
    paymentMethods: PaymentMethod[]
}

const PaymentMethodsSection = ({
    control,
    errors,
    paymentMethods,
}: PaymentMethodsSectionProps) => {
    return (
        <Card>
            <h4 className="mb-4">Payment Methods</h4>
            <Controller
                name="paymentMethodIds"
                control={control}
                render={({ field }) => (
                    <FormItem
                        invalid={!!errors.paymentMethodIds}
                        errorMessage={errors.paymentMethodIds?.message}
                    >
                        <div className="grid grid-cols-2 gap-3">
                            {paymentMethods.map((method) => (
                                <label
                                    key={method.id}
                                    className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                                >
                                    <Checkbox
                                        checked={field.value?.includes(
                                            method.id,
                                        )}
                                        onChange={(checked) => {
                                            if (checked) {
                                                field.onChange([
                                                    ...(field.value || []),
                                                    method.id,
                                                ])
                                            } else {
                                                field.onChange(
                                                    field.value?.filter(
                                                        (id) =>
                                                            id !== method.id,
                                                    ),
                                                )
                                            }
                                        }}
                                    />
                                    <span>
                                        {method.icon && (
                                            <span className="mr-1">
                                                {method.icon}
                                            </span>
                                        )}
                                        {method.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                        {(!field.value || field.value.length === 0) && (
                            <p className="text-sm text-gray-500 mt-2">
                                Select at least one payment method
                            </p>
                        )}
                    </FormItem>
                )}
            />
        </Card>
    )
}

export default PaymentMethodsSection
