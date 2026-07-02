import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Card from '@/components/ui/Card'
import Checkbox from '@/components/ui/Checkbox'
import Container from '@/components/shared/Container'

export const tableSchema = z.object({
    type: z.enum(['vip', 'standard', 'family']),
    capacity: z.coerce
        .number()
        .min(1, 'Capacity must be at least 1')
        .max(20, 'Capacity max 20'),
    durationMinutes: z.coerce.number().optional().nullable(),
    tableFee: z.coerce.number().min(1, 'Table Fee must be greater than 0.'), //.optional().nullable(),
    status: z.enum(['active', 'inactive', 'maintenance']),
    services: z.array(z.string()).default([]),
})

export type TableFormData = z.infer<typeof tableSchema>
export type TableFormInput = z.input<typeof tableSchema>
export type TableFormOutput = z.output<typeof tableSchema>

interface TableFormProps {
    onFormSubmit: (data: TableFormData) => void
    defaultValues?: Partial<TableFormData>
    isNew?: boolean
    children?: React.ReactNode
}

const typeOptions = [
    { value: 'vip', label: 'VIP' },
    { value: 'standard', label: 'Standard' },
    { value: 'family', label: 'Family' },
]

const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'maintenance', label: 'Maintenance' },
]

const serviceOptions = [
    { value: 'WiFi', label: 'WiFi' },
    { value: 'Power outlet', label: 'Power outlet' },
    { value: 'Wheelchair accessible', label: 'Wheelchair accessible' },
    { value: 'Kids area', label: 'Kids area' },
    { value: 'Private room', label: 'Private room' },
    { value: 'Outdoor seating', label: 'Outdoor seating' },
]

const TableForm = ({
    onFormSubmit,
    defaultValues,
    isNew = true,
    children,
}: TableFormProps) => {
    const {
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<TableFormInput, any, TableFormOutput>({
        defaultValues: defaultValues || {
            type: 'standard',
            capacity: 4,
            durationMinutes: 90,
            tableFee: 0,
            status: 'active',
            services: [],
        },
        resolver: zodResolver(tableSchema),
    })

    useEffect(() => {
        if (defaultValues) reset(defaultValues)
    }, [defaultValues, reset])

    return (
        <Form onSubmit={handleSubmit(onFormSubmit)}>
            <Container>
                <div className="mb-6">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        {isNew ? 'Add New Table' : 'Edit Table'}
                    </h3>
                </div>
                <div className="mb-6">{children}</div>

                <div className="flex flex-col xl:flex-row gap-6">
                    <div className="flex-1 space-y-6">
                        <Card>
                            <h4 className="mb-4">Table Details</h4>
                            <div className="space-y-4">
                                <Controller
                                    name="type"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem
                                            label="Table Type"
                                            invalid={!!errors.type}
                                            errorMessage={errors.type?.message}
                                        >
                                            <Select
                                                options={typeOptions}
                                                value={typeOptions.find(
                                                    (opt) =>
                                                        opt.value ===
                                                        field.value,
                                                )}
                                                onChange={(opt) =>
                                                    field.onChange(opt?.value)
                                                }
                                            />
                                        </FormItem>
                                    )}
                                />
                                <Controller
                                    name="capacity"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem
                                            label="Capacity (persons)"
                                            invalid={!!errors.capacity}
                                            errorMessage={
                                                errors.capacity?.message
                                            }
                                        >
                                            <Input
                                                {...field}
                                                type="number"
                                                placeholder="e.g., 4"
                                                value={
                                                    (field.value as
                                                        | string
                                                        | number
                                                        | undefined) || ''
                                                }
                                            />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Controller
                                        name="durationMinutes"
                                        control={control}
                                        render={({ field }) => (
                                            <FormItem label="Duration (minutes)">
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder="90"
                                                    value={
                                                        (field.value as
                                                            | string
                                                            | number
                                                            | undefined) || ''
                                                    }
                                                />
                                            </FormItem>
                                        )}
                                    />
                                    <Controller
                                        name="tableFee"
                                        control={control}
                                        render={({ field }) => (
                                            <FormItem label="Table Fee (MMK)">
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder="0"
                                                    value={
                                                        (field.value as
                                                            | string
                                                            | number
                                                            | undefined) || ''
                                                    }
                                                />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem
                                            label="Status"
                                            invalid={!!errors.status}
                                            errorMessage={
                                                errors.status?.message
                                            }
                                        >
                                            <Select
                                                options={statusOptions}
                                                value={statusOptions.find(
                                                    (opt) =>
                                                        opt.value ===
                                                        field.value,
                                                )}
                                                onChange={(opt) =>
                                                    field.onChange(opt?.value)
                                                }
                                            />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </Card>
                    </div>
                    <div className="lg:w-95 space-y-6">
                        <Card>
                            <h4 className="mb-4">Services & Amenities</h4>
                            <Controller
                                name="services"
                                control={control}
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="space-y-2">
                                            {serviceOptions.map((option) => (
                                                <Checkbox
                                                    key={option.value}
                                                    checked={field.value?.includes(
                                                        option.value,
                                                    )}
                                                    onChange={(checked) => {
                                                        const current =
                                                            field.value || []
                                                        const nextValue =
                                                            checked
                                                                ? [
                                                                      ...current,
                                                                      option.value,
                                                                  ]
                                                                : current.filter(
                                                                      (v) =>
                                                                          v !==
                                                                          option.value,
                                                                  )
                                                        field.onChange(
                                                            nextValue,
                                                        )
                                                    }}
                                                >
                                                    {option.label}
                                                </Checkbox>
                                            ))}
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </Card>
                    </div>
                </div>
            </Container>
        </Form>
    )
}

export default TableForm
