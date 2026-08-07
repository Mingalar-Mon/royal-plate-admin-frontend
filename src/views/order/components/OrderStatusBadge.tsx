// components/OrderStatusBadge.tsx
import Dropdown from '@/components/ui/Dropdown'
import Spinner from '@/components/ui/Spinner'
import {
    TbCheck,
    TbClock,
    TbX,
    TbCircleCheck,
    TbAccessible,
    TbAlarm,
    TbEraserOff,
    TbUserOff,
} from 'react-icons/tb'
import { OrderStatus } from '@/@types/order'

const statusConfig: Record<
    OrderStatus,
    {
        label: string
        color: string
        icon: typeof TbClock
    }
> = {
    pending: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-700',
        icon: TbClock,
    },
    confirmed: {
        label: 'Confirmed',
        color: 'text-blue-700 bg-blue-100',
        icon: TbCheck,
    },
    preparing: {
        label: 'Preparing',
        color: 'bg-purple-100 text-purple-700',
        icon: TbAccessible,
    },
    ready: {
        label: 'Ready',
        color: 'bg-green-100 text-green-700',
        icon: TbAlarm,
    },
    rejected: {
        label: 'Rejected',
        color: 'bg-red-100 text-red-700',
        icon: TbEraserOff,
    },
    canceled: {
        label: 'Canceled',
        color: 'bg-gray-100 text-gray-700',
        icon: TbX,
    },
    completed: {
        label: 'Completed',
        color: 'bg-emerald-100 text-blue-700',
        icon: TbCircleCheck,
    },

    no_show: {
        label: 'No Show',
        color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
        icon: TbUserOff,
    },
}

interface OrderStatusBadgeProps {
    status: OrderStatus
    onChange: (status: OrderStatus) => void
    isLoading?: boolean
}

const OrderStatusBadge = ({
    status,
    onChange,
    isLoading,
}: OrderStatusBadgeProps) => {
    const current = statusConfig[status]
    const terminalStatuses: OrderStatus[] = [
        OrderStatus.REJECTED,
        OrderStatus.CANCELED,
        OrderStatus.COMPLETED,
        OrderStatus.NO_SHOW,
    ]
    const statusTransitions: Partial<Record<OrderStatus, OrderStatus[]>> = {
        [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.REJECTED],
        [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING],
        [OrderStatus.PREPARING]: [OrderStatus.READY],
        [OrderStatus.READY]: [OrderStatus.COMPLETED, OrderStatus.NO_SHOW],
    }

    const isTerminal = terminalStatuses.includes(status)
    const selectableStatuses = [
        status,
        ...(statusTransitions[status] ?? []),
    ].filter((value, index, values) => values.indexOf(value) === index)

    if (!isTerminal) {
        return (
            <Dropdown
                renderTitle={
                    <div
                        className={`px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 cursor-pointer ${current.color} ${isLoading ? 'opacity-60' : ''}`}
                    >
                        {isLoading ? (
                            <Spinner size={14} />
                        ) : (
                            <current.icon size={14} />
                        )}
                        {current.label}
                    </div>
                }
                placement="bottom-start"
            >
                {selectableStatuses.map((key) => {
                    const config = statusConfig[key]

                    return (
                        <Dropdown.Item
                            key={key}
                            disabled={key === status || isLoading}
                            onClick={() => onChange(key)}
                        >
                            <div className="flex items-center gap-2">
                                <config.icon size={14} />
                                <span>{config.label}</span>
                                {key === status && (
                                    <TbCheck className="ml-auto text-green-500" />
                                )}
                            </div>
                        </Dropdown.Item>
                    )
                })}
            </Dropdown>
        )
    }

    return (
        <div
            className={`px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 cursor-pointer ${current.color}`}
        >
            <current.icon size={14} />
            {current.label}
        </div>
    )
}

export default OrderStatusBadge
