import { useEffect } from 'react'
import { Form, FormItem } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'

import Select from '@/components/ui/Select'

import OrderItemsSection from './OrderItemsSection'
import {
    orderValidationSchema,
    type OrderFormSchema,
} from '../types/order.type'
import { RichTextEditor } from '@/components/shared'

interface OrderFormProps {
    onFormSubmit: (values: OrderFormSchema) => void
    defaultValues?: OrderFormSchema
    restaurantId: string
    children?: React.ReactNode
}

const OrderForm = ({
    onFormSubmit,
    defaultValues,
    restaurantId,
    children,
}: OrderFormProps) => {
    const {
        handleSubmit,
        // reset,
        formState: { errors },
        control,
        setValue,
        watch,
    } = useForm<OrderFormSchema>({
        defaultValues: defaultValues || {
            orderType: 'dine_in',
            items: [],
            subtotal: 0,
            tax: 0,
            total: 0,
        },
        resolver: zodResolver(orderValidationSchema),
    })

    const items = watch('items')
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
    const tax = subtotal * 0.05
    const total = subtotal + tax

    useEffect(() => {
        setValue('subtotal', subtotal)
        setValue('tax', tax)
        setValue('total', total)
    }, [subtotal, tax, total, setValue])

    const onSubmit = (values: OrderFormSchema) => {
        onFormSubmit(values)
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Container>
                <div className="mb-6">{children}</div>
                <div className="flex flex-col xl:flex-row gap-6">
                    {/* Left Column - Customer Info */}
                    <div className="flex-1 space-y-6">
                        <Card>
                            <h4 className="mb-4">Customer Information</h4>
                            <div className="space-y-4">
                                <Controller
                                    name="customerName"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem
                                            label="Customer Name"
                                            invalid={!!errors.customerName}
                                            errorMessage={
                                                errors.customerName?.message
                                            }
                                        >
                                            <Input
                                                {...field}
                                                placeholder="Enter customer name"
                                            />
                                        </FormItem>
                                    )}
                                />
                                <Controller
                                    name="customerPhone"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem
                                            label="Phone Number"
                                            invalid={!!errors.customerPhone}
                                            errorMessage={
                                                errors.customerPhone?.message
                                            }
                                        >
                                            <Input
                                                {...field}
                                                placeholder="09xxxxxxxxx"
                                            />
                                        </FormItem>
                                    )}
                                />
                                <Controller
                                    name="orderType"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem label="Order Type">
                                            <Select
                                                options={[
                                                    {
                                                        value: 'dine_in',
                                                        label: 'Dine In',
                                                    },
                                                    {
                                                        value: 'takeaway',
                                                        label: 'Takeaway',
                                                    },
                                                    {
                                                        value: 'delivery',
                                                        label: 'Delivery',
                                                    },
                                                ]}
                                                value={
                                                    field.value
                                                        ? {
                                                              value: field.value,
                                                              label: field.value.replace(
                                                                  '_',
                                                                  ' ',
                                                              ),
                                                          }
                                                        : null
                                                }
                                                onChange={(opt) =>
                                                    field.onChange(opt?.value)
                                                }
                                            />
                                        </FormItem>
                                    )}
                                />
                                <Controller
                                    name="specialInstructions"
                                    control={control}
                                    render={({ field }) => (
                                        <FormItem label="Special Instructions (Optional)">
                                            <RichTextEditor
                                                {...field}
                                                rows={3}
                                                placeholder="Any special requests or notes..."
                                                // height={150}
                                            />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </Card>
                    </div>

                    {/* Right Column - Order Items */}
                    <div className="lg:w-[500px] space-y-6">
                        <OrderItemsSection
                            control={control}
                            errors={errors}
                            restaurantId={restaurantId}
                        />
                        <Controller
                            name="paymentMethod"
                            control={control}
                            render={({ field }) => (
                                <Card>
                                    <h4 className="mb-4">Payment Method</h4>
                                    <Select
                                        options={[
                                            { value: 'cash', label: 'Cash' },
                                            {
                                                value: 'card',
                                                label: 'Credit/Debit Card',
                                            },
                                            {
                                                value: 'mobile',
                                                label: 'Mobile Payment',
                                            },
                                        ]}
                                        value={
                                            field.value
                                                ? {
                                                      value: field.value,
                                                      label: field.value,
                                                  }
                                                : null
                                        }
                                        onChange={(opt) =>
                                            field.onChange(opt?.value)
                                        }
                                    />
                                </Card>
                            )}
                        />
                    </div>
                </div>
            </Container>
        </Form>
    )
}

export default OrderForm
