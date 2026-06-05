import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
// import Container from '@/components/shared/Container'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import OrderForm from '../components/OrderForm'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import type { OrderFormSchema } from '../types/order.type'
import PostLoginLayout from '@/components/layouts/PostLoginLayout'
import { useThemeStore } from '@/store/themeStore'
import { useCreateOrder } from '@/utils/custom-hooks/useOrder'

const OrderCreate = () => {
    const { restaurantId } = useParams()
    const navigate = useNavigate()
    const [discardOpen, setDiscardOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const layoutType = useThemeStore((state) => state.layout.type)
    const createOrder = useCreateOrder()

    const defaultValues: Partial<OrderFormSchema> = {
        restaurantId: restaurantId!,
        orderType: 'dine_in',
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
    }

    if (!restaurantId) {
        return <>RestaurantId missing</>
    }

    const handleSubmit = async (data: OrderFormSchema) => {
        setIsSubmitting(true)
        try {
            await createOrder.mutateAsync(data)
            toast.push(
                <Notification type="success">Order created!</Notification>,
                {
                    placement: 'top-center',
                },
            )
            navigate(`/restaurants/${restaurantId}/orders`)
        } catch (err) {
            console.log('Error in order create', err)
            toast.push(
                <Notification type="danger">
                    Failed to create order
                </Notification>,
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDiscard = () => setDiscardOpen(true)
    const confirmDiscard = () => {
        setDiscardOpen(false)
        navigate(`/restaurants/${restaurantId}/orders`)
    }

    return (
        <PostLoginLayout layoutType={layoutType}>
            <OrderForm
                defaultValues={defaultValues as OrderFormSchema}
                restaurantId={restaurantId!}
                onFormSubmit={handleSubmit}
            >
                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="plain"
                        icon={<TbArrowNarrowLeft />}
                        onClick={() =>
                            navigate(`/restaurants/${restaurantId}/orders`)
                        }
                    >
                        Back to Orders
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="default"
                            icon={<TbTrash />}
                            className="text-red-500"
                            onClick={handleDiscard}
                        >
                            Discard
                        </Button>
                        <Button
                            type="submit"
                            variant="solid"
                            loading={isSubmitting}
                        >
                            Create Order
                        </Button>
                    </div>
                </div>
            </OrderForm>
            <ConfirmDialog
                isOpen={discardOpen}
                type="danger"
                title="Discard Order"
                onClose={() => setDiscardOpen(false)}
                onCancel={() => setDiscardOpen(false)}
                onConfirm={confirmDiscard}
            >
                <p>
                    Are you sure you want to discard this order? This action
                    cannot be undone.
                </p>
            </ConfirmDialog>
        </PostLoginLayout>
    )
}

export default OrderCreate
