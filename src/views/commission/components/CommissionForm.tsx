import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TbInfoCircle } from 'react-icons/tb'
import { Form, FormItem } from '@/components/ui/Form'
import Card from '@/components/ui/Card'
import NumericInput from '@/components/shared/NumericInput'
import Radio from '@/components/ui/Radio'
import Select from '@/components/ui/Select'
import Switcher from '@/components/ui/Switcher'
import { useGetRestaurantList } from '@/utils/custom-hooks/useRestaurant'
import {
    buildCommissionPayload,
    commissionBasisLabels,
    commissionDefaultValues,
    commissionValidationSchema,
    type CommissionBasis,
    type CommissionFormData,
    type CommissionFormInput,
    type CommissionFormOutput,
} from '@/@types/commission'

const basisOptions: { value: CommissionBasis; label: string }[] = [
    { value: 'SUBTOTAL', label: commissionBasisLabels.SUBTOTAL },
    { value: 'TABLE_FEE_ONLY', label: commissionBasisLabels.TABLE_FEE_ONLY },
]

const percentInputClass = 'max-w-40'

/**
 * States the configuration in plain language, so a rate is never set without
 * seeing what it will be applied to.
 */
const CommissionPreview = ({
    perOrder,
    orderPercent,
    perReservation,
    reservationPercent,
    reservationBasis,
}: Pick<
    CommissionFormInput,
    | 'perOrder'
    | 'orderPercent'
    | 'perReservation'
    | 'reservationPercent'
    | 'reservationBasis'
>) => {
    const lines: string[] = []

    if (perOrder) {
        lines.push(
            `Orders are charged ${orderPercent || '0'}% of the food subtotal.`,
        )
    }

    if (perReservation) {
        const target =
            reservationBasis === 'TABLE_FEE_ONLY'
                ? 'the table fee only'
                : 'the total bill (food + table fee)'
        lines.push(
            `Reservations are charged ${
                reservationPercent || '0'
            }% of ${target}.`,
        )
    }

    return (
        <div className="rounded-lg border border-primary/25 bg-primary/5 p-3">
            <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary">
                <TbInfoCircle />
                <span>This configuration will apply</span>
            </div>
            {lines.length > 0 ? (
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    {lines.map((line) => (
                        <li key={line}>{line}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Nothing is commissionable yet. Turn on orders or
                    reservations to set a rate.
                </p>
            )}
        </div>
    )
}

interface CommissionFormProps {
    onFormSubmit: (data: CommissionFormData) => void
    /** Seeds the restaurant, e.g. from the coverage panel's "Configure". */
    restaurantId?: string
    children?: React.ReactNode
}

const CommissionForm = ({
    onFormSubmit,
    restaurantId,
    children,
}: CommissionFormProps) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<CommissionFormInput, any, CommissionFormOutput>({
        defaultValues: {
            ...commissionDefaultValues,
            restaurantId: restaurantId ?? '',
        },
        resolver: zodResolver(commissionValidationSchema),
    })

    // Watched so the conditional fields and the preview react to the toggles.
    const [perOrder, perReservation, orderPercent, reservationPercent] =
        useWatch({
            control,
            name: [
                'perOrder',
                'perReservation',
                'orderPercent',
                'reservationPercent',
            ],
        })

    const { data: restaurantsResponse, isLoading: restaurantsLoading } =
        useGetRestaurantList()

    const restaurantOptions = (restaurantsResponse?.data || []).map(
        (restaurant) => ({
            value: restaurant.id,
            label: restaurant.name,
        }),
    )

    const filterRestaurantOption = (
        option: { label: string; value: string },
        search: string,
    ) => option.label.toLowerCase().includes(search.toLowerCase())

    return (
        <Form
            onSubmit={handleSubmit((values) =>
                onFormSubmit(buildCommissionPayload(values)),
            )}
        >
            <div className="space-y-4">
                <Controller
                    name="restaurantId"
                    control={control}
                    render={({ field }) => (
                        <FormItem
                            asterisk
                            label="Restaurant"
                            invalid={!!errors.restaurantId}
                            errorMessage={errors.restaurantId?.message}
                            extra="The batch applies to this restaurant only"
                        >
                            <Select
                                isSearchable
                                isClearable
                                size="sm"
                                placeholder="Search or select a restaurant"
                                isLoading={restaurantsLoading}
                                options={restaurantOptions}
                                filterOption={filterRestaurantOption}
                                noOptionsMessage={() => 'No restaurant found'}
                                value={
                                    restaurantOptions.find(
                                        (option) =>
                                            option.value === field.value,
                                    ) || null
                                }
                                onChange={(option) =>
                                    field.onChange(option?.value || '')
                                }
                                onBlur={field.onBlur}
                            />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <Card>
                        <h4 className="mb-4">Order Commission</h4>
                        <Controller
                            name="perOrder"
                            control={control}
                            render={({ field }) => (
                                <div className="mb-4 flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-medium">
                                            Charge on orders
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Applies to the food subtotal
                                        </p>
                                    </div>
                                    <Switcher
                                        checked={field.value}
                                        onChange={(checked) =>
                                            field.onChange(checked)
                                        }
                                    />
                                </div>
                            )}
                        />
                        {perOrder && (
                            <Controller
                                name="orderPercent"
                                control={control}
                                render={({ field }) => (
                                    <FormItem
                                        asterisk
                                        label="Order Percentage"
                                        invalid={!!errors.orderPercent}
                                        errorMessage={
                                            errors.orderPercent?.message
                                        }
                                        extra="0–100, up to 2 decimal places"
                                    >
                                        <NumericInput
                                            inputPrefix={
                                                <span className="text-gray-400">
                                                    %
                                                </span>
                                            }
                                            className={percentInputClass}
                                            placeholder="e.g. 10"
                                            value={field.value}
                                            onValueChange={(values) =>
                                                field.onChange(
                                                    values.value ?? '',
                                                )
                                            }
                                            onBlur={field.onBlur}
                                        />
                                    </FormItem>
                                )}
                            />
                        )}
                    </Card>

                    <Card>
                        <h4 className="mb-4">Reservation Commission</h4>
                        <Controller
                            name="perReservation"
                            control={control}
                            render={({ field }) => (
                                <div className="mb-4 flex items-start justify-between gap-3">
                                    <div>
                                        <p className="font-medium">
                                            Charge on reservations
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Set what it applies to below
                                        </p>
                                    </div>
                                    <Switcher
                                        checked={field.value}
                                        onChange={(checked) =>
                                            field.onChange(checked)
                                        }
                                    />
                                </div>
                            )}
                        />
                        {perReservation && (
                            <>
                                <Controller
                                    name="reservationPercent"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem
                                            asterisk
                                            label="Reservation Percentage"
                                            invalid={
                                                !!errors.reservationPercent
                                            }
                                            errorMessage={
                                                errors.reservationPercent
                                                    ?.message
                                            }
                                            extra="0–100, up to 2 decimal places"
                                        >
                                            <NumericInput
                                                inputPrefix={
                                                    <span className="text-gray-400">
                                                        %
                                                    </span>
                                                }
                                                className={percentInputClass}
                                                placeholder="e.g. 10"
                                                value={field.value}
                                                onValueChange={(values) =>
                                                    field.onChange(
                                                        values.value ?? '',
                                                    )
                                                }
                                                onBlur={field.onBlur}
                                            />
                                        </FormItem>
                                    )}
                                />
                                <Controller
                                    name="reservationBasis"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem
                                            asterisk
                                            label="Commission Applies To"
                                            className="mt-4"
                                        >
                                            <Radio.Group
                                                vertical
                                                value={field.value}
                                                onChange={(values) =>
                                                    field.onChange(values)
                                                }
                                            >
                                                {basisOptions.map((option) => (
                                                    <Radio
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </Radio>
                                                ))}
                                            </Radio.Group>
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}
                    </Card>
                </div>

                <Controller
                    name="is_active"
                    control={control}
                    render={({ field }) => (
                        <Card>
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-medium">
                                        Activate immediately
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {field.value
                                            ? 'This batch retires the restaurant’s current active batch and starts charging right away.'
                                            : 'Stage this configuration without changing what is currently charged.'}
                                    </p>
                                </div>
                                <Switcher
                                    checked={field.value}
                                    onChange={(checked) =>
                                        field.onChange(checked)
                                    }
                                />
                            </div>
                        </Card>
                    )}
                />

                {errors.perOrder && (
                    <p className="text-sm text-error">
                        {errors.perOrder.message}
                    </p>
                )}

                <Controller
                    name="reservationBasis"
                    control={control}
                    render={({ field }) => (
                        <CommissionPreview
                            perOrder={perOrder}
                            orderPercent={orderPercent}
                            perReservation={perReservation}
                            reservationPercent={reservationPercent}
                            reservationBasis={field.value}
                        />
                    )}
                />

                {children}
            </div>
        </Form>
    )
}

export default CommissionForm
