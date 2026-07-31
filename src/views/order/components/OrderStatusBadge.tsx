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
    TbThumbUp,
    TbUserOff,
} from 'react-icons/tb'
import { OrderStatus } from '@/@types/order'

const statusConfig = {
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
    accepted: {
        label: 'Accepted',
        color: 'bg-indigo-100 text-indigo-700',
        icon: TbThumbUp,
    },
    preparing: {
        label: 'Preparing',
        color: 'bg-purple-100 text-purple-700',
        icon: TbAccessible,
    },
    ready_for_pickup: {
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
    const terminalStatuses = ['rejected', 'canceled', 'completed']

    const handleSelect = (newStatus: string) => {
        onChange(newStatus as OrderStatus)
    }
    const isTerminal = terminalStatuses.includes(status)

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
                {Object.entries(statusConfig).map(([key, config]) => (
                    <Dropdown.Item
                        key={key}
                        disabled={key === status || isLoading}
                        onClick={() => handleSelect(key)}
                    >
                        <div className="flex items-center gap-2">
                            <config.icon size={14} />
                            <span>{config.label}</span>
                            {key === status && (
                                <TbCheck className="ml-auto text-green-500" />
                            )}
                        </div>
                    </Dropdown.Item>
                ))}
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
