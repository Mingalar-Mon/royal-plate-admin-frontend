import { Dropdown } from '@/components/ui'
import { keyBy } from 'lodash'
import { useState } from 'react'
import { classNames } from 'react-easy-crop/helpers'
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

const DishAvailableStatusBadge = ({ status, onChange, isLoading }: any) => {
    const [isOpen, setIsOpen] = useState(false)
    const current = statusConfig[status]

    const handleSelect = (newStatus: string) => {
        onChange(newStatus)
        setIsOpen(false)
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
            disabled={isLoading}
        >
            {Object.entries(statusConfig).map(([key, config]) => (
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

export default DishAvailableStatusBadge
