// components/OrderItemsSection.tsx
import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Controller, useFieldArray } from 'react-hook-form'
import { TbPlus, TbTrash, TbSearch, TbMinus } from 'react-icons/tb'
import Dialog from '@/components/ui/Dialog'
import type { Control, FieldErrors } from 'react-hook-form'
import type { OrderFormSchema, Dish } from '../types/order.type'
import { useGetDishes } from '@/utils/custom-hooks/useDish'

interface OrderItemsSectionProps {
    control: Control<OrderFormSchema>
    errors: FieldErrors<OrderFormSchema>
    restaurantId: string
}

const OrderItemsSection = ({
    control,
    errors,
    restaurantId,
}: OrderItemsSectionProps) => {
    const { fields, append, remove, update } = useFieldArray({
        control,
        name: 'items',
    })

    const [dishDialogOpen, setDishDialogOpen] = useState(false)
    const [editNotesIndex, setEditNotesIndex] = useState<number | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const { data: dishes, isLoading } = useGetDishes(restaurantId)

    const filteredDishes =
        dishes?.filter((dish: Dish) =>
            dish.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ) || []

    const addDish = (dish: Dish) => {
        const existingIndex = fields.findIndex(
            (item) => item.dishId === dish.id,
        )
        if (existingIndex >= 0) {
            // Increase quantity if already added
            const existing = fields[existingIndex]
            update(existingIndex, {
                ...existing,
                quantity: existing.quantity + 1,
                subtotal: (existing.quantity + 1) * existing.unitPrice,
            })
        } else {
            append({
                dishId: dish.id,
                name: dish.name,
                quantity: 1,
                unitPrice: dish.price,
                subtotal: dish.price,
                notes: '',
            })
        }
        setDishDialogOpen(false)
        setSearchTerm('')
    }

    const updateQuantity = (index: number, delta: number) => {
        const item = fields[index]
        const newQty = Math.max(1, item.quantity + delta)
        update(index, {
            ...item,
            quantity: newQty,
            subtotal: newQty * item.unitPrice,
        })
    }

    const updateItemNotes = (index: number, notes: string) => {
        const item = fields[index]
        update(index, { ...item, notes })
        setEditNotesIndex(null)
    }

    // Calculate totals (will also be used in OrderSummary)
    const subtotal = fields.reduce((sum, item) => sum + item.subtotal, 0)
    const tax = subtotal * 0.05 // 5% tax, adjust as needed
    const total = subtotal + tax

    return (
        <>
            <Card>
                <div className="flex justify-between items-center mb-4">
                    <h4>Order Items</h4>
                    <Button
                        type="button"
                        size="sm"
                        icon={<TbPlus />}
                        onClick={() => setDishDialogOpen(true)}
                    >
                        Add Dish
                    </Button>
                </div>

                <Controller
                    name="items"
                    control={control}
                    render={() => (
                        <>
                            {fields.length === 0 && (
                                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                                    <p className="text-gray-500">
                                        No items added yet
                                    </p>
                                    <Button
                                        type="button"
                                        variant="plain"
                                        onClick={() => setDishDialogOpen(true)}
                                        className="mt-2"
                                    >
                                        Add first dish
                                    </Button>
                                </div>
                            )}

                            {fields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="flex items-center justify-between p-3 mb-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                >
                                    <div className="flex-1">
                                        <div className="font-medium">
                                            {field.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {field.unitPrice.toLocaleString()}{' '}
                                            MMK
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            size="xs"
                                            icon={<TbMinus />}
                                            onClick={() =>
                                                updateQuantity(index, -1)
                                            }
                                        />
                                        <span className="w-8 text-center">
                                            {field.quantity}
                                        </span>
                                        <Button
                                            type="button"
                                            size="xs"
                                            icon={<TbPlus />}
                                            onClick={() =>
                                                updateQuantity(index, 1)
                                            }
                                        />
                                        <span className="w-20 text-right font-medium">
                                            {field.subtotal.toLocaleString()}{' '}
                                            MMK
                                        </span>
                                        <Button
                                            type="button"
                                            size="xs"
                                            icon={<TbTrash />}
                                            variant="plain"
                                            className="text-red-500"
                                            onClick={() => remove(index)}
                                        />
                                    </div>
                                    {editNotesIndex === index && (
                                        <div className="mt-2 border-t pt-2">
                                            <label className="block text-sm font-medium mb-1">
                                                Item Notes (e.g., no onion)
                                            </label>
                                            <Input
                                                defaultValue={field.notes}
                                                onBlur={(e) =>
                                                    updateItemNotes(
                                                        index,
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Special request for this dish"
                                                autoFocus
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {fields.length > 0 && (
                                <div className="mt-4 pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">
                                            Subtotal
                                        </span>
                                        <span>
                                            {subtotal.toLocaleString()} MMK
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                        <span>Tax (5%)</span>
                                        <span>{tax.toLocaleString()} MMK</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2 pt-2 border-t font-bold">
                                        <span>Total</span>
                                        <span className="text-lg text-primary-600">
                                            {total.toLocaleString()} MMK
                                        </span>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                />
            </Card>

            {/* Dish Selection Dialog */}
            <Dialog
                isOpen={dishDialogOpen}
                onClose={() => setDishDialogOpen(false)}
                onRequestClose={() => setDishDialogOpen(false)}
                width={600}
                title="Select Dish"
            >
                <div className="p-4">
                    <div className="relative mb-4">
                        <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Search dishes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {isLoading ? (
                        <div className="text-center py-8">Loading...</div>
                    ) : (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {filteredDishes.map((dish: Dish) => (
                                <div
                                    key={dish.id}
                                    className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                                    onClick={() => addDish(dish)}
                                >
                                    <div>
                                        <div className="font-medium">
                                            {dish.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {dish.price.toLocaleString()} MMK
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        size="sm"
                                        icon={<TbPlus />}
                                    />
                                </div>
                            ))}
                            {filteredDishes.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    No dishes found
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Dialog>
        </>
    )
}

export default OrderItemsSection
