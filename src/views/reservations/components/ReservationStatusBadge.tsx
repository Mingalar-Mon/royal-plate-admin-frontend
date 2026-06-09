// components/ReservationStatusBadge.tsx
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dropdown from '@/components/ui/Dropdown'
import {
    TbCheck,
    TbClock,
    TbX,
    TbCircleCheck,
    TbArmchair,
    TbUserOff,
} from 'react-icons/tb'
import {
    ReservationStatus,
    ReservationStatusColor,
} from '@/utils/Status/reservationStatus'

const statusConfig = {
    pending: {
        label: 'Pending',
        color: 'bg-yellow-100 text-yellow-700',
        icon: TbClock,
    },
    confirmed: {
        label: 'Confirmed',
        color: 'bg-green-100 text-green-700',
        icon: TbCheck,
    },
    canceled: {
        label: 'Canceled',
        color: 'bg-red-100 text-red-700',
        icon: TbX,
    },
    completed: {
        label: 'Completed',
        color: 'bg-blue-100 text-blue-700',
        icon: TbCircleCheck,
    },
    seated: {
        label: 'Seated',
        color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        icon: TbArmchair,
    },
    no_show: {
        label: 'No Show',
        color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
        icon: TbUserOff,
    },
}

const ReservationStatusBadge = ({ status, onChange, isLoading }: any) => {
    const [isOpen, setIsOpen] = useState(false)
    const current = ReservationStatusColor[status]
    // const current = statusConfig[status]

    const terminalStatuses = [
        ReservationStatus.NO_SHOW,
        ReservationStatus.CANCELED,
        ReservationStatus.COMPLETED,
    ]

    const handleSelect = (newStatus: string) => {
        onChange(newStatus)
        setIsOpen(false)
    }

    const isTerminal = terminalStatuses.includes(status)

    if (isTerminal) {
        return (
            <div
                className={`px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 cursor-pointer ${current.color}`}
            >
                <current.icon size={14} />
                {current.label}
            </div>
        )
    }
    return (
        <Dropdown
            renderTitle={
                <div
                    className={`px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 cursor-pointer ${current.color}`}
                >
                    <current.icon size={14} />
                    {current.label}
                </div>
            }
            placement="bottom-start"
        >
            {Object.entries(ReservationStatusColor).map(([key, config]) => (
                <Dropdown.Item
                    key={key}
                    disabled={key === status}
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

export default ReservationStatusBadge
