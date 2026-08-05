import { Dropdown } from '@/components/ui'
import { TbCheck } from 'react-icons/tb'

const statusConfig = {
    active: { label: 'Active', color: 'bg-green-100 text-green-700' },
    inactive: { label: 'Inactive', color: 'bg-red-100 text-red-700' },
    maintenance: {
        label: 'Maintenance',
        color: 'bg-orange-100 text-orange-700',
    },
}

const TableStatusBadge = ({
    status,
    onChange,
    isLoading,
}: {
    status: keyof typeof statusConfig
    onChange: any
    isLoading: boolean
}) => {
    const current = statusConfig[status]
    const handleSelect = (newStatus: string) => {
        onChange(newStatus)
    }
    return (
        <Dropdown
            renderTitle={
                <div
                    className={`px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 cursor-pointer ${current.color}`}
                >
                    {/* <current.icon size={14} /> */}
                    {current.label}
                </div>
            }
            placement="bottom-start"
        >
            {Object.entries(statusConfig).map(([key, config]) => (
                <Dropdown.Item
                    key={key}
                    disabled={key === status}
                    onClick={() => handleSelect(key)}
                >
                    <div className="flex items-center gap-2">
                        {/* <config.icon size={14} /> */}
                        <span>{config.label}</span>
                        {key === status && (
                            <TbCheck className="ml-auto text-green-500" />
                        )}
                    </div>
                </Dropdown.Item>
            ))}
        </Dropdown>
        // <span
        //     className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}
        // >
        //     {config.label}
        // </span>
    )
}

export default TableStatusBadge
