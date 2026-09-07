import { Dropdown } from '@/components/ui'
import { TbCheck, TbThumbDown, TbThumbUp } from 'react-icons/tb'

const statusConfig = {
    available: {
        label: 'Available',
        color: 'bg-green-100 text-green-700',
        icon: TbThumbUp,
    },
    unavailable: {
        label: 'Unavailable',
        color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
        icon: TbThumbDown,
    },
}

type DishStatus = keyof typeof statusConfig

interface DishAvailableStatusBadgeProps {
    status: DishStatus
    onChange: (status: DishStatus) => void
    isLoading?: boolean
}

const DishAvailableStatusBadge = ({
    status,
    onChange,
    isLoading,
}: DishAvailableStatusBadgeProps) => {
    const current = statusConfig[status]

    const handleSelect = (newStatus: DishStatus) => {
        onChange(newStatus)
    }
    return (
        <Dropdown
            renderTitle={
                <div
                    className={`inline-flex min-h-8 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${current.color}`}
                >
                    <current.icon size={14} />
                    {current.label}
                </div>
            }
            placement="bottom-start"
            disabled={isLoading}
        >
            {Object.entries(statusConfig).map(([key, config]) => (
                <Dropdown.Item
                    key={key}
                    disabled={key === status}
                    onClick={() => handleSelect(key as DishStatus)}
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

export default DishAvailableStatusBadge
